"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _webpack = require("neer/dist/compiled/webpack/webpack");
// Map of a feature module to the file it belongs in the next package.
const FEATURE_MODULE_MAP = new Map([
    [
        "neer/image",
        "/next/image.js"
    ],
    [
        "neer/future/image",
        "/next/future/image.js"
    ],
    [
        "neer/legacy/image",
        "/next/legacy/image.js"
    ],
    [
        "neer/script",
        "/next/script.js"
    ],
    [
        "neer/dynamic",
        "/next/dynamic.js"
    ], 
]);
const FEATURE_MODULE_REGEXP_MAP = new Map([
    [
        "neer-font/google",
        /\/@next\/font\/google\/target.css?.+$/
    ],
    [
        "neer-font/local",
        /\/@next\/font\/local\/target.css?.+$/
    ], 
]);
// List of build features used in webpack configuration
const BUILD_FEATURES = [
    "swcLoader",
    "swcMinify",
    "swcRelay",
    "swcStyledComponents",
    "swcReactRemoveProperties",
    "swcExperimentalDecorators",
    "swcRemoveConsole",
    "swcImportSource",
    "swcEmotion",
    "swc/target/x86_64-apple-darwin",
    "swc/target/x86_64-unknown-linux-gnu",
    "swc/target/x86_64-pc-windows-msvc",
    "swc/target/i686-pc-windows-msvc",
    "swc/target/aarch64-unknown-linux-gnu",
    "swc/target/armv7-unknown-linux-gnueabihf",
    "swc/target/aarch64-apple-darwin",
    "swc/target/aarch64-linux-android",
    "swc/target/arm-linux-androideabi",
    "swc/target/x86_64-unknown-freebsd",
    "swc/target/x86_64-unknown-linux-musl",
    "swc/target/aarch64-unknown-linux-musl",
    "swc/target/aarch64-pc-windows-msvc",
    "turbotrace",
    "transpilePackages",
    "skipMiddlewareUrlNormalize",
    "skipTrailingSlashRedirect",
    "modularizeImports", 
];
const ELIMINATED_PACKAGES = new Set();
/**
 * Determine if there is a feature of interest in the specified 'module'.
 */ function findFeatureInModule(module) {
    if (module.type !== "javascript/auto") {
        return;
    }
    const normalizedIdentifier = module.identifier().replace(/\\/g, "/");
    for (const [feature, path] of FEATURE_MODULE_MAP){
        if (normalizedIdentifier.endsWith(path)) {
            return feature;
        }
    }
    for (const [feature1, regexp] of FEATURE_MODULE_REGEXP_MAP){
        if (regexp.test(normalizedIdentifier)) {
            return feature1;
        }
    }
}
/**
 * Find unique origin modules in the specified 'connections', which possibly
 * contains more than one connection for a module due to different types of
 * dependency.
 */ function findUniqueOriginModulesInConnections(connections, originModule) {
    const originModules = new Set();
    for (const connection of connections){
        if (!originModules.has(connection.originModule) && connection.originModule !== originModule) {
            originModules.add(connection.originModule);
        }
    }
    return originModules;
}
class TelemetryPlugin {
    usageTracker = new Map();
    // Build feature usage is on/off and is known before the build starts
    constructor(buildFeaturesMap){
        for (const featureName of BUILD_FEATURES){
            this.usageTracker.set(featureName, {
                featureName,
                invocationCount: buildFeaturesMap.get(featureName) ? 1 : 0
            });
        }
        for (const featureName1 of FEATURE_MODULE_MAP.keys()){
            this.usageTracker.set(featureName1, {
                featureName: featureName1,
                invocationCount: 0
            });
        }
        for (const featureName2 of FEATURE_MODULE_REGEXP_MAP.keys()){
            this.usageTracker.set(featureName2, {
                featureName: featureName2,
                invocationCount: 0
            });
        }
    }
    apply(compiler) {
        compiler.hooks.make.tapAsync(TelemetryPlugin.name, async (compilation, callback)=>{
            compilation.hooks.finishModules.tapAsync(TelemetryPlugin.name, async (modules, modulesFinish)=>{
                for (const module of modules){
                    const feature = findFeatureInModule(module);
                    if (!feature) {
                        continue;
                    }
                    const connections = compilation.moduleGraph.getIncomingConnections(module);
                    const originModules = findUniqueOriginModulesInConnections(connections, module);
                    this.usageTracker.get(feature).invocationCount = originModules.size;
                }
                modulesFinish();
            });
            callback();
        });
        if (compiler.options.mode === "production" && !compiler.watchMode) {
            compiler.hooks.compilation.tap(TelemetryPlugin.name, (compilation)=>{
                const moduleHooks = _webpack.NormalModule.getCompilationHooks(compilation);
                moduleHooks.loader.tap(TelemetryPlugin.name, (loaderContext)=>{
                    loaderContext.eliminatedPackages = ELIMINATED_PACKAGES;
                });
            });
        }
    }
    usages() {
        return [
            ...this.usageTracker.values()
        ];
    }
    packagesUsedInServerSideProps() {
        return Array.from(ELIMINATED_PACKAGES);
    }
}
exports.TelemetryPlugin = TelemetryPlugin;

//# sourceMappingURL=telemetry-plugin.js.map