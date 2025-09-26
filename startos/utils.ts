import { SubContainer } from "@start9labs/start-sdk"
import { manifest } from './manifest'
import { HealthCheckResult } from "@start9labs/start-sdk/package/lib/health/checkFns"
import { storeJson } from "./fileModels/store.json"

const getNet = async () => await storeJson.read(s => s.network).once() || 'mainnet'

export const getP2pPort = async () => {
  const net = await getNet()
  if (net == 'testnet') {
    return 28080
  } else {
    // mainnet
    return 18080
  }
}
export const getRpcPort = async () => {
  const net = await getNet()
  if (net == 'testnet') {
    return 28081
  } else {
    // mainnet
    return 18081
  }
}
export const zmqPort = 18082
export const zmqPubPort = 18083
export const rrpcPort = 18089
export const walletPort = 28088

export const datadir = '/data/bitmonero'

export const checkSyncProgress = async (monc: SubContainer<typeof manifest>): Promise<HealthCheckResult> => {
  try {
    const rpcPort = await getRpcPort()
    const res = await monc.execFail([
      'curl', '-s', `http://127.0.0.1:${rpcPort}/json_rpc`,
      '-d', '{ "jsonrpc": "2.0", "id": "0", "method": "sync_info" }',
      '-H', 'Content-Type: application/json'
    ])
    const output = JSON.parse(String(res.stdout)).result
    const height = Number.parseInt(output.height)
    const fullHeight = Number.parseInt(output.target_height)

    if (fullHeight && fullHeight !== 0) {
      if (height === fullHeight) {
        return {
          message: 'Sync done',
          result: 'success'
        }
      } else {
        const percentage =
          (height / fullHeight * 100).toFixed(2)
        return {
          message: `Progress: ${percentage}%`,
          result: 'loading',
        }
      }
    }
  } catch (e) {
    return {
      message: String(e),
      result: "failure"
    }
  }

  return {
    message: 'Starting...',
    result: "starting"
  }
}
