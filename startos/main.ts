import { sdk } from './sdk'
import {
  checkSyncProgress, datadir,
  getP2pPort, getRpcPort, rrpcPort
} from './utils'
import { chown, mkdir } from 'fs/promises'
import { getSubC } from './subcontainers/monero'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('+++++++++++++++++++ Starting Monero! +++++++++++++++++++')

  const store = await storeJson.read().once()
  const monC = await getSubC(effects)

  const mainPath = '/media/startos/volumes/main'
  const datadirLXC = `${mainPath}/bitmonero`
  const lmdbdirLXC = `${datadirLXC}/lmdb`
  mkdir(lmdbdirLXC, { recursive: true },)
  chown(datadirLXC, 1000, 1000)
  chown(lmdbdirLXC, 1000, 1000)


  const { exitCode, stdout, stderr } = await monC.exec(
    ['chattr', '-R', '+C', `${datadir}/lmdb`], {
    user: 'root'
  })
  if (exitCode !== 0) {
    console.log("Error running chattr:")
    console.log(JSON.stringify(stdout, null, 2))
    console.log(JSON.stringify(stderr, null, 2))
  }
  await monC.exec(['touch', `${datadir}/ban_list.txt`])

  const p2pPort = await getP2pPort()
  const rpcPort = await getRpcPort()
  const home = '/home/monero'
  const testnet = store?.network === 'testnet'

  const moneroArgs = [
    `--data-dir=${datadir}`,
    "--prune-blockchain",
    "--fast-block-sync", "1",
    `--rpc-bind-port=${rpcPort}`,
    "--rpc-restricted-bind-ip=0.0.0.0",
    `--rpc-restricted-bind-port=${rrpcPort}`,
    "--zmq-rpc-bind-ip=0.0.0.0",
    "--no-igd",
    "--enable-dns-blocklist",
    `--ban-list=${datadir}/ban_list.txt`,
  ]
  if (testnet) { moneroArgs.push('--testnet') }

  return sdk.Daemons.of(effects, started)
    .addDaemon('primary', {
      subcontainer: monC,
      exec: {
        command: ['/entrypoint.sh', ...moneroArgs],
        user: 'monero',
        cwd: home,
      },
      ready: {
        display: 'P2P Interface',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, p2pPort, {
            successMessage: 'The P2P interface is ready',
            errorMessage: 'P2P unreachable',
          }),
      },
      requires: [],
    })
    .addHealthCheck('sync-progress', {
      ready: {
        display: 'Blockchain Sync Progress',
        fn: async () => {
          return await checkSyncProgress(monC)
        },
        gracePeriod: 10000,

      },
      requires: ['primary'],
    })
})
