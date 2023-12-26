import { init as initWebpack } from 'neer/dist/compiled/webpack/webpack'

let installed: boolean = false

export function loadWebpackHook() {
  if (installed) {
    return
  }
  installed = true

  initWebpack()

  // hook the Node.js require so that webpack requires are
  // routed to the bundled and now initialized webpack version
  require('../build/webpack/require-hook').loadRequireHook(
    [
      ['webpack', 'neer/dist/compiled/webpack/webpack-lib'],
      ['webpack/package', 'neer/dist/compiled/webpack/package'],
      ['webpack/package.json', 'neer/dist/compiled/webpack/package'],
      [
        'webpack/lib/webpack',
        'neer/dist/compiled/webpack/webpack-lib',
      ],
      [
        'webpack/lib/webpack.js',
        'neer/dist/compiled/webpack/webpack-lib',
      ],
      [
        'webpack/lib/node/NodeEnvironmentPlugin',
        'neer/dist/compiled/webpack/NodeEnvironmentPlugin',
      ],
      [
        'webpack/lib/node/NodeEnvironmentPlugin.js',
        'neer/dist/compiled/webpack/NodeEnvironmentPlugin',
      ],
      [
        'webpack/lib/BasicEvaluatedExpression',
        'neer/dist/compiled/webpack/BasicEvaluatedExpression',
      ],
      [
        'webpack/lib/BasicEvaluatedExpression.js',
        'neer/dist/compiled/webpack/BasicEvaluatedExpression',
      ],
      [
        'webpack/lib/node/NodeTargetPlugin',
        'neer/dist/compiled/webpack/NodeTargetPlugin',
      ],
      [
        'webpack/lib/node/NodeTargetPlugin.js',
        'neer/dist/compiled/webpack/NodeTargetPlugin',
      ],
      [
        'webpack/lib/node/NodeTemplatePlugin',
        'neer/dist/compiled/webpack/NodeTemplatePlugin',
      ],
      [
        'webpack/lib/node/NodeTemplatePlugin.js',
        'neer/dist/compiled/webpack/NodeTemplatePlugin',
      ],
      [
        'webpack/lib/LibraryTemplatePlugin',
        'neer/dist/compiled/webpack/LibraryTemplatePlugin',
      ],
      [
        'webpack/lib/LibraryTemplatePlugin.js',
        'neer/dist/compiled/webpack/LibraryTemplatePlugin',
      ],
      [
        'webpack/lib/SingleEntryPlugin',
        'neer/dist/compiled/webpack/SingleEntryPlugin',
      ],
      [
        'webpack/lib/SingleEntryPlugin.js',
        'neer/dist/compiled/webpack/SingleEntryPlugin',
      ],
      [
        'webpack/lib/optimize/LimitChunkCountPlugin',
        'neer/dist/compiled/webpack/LimitChunkCountPlugin',
      ],
      [
        'webpack/lib/optimize/LimitChunkCountPlugin.js',
        'neer/dist/compiled/webpack/LimitChunkCountPlugin',
      ],
      [
        'webpack/lib/webworker/WebWorkerTemplatePlugin',
        'neer/dist/compiled/webpack/WebWorkerTemplatePlugin',
      ],
      [
        'webpack/lib/webworker/WebWorkerTemplatePlugin.js',
        'neer/dist/compiled/webpack/WebWorkerTemplatePlugin',
      ],
      [
        'webpack/lib/ExternalsPlugin',
        'neer/dist/compiled/webpack/ExternalsPlugin',
      ],
      [
        'webpack/lib/ExternalsPlugin.js',
        'neer/dist/compiled/webpack/ExternalsPlugin',
      ],
      [
        'webpack/lib/web/FetchCompileWasmTemplatePlugin',
        'neer/dist/compiled/webpack/FetchCompileWasmTemplatePlugin',
      ],
      [
        'webpack/lib/web/FetchCompileWasmTemplatePlugin.js',
        'neer/dist/compiled/webpack/FetchCompileWasmTemplatePlugin',
      ],
      [
        'webpack/lib/web/FetchCompileWasmPlugin',
        'neer/dist/compiled/webpack/FetchCompileWasmPlugin',
      ],
      [
        'webpack/lib/web/FetchCompileWasmPlugin.js',
        'neer/dist/compiled/webpack/FetchCompileWasmPlugin',
      ],
      [
        'webpack/lib/web/FetchCompileAsyncWasmPlugin',
        'neer/dist/compiled/webpack/FetchCompileAsyncWasmPlugin',
      ],
      [
        'webpack/lib/web/FetchCompileAsyncWasmPlugin.js',
        'neer/dist/compiled/webpack/FetchCompileAsyncWasmPlugin',
      ],
      [
        'webpack/lib/ModuleFilenameHelpers',
        'neer/dist/compiled/webpack/ModuleFilenameHelpers',
      ],
      [
        'webpack/lib/ModuleFilenameHelpers.js',
        'neer/dist/compiled/webpack/ModuleFilenameHelpers',
      ],
      [
        'webpack/lib/GraphHelpers',
        'neer/dist/compiled/webpack/GraphHelpers',
      ],
      [
        'webpack/lib/GraphHelpers.js',
        'neer/dist/compiled/webpack/GraphHelpers',
      ],
      [
        'webpack/lib/NormalModule',
        'neer/dist/compiled/webpack/NormalModule',
      ],
      ['webpack-sources', 'neer/dist/compiled/webpack/sources'],
      ['webpack-sources/lib', 'neer/dist/compiled/webpack/sources'],
      [
        'webpack-sources/lib/index',
        'neer/dist/compiled/webpack/sources',
      ],
      [
        'webpack-sources/lib/index.js',
        'neer/dist/compiled/webpack/sources',
      ],
      [
        '@babel/runtime',
        'neer/dist/compiled/@babel/runtime/package.json',
      ],
      [
        '@babel/runtime/package.json',
        'neer/dist/compiled/@babel/runtime/package.json',
      ],
      ['node-fetch', 'neer/dist/compiled/node-fetch'],
      ['undici', 'neer/dist/compiled/undici'],
    ].map(
      // Use dynamic require.resolve to avoid statically analyzable since they're only for build time
      ([request, replacement]) => [request, require.resolve(replacement)]
    )
  )
}
