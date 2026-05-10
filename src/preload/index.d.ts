import type { AppAPI } from './index'

declare global {
  interface Window {
    app: AppAPI
  }
}

export {}
