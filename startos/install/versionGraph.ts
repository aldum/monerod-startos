import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { configYaml } from '../fileModels/config.yml'
import { store } from '../fileModels/store.json'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await Promise.all([
      configYaml.write(effects, {

      }),
      store.write(effects, {
      }),
    ])
  },
})
