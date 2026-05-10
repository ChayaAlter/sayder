import { contextBridge } from 'electron'

const api = {
  platform: process.platform,
  appVersion: process.env.npm_package_version ?? '0.1.0'
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('app', api)
  } catch (error) {
    console.error('Failed to expose preload API:', error)
  }
} else {
  // @ts-expect-error fallback for non-isolated contexts during dev
  window.app = api
}

export type AppAPI = typeof api
