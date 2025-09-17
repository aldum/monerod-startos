import { sdk } from './sdk'
import { checkSyncProgress, datadir, p2pPort, rpcPort, rrpcPort } from './utils'
import { chown, mkdir } from 'fs/promises'
import { getSubC } from './subcontainers/monero'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('+++++++++++++++++++ Starting Monero! +++++++++++++++++++')

  const monC = await getSubC(effects)

  const mainPath = '/media/startos/volumes/main/'
  mkdir(`${mainPath}/bitmonero/lmdb`, { recursive: true })
  chown(`${mainPath}/bitmonero`, 1000, 1000)
  chown(`${mainPath}/bitmonero/lmdb`, 1000, 1000)

  const home = '/home/monero'
  return sdk.Daemons.of(effects, started)
    .addDaemon('primary', {
      subcontainer: monC,
      exec: {
        command: [
          '/entrypoint.sh',
          `--data-dir=${datadir}`,
          "--prune-blockchain",
          "--fast-block-sync", "1",
          // "--restricted-rpc",
          // "--rpc-restricted-bind-ip=0.0.0.0",
          // `--rpc-restricted-bind-port=${rrpcPort}`,
          "--rpc-bind-ip=0.0.0.0",
          `--rpc-bind-port=${rpcPort}`,
          "--rpc-restricted-bind-ip=0.0.0.0",
          "--confirm-external-bind",
          "--no-igd",
          "--no-zmq",
          "--enable-dns-blocklist",
          `--ban-list=${home}/ban_list.txt`,
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
