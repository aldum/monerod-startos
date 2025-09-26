import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, literals } = matches

const shape = object({
  network: literals('mainnet', 'testnet')
})

export const storeJson = FileHelper.json(
  {
    volumeId: 'main',
    subpath: '/store.json',
  },
  shape,
)
