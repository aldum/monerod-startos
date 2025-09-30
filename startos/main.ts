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

  const mainPath = '/media/startos/volumes/main/'
  mkdir(`${mainPath}/bitmonero/lmdb`, { recursive: true })
  chown(`${mainPath}/bitmonero`, 1000, 1000)
  chown(`${mainPath}/bitmonero/lmdb`, 1000, 1000)

  const p2pPort = await getP2pPort()
  const rpcPort = await getRpcPort()
  const home = '/home/monero'
  const testnet = store?.network === 'testnet'

  return sdk.Daemons.of(effects, started)
    .addDaemon('primary', {
      subcontainer: monC,
      exec: {
        command: [
          '/entrypoint.sh',
          `--data-dir=${datadir}`,
          "--prune-blockchain",
          "--fast-block-sync", "1",
          "--rpc-bind-ip=0.0.0.0",
          // `--rpc-bind-port=${rpcPort}`,
          // "--restricted-rpc",
          "--rpc-restricted-bind-ip=0.0.0.0",
          // `--rpc-restricted-bind-port=${rrpcPort}`,
          "--confirm-external-bind",
          "--zmq-rpc-bind-ip=0.0.0.0",
          "--no-igd",
          "--enable-dns-blocklist",
          `--ban-list=${home}/ban_list.txt`,
          testnet ? '--testnet' : '',
        ],
        user: 'monero',
        cwd: home,
      },
      ready: {
        display: 'P2P Interface',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, p2pPort, {
            successMessage: 'The P2P interface is ready',
            errorMessage: '',
          }),
      },
      requires: [],
    })
    .addHealthCheck('sync-progress', {
      ready: {
        display: 'Blockchain Sync Progress',
        fn: async () => {
          const r = await checkSyncProgress(monC)
          return r
        },
        gracePeriod: 10000,

      },
      requires: ['primary'],
    })
})
