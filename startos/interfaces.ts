import { sdk } from './sdk'
import { getP2pPort, getRpcPort, getZmqPort, rrpcPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const p2pMulti = sdk.MultiHost.of(effects, 'p2p')
  const p2pPort = await getP2pPort()
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
  const rpcPort = await getRpcPort()
  const rpcMultiOrigin = await rpcMulti.bindPort(rpcPort, {
    protocol: null,
    preferredExternalPort: rpcPort,
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

  const zmqMulti = sdk.MultiHost.of(effects, 'zmq')
  const zmqPort = await getZmqPort()
  const zmqMultiOrigin = await zmqMulti.bindPort(zmqPort, {
    protocol: null,
    preferredExternalPort: zmqPort,
    secure: { ssl: false },
    addSsl: null
  })
  const zmq = sdk.createInterface(effects, {
    name: 'ZMQ',
    id: 'zmq',
    description: 'The ZMQ interface',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const zmqReceipt = await zmqMultiOrigin.export([zmq])

  const rrpcMulti = sdk.MultiHost.of(effects, 'rrpc')
  const rrpcMultiOrigin = await rrpcMulti.bindPort(rrpcPort, {
    protocol: null,
    preferredExternalPort: rrpcPort,
    secure: { ssl: false },
    addSsl: null
  })
  const rrpc = sdk.createInterface(effects, {
    name: 'RPC',
    id: 'rrpc',
    description: 'Restricted RPC interface',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const rrpcReceipt = await rrpcMultiOrigin.export([rrpc])

  return [p2pReceipt, rpcReceipt, zmqReceipt, rrpcReceipt]
})
