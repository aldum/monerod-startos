import { sdk } from '../sdk'
import { datadir } from '../utils'
import { Effects } from
  '@start9labs/start-sdk/base/lib/Effects'

export const mounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'main',
    subpath: 'bitmonero',
    mountpoint: datadir,
    readonly: false,
  })

export const getSubC =
  async (effects: Effects) => sdk.SubContainer.of(
    effects,
    { imageId: 'monero' },
    mounts,
    'monero-sub',
  )
