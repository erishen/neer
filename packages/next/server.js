const serverExports = {
  NextRequest: require('neer/dist/server/web/spec-extension/request')
    .NextRequest,
  NextResponse:
    require('neer/dist/server/web/spec-extension/response')
      .NextResponse,
  userAgentFromString:
    require('neer/dist/server/web/spec-extension/user-agent')
      .userAgentFromString,
  userAgent: require('neer/dist/server/web/spec-extension/user-agent')
    .userAgent,
}

if (typeof URLPattern !== 'undefined') {
  // eslint-disable-next-line no-undef
  serverExports.URLPattern = URLPattern
}

// https://nodejs.org/api/esm.html#commonjs-namespaces
// When importing CommonJS modules, the module.exports object is provided as the default export
module.exports = serverExports

// make import { xxx } from 'neer/server' work
exports.NextRequest = serverExports.NextRequest
exports.NextResponse = serverExports.NextResponse
exports.userAgentFromString = serverExports.userAgentFromString
exports.userAgent = serverExports.userAgent
exports.URLPattern = serverExports.URLPattern
