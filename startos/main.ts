import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { datadir, p2pPort, rrpcPort } from './utils'
import { chown, mkdir } from 'fs/promises'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting Monero!')

  const healthChecks: T.HealthCheck[] = []

  const monMounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: 'bitmonero',
      mountpoint: datadir,
      readonly: false,
    })
  //   .mountAssets({
  //   mountpoint: '/entrypoint.sh',
  //   subpath: '/entrypoint.sh',
  //   type: 'file'
  // })
  const monc = await sdk.SubContainer.of(
    effects,
    { imageId: 'monero' },
    monMounts,
    'monero-sub',
  )

  const mainPath = '/media/startos/volumes/main/'
  mkdir(`${mainPath}/bitmonero/lmdb`, { recursive: true })
  chown(`${mainPath}/bitmonero`, 1000, 1000)
  chown(`${mainPath}/bitmonero/lmdb`, 1000, 1000)

  return sdk.Daemons.of(effects, started, healthChecks).addDaemon('primary', {
    subcontainer: monc,
    command: [
      '/entrypoint.sh',
      `--data-dir=${datadir}`,
      `--prune-blockchain`,
      "--rpc-restricted-bind-ip=0.0.0.0",
      `--rpc-restricted-bind-port=${rrpcPort}`,
      "--no-igd",
      "--no-zmq",
      "--enable-dns-blocklist",
      "--ban-list=/home/monero/ban_list.txt"
    ],
    cwd: '/home/monero',
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
})
