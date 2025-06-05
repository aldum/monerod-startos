import { sdk } from './sdk'
import { p2pPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const p2pMulti = sdk.MultiHost.of(effects, 'p2p')
  const p2pMultiOrigin = await p2pMulti.bindPort(p2pPort, {
    protocol: null,
    preferredExternalPort: p2pPort,
    secure: { ssl: false },
    addSsl: null
  })
  const p2p = sdk.createInterface(effects, {
    name: 'P2P',
    id: 'p2p',
    description: 'The P2p interface of Monero',
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const p2pReceipt = await p2pMultiOrigin.export([p2p])

  return [p2pReceipt]
})
