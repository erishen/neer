"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeConfig = normalizeConfig;
exports.validateConfig = validateConfig;
exports.defaultConfig = void 0;
var _os = _interopRequireDefault(require("os"));
var _imageConfig = require("../shared/lib/image-config");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const defaultConfig = {
    env: {},
    webpack: null,
    webpackDevMiddleware: null,
    eslint: {
        ignoreDuringBuilds: false
    },
    typescript: {
        ignoreBuildErrors: false,
        tsconfigPath: "tsconfig.json"
    },
    distDir: ".next",
    cleanDistDir: true,
    assetPrefix: "",
    configOrigin: "default",
    useFileSystemPublicRoutes: true,
    generateBuildId: ()=>null,
    generateEtags: true,
    pageExtensions: [
        "tsx",
        "ts",
        "jsx",
        "js"
    ],
    target: "server",
    poweredByHeader: true,
    compress: true,
    analyticsId: process.env.VERCEL_ANALYTICS_ID || "",
    images: _imageConfig.imageConfigDefault,
    devIndicators: {
        buildActivity: true,
        buildActivityPosition: "bottom-right"
    },
    onDemandEntries: {
        maxInactiveAge: 15 * 1000,
        pagesBufferLength: 2
    },
    amp: {
        canonicalBase: ""
    },
    basePath: "",
    sassOptions: {},
    trailingSlash: false,
    i18n: null,
    productionBrowserSourceMaps: false,
    optimizeFonts: true,
    excludeDefaultMomentLocales: true,
    serverRuntimeConfig: {},
    publicRuntimeConfig: {},
    reactStrictMode: null,
    httpAgentOptions: {
        keepAlive: true
    },
    outputFileTracing: true,
    staticPageGenerationTimeout: 60,
    swcMinify: true,
    output: !!process.env.NEXT_PRIVATE_STANDALONE ? "standalone" : undefined,
    modularizeImports: undefined,
    experimental: {
        fetchCache: false,
        middlewarePrefetch: "flexible",
        optimisticClientCache: true,
        runtime: undefined,
        manualClientBasePath: false,
        legacyBrowsers: false,
        newNextLinkBehavior: true,
        cpus: Math.max(1, (Number(process.env.CIRCLE_NODE_TOTAL) || (_os.default.cpus() || {
            length: 1
        }).length) - 1),
        sharedPool: true,
        profiling: false,
        isrFlushToDisk: true,
        workerThreads: false,
        pageEnv: false,
        proxyTimeout: undefined,
        optimizeCss: false,
        nextScriptWorkers: false,
        scrollRestoration: false,
        externalDir: false,
        disableOptimizedLoading: false,
        gzipSize: true,
        swcFileReading: true,
        craCompat: false,
        esmExternals: true,
        appDir: false,
        // default to 50MB limit
        isrMemoryCacheSize: 50 * 1024 * 1024,
        incrementalCacheHandlerPath: undefined,
        fullySpecified: false,
        outputFileTracingRoot: process.env.NEXT_PRIVATE_OUTPUT_TRACE_ROOT || "",
        swcTraceProfiling: false,
        forceSwcTransforms: false,
        swcPlugins: undefined,
        swcMinifyDebugOptions: undefined,
        largePageDataBytes: 128 * 1000,
        disablePostcssPresetEnv: undefined,
        amp: undefined,
        urlImports: undefined,
        enableUndici: false,
        adjustFontFallbacks: false,
        adjustFontFallbacksWithSizeAdjust: false,
        turbotrace: undefined
    }
};
exports.defaultConfig = defaultConfig;
async function normalizeConfig(phase, config) {
    if (typeof config === "function") {
        config = config(phase, {
            defaultConfig
        });
    }
    // Support `new Promise` and `async () =>` as return values of the config export
    return await config;
}
function validateConfig(userConfig) {
    const configValidator = require("neer/dist/next-config-validate.js");
    configValidator(userConfig);
    return {
        errors: configValidator.errors
    };
}

//# sourceMappingURL=config-shared.js.map