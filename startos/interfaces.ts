import { sdk } from './sdk'
import { p2pPort, rpcPort, rrpcPort } from './utils'

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
    description: 'The P2P interface of Monero',
    type: 'p2p',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const p2pReceipt = await p2pMultiOrigin.export([p2p])

  const rpcMulti = sdk.MultiHost.of(effects, 'rpc')
  const rpcMultiOrigin = await rpcMulti.bindPort(rpcPort, {
    protocol: null,
    preferredExternalPort: p2pPort,
    secure: { ssl: false },
    addSsl: null
  })
  const rpc = sdk.createInterface(effects, {
    name: 'RPC',
    id: 'rpc',
    description: 'The RPC interface',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const rpcReceipt = await rpcMultiOrigin.export([rpc])

  const rrpcMulti = sdk.MultiHost.of(effects, 'rrpc')
  const rrpcMultiOrigin = await rrpcMulti.bindPort(rrpcPort, {
    protocol: null,
    preferredExternalPort: rrpcPort,
    secure: { ssl: false },
    addSsl: null
  })
  const rrpc = sdk.createInterface(effects, {
    name: 'RPC',
    id: 'rpc',
    description: 'Restricted RPC interface',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const rrpcReceipt = await rrpcMultiOrigin.export([rrpc])

  return [p2pReceipt, rpcReceipt, rrpcReceipt]
})
