import type { AsyncLocalStorage as NodeAsyncLocalStorage } from 'async_hooks'

declare global {
  var AsyncLocalStorage: typeof NodeAsyncLocalStorage
}

export { NextFetchEvent } from 'neer/dist/server/web/spec-extension/fetch-event'
export { NextRequest } from 'neer/dist/server/web/spec-extension/request'
export { NextResponse } from 'neer/dist/server/web/spec-extension/response'
export { NextMiddleware } from 'neer/dist/server/web/types'
export { userAgentFromString } from 'neer/dist/server/web/spec-extension/user-agent'
export { userAgent } from 'neer/dist/server/web/spec-extension/user-agent'
export { URLPattern } from 'neer/dist/compiled/@edge-runtime/primitives/url'
