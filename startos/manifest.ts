import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from
  '@start9labs/start-sdk/base/lib/types/ManifestTypes'


export const manifest = setupManifest({
  id: 'monerod',
  title: 'Monero',
  license: 'MIT',
  wrapperRepo: 'https://github.com/aldum/monerod-startos',
  upstreamRepo: 'https://github.com/monero/monero',
  supportSite: 'https://docs.start9.com/',
  marketingSite: 'https://start9.com/',
  donationUrl: 'https://donate.start9.com/',
  docsUrl: 'https://github.com/aldum/monerod-startos/docs/instructions.md',
  description: {
    short: 'Monero node',
    long: 'Monero node.',
  },
  volumes: ['main'],
  images: {
    'monero': {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
        }
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
