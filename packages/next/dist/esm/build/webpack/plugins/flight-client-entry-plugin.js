import { webpack } from "neer/dist/compiled/webpack/webpack";
import { stringify } from "querystring";
import path from "path";
import { sources } from "neer/dist/compiled/webpack/webpack";
import { getInvalidator, entries, EntryTypes } from "../../../server/dev/on-demand-entry-handler";
import { WEBPACK_LAYERS } from "../../../lib/constants";
import { APP_CLIENT_INTERNALS, COMPILER_NAMES, EDGE_RUNTIME_WEBPACK, FLIGHT_SERVER_CSS_MANIFEST } from "../../../shared/lib/constants";
import { ASYNC_CLIENT_MODULES } from "./flight-manifest-plugin";
import { isClientComponentModule, regexCSS } from "../loaders/utils";
import { traverseModules } from "../utils";
import { normalizePathSep } from "../../../shared/lib/page-path/normalize-path-sep";
const PLUGIN_NAME = "ClientEntryPlugin";
export const injectedClientEntries = new Map();
export const serverModuleIds = new Map();
export const edgeServerModuleIds = new Map();
let serverCSSManifest = {};
let edgeServerCSSManifest = {};
export class FlightClientEntryPlugin {
    constructor(options){
        this.dev = options.dev;
        this.appDir = options.appDir;
        this.isEdgeServer = options.isEdgeServer;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory  })=>{
            compilation.dependencyFactories.set(webpack.dependencies.ModuleDependency, normalModuleFactory);
            compilation.dependencyTemplates.set(webpack.dependencies.ModuleDependency, new webpack.dependencies.NullDependency.Template());
        });
        compiler.hooks.finishMake.tapPromise(PLUGIN_NAME, (compilation)=>{
            return this.createClientEntries(compiler, compilation);
        });
        compiler.hooks.afterCompile.tap(PLUGIN_NAME, (compilation)=>{
            traverseModules(compilation, (mod)=>{
                // const modId = compilation.chunkGraph.getModuleId(mod) + ''
                // The module must has request, and resource so it's not a new entry created with loader.
                // Using the client layer module, which doesn't have `rsc` tag in buildInfo.
                if (mod.request && mod.resource && !mod.buildInfo.rsc) {
                    if (compilation.moduleGraph.isAsync(mod)) {
                        ASYNC_CLIENT_MODULES.add(mod.resource);
                    }
                }
            });
            const recordModule = (modId, mod)=>{
                var ref;
                const modResource = ((ref = mod.resourceResolveData) == null ? void 0 : ref.path) || mod.resource;
                if (mod.layer !== WEBPACK_LAYERS.client) {
                    return;
                }
                // Check mod resource to exclude the empty resource module like virtual module created by next-flight-client-entry-loader
                if (typeof modId !== "undefined" && modResource) {
                    // Note that this isn't that reliable as webpack is still possible to assign
                    // additional queries to make sure there's no conflict even using the `named`
                    // module ID strategy.
                    let ssrNamedModuleId = path.relative(compiler.context, modResource);
                    if (!ssrNamedModuleId.startsWith(".")) {
                        // TODO use getModuleId instead
                        ssrNamedModuleId = `./${normalizePathSep(ssrNamedModuleId)}`;
                    }
                    if (this.isEdgeServer) {
                        edgeServerModuleIds.set(ssrNamedModuleId.replace(/\/neer\/dist\/esm\//, "/neer/dist/"), modId);
                    } else {
                        serverModuleIds.set(ssrNamedModuleId, modId);
                    }
                }
            };
            traverseModules(compilation, (mod, _chunk, _chunkGroup, modId)=>{
                recordModule(String(modId), mod);
            });
        });
    }
    async createClientEntries(compiler, compilation) {
        const promises = [];
        // Loop over all the entry modules.
        function forEachEntryModule(callback) {
            for (const [name, entry] of compilation.entries.entries()){
                var ref;
                // Skip for entries under pages/
                if (name.startsWith("pages/")) continue;
                // Check if the page entry is a server component or not.
                const entryDependency = (ref = entry.dependencies) == null ? void 0 : ref[0];
                // Ensure only next-app-loader entries are handled.
                if (!entryDependency || !entryDependency.request) continue;
                const request = entryDependency.request;
                if (!request.startsWith("next-edge-ssr-loader?") && !request.startsWith("next-app-loader?")) continue;
                let entryModule = compilation.moduleGraph.getResolvedModule(entryDependency);
                if (request.startsWith("next-edge-ssr-loader?")) {
                    entryModule.dependencies.forEach((dependency)=>{
                        const modRequest = dependency.request;
                        if (modRequest == null ? void 0 : modRequest.includes("next-app-loader")) {
                            entryModule = compilation.moduleGraph.getResolvedModule(dependency);
                        }
                    });
                }
                callback({
                    name,
                    entryModule
                });
            }
        }
        // For each SC server compilation entry, we need to create its corresponding
        // client component entry.
        forEachEntryModule(({ name , entryModule  })=>{
            const internalClientComponentEntryImports = new Set();
            for (const connection of compilation.moduleGraph.getOutgoingConnections(entryModule)){
                // Entry can be any user defined entry files such as layout, page, error, loading, etc.
                const entryDependency = connection.dependency;
                const entryRequest = connection.dependency.request;
                const [clientComponentImports] = this.collectClientComponentsAndCSSForDependency({
                    entryRequest,
                    compilation,
                    dependency: entryDependency
                });
                const isAbsoluteRequest = path.isAbsolute(entryRequest);
                // Next.js internals are put into a separate entry.
                if (!isAbsoluteRequest) {
                    clientComponentImports.forEach((value)=>internalClientComponentEntryImports.add(value));
                    continue;
                }
                const relativeRequest = isAbsoluteRequest ? path.relative(compilation.options.context, entryRequest) : entryRequest;
                // Replace file suffix as `.js` will be added.
                const bundlePath = normalizePathSep(relativeRequest.replace(/\.(js|ts)x?$/, "").replace(/^src[\\/]/, ""));
                promises.push(this.injectClientEntryAndSSRModules({
                    compiler,
                    compilation,
                    entryName: name,
                    clientComponentImports,
                    bundlePath
                }));
            }
            // Create internal app
            promises.push(this.injectClientEntryAndSSRModules({
                compiler,
                compilation,
                entryName: name,
                clientComponentImports: [
                    ...internalClientComponentEntryImports
                ],
                bundlePath: APP_CLIENT_INTERNALS
            }));
        });
        // After optimizing all the modules, we collect the CSS that are still used
        // by the certain chunk.
        compilation.hooks.afterOptimizeModules.tap(PLUGIN_NAME, ()=>{
            const cssImportsForChunk = {};
            if (this.isEdgeServer) {
                edgeServerCSSManifest = {};
            } else {
                serverCSSManifest = {};
            }
            let cssManifest = this.isEdgeServer ? edgeServerCSSManifest : serverCSSManifest;
            function collectModule(entryName, mod) {
                const resource = mod.resource;
                const modId = resource;
                if (modId) {
                    if (regexCSS.test(modId)) {
                        cssImportsForChunk[entryName].push(modId);
                    }
                }
            }
            compilation.chunkGroups.forEach((chunkGroup)=>{
                chunkGroup.chunks.forEach((chunk)=>{
                    // Here we only track page chunks.
                    if (!chunk.name) return;
                    if (!chunk.name.endsWith("/page")) return;
                    const entryName = path.join(this.appDir, "..", chunk.name);
                    if (!cssImportsForChunk[entryName]) {
                        cssImportsForChunk[entryName] = [];
                    }
                    const chunkModules = compilation.chunkGraph.getChunkModulesIterable(chunk);
                    for (const mod of chunkModules){
                        collectModule(entryName, mod);
                        const anyModule = mod;
                        if (anyModule.modules) {
                            anyModule.modules.forEach((concatenatedMod)=>{
                                collectModule(entryName, concatenatedMod);
                            });
                        }
                    }
                    const entryCSSInfo = cssManifest.__entry_css_mods__ || {};
                    entryCSSInfo[entryName] = cssImportsForChunk[entryName];
                    Object.assign(cssManifest, {
                        __entry_css_mods__: entryCSSInfo
                    });
                });
            });
            forEachEntryModule(({ name , entryModule  })=>{
                // To collect all CSS imports for a specific entry including the ones
                // that are in the client graph, we need to store a map for client boundary
                // dependencies.
                const clientEntryDependencyMap = {};
                const entry = compilation.entries.get(name);
                entry.includeDependencies.forEach((dep)=>{
                    if (dep.request && dep.request.startsWith("next-flight-client-entry-loader?")) {
                        const mod = compilation.moduleGraph.getResolvedModule(dep);
                        compilation.moduleGraph.getOutgoingConnections(mod).forEach((connection)=>{
                            if (connection.dependency) {
                                clientEntryDependencyMap[connection.dependency.request] = connection.dependency;
                            }
                        });
                    }
                });
                for (const connection1 of compilation.moduleGraph.getOutgoingConnections(entryModule)){
                    const entryDependency = connection1.dependency;
                    const entryRequest = connection1.dependency.request;
                    const [, cssImports] = this.collectClientComponentsAndCSSForDependency({
                        entryRequest,
                        compilation,
                        dependency: entryDependency,
                        clientEntryDependencyMap
                    });
                    Object.assign(cssManifest, cssImports);
                }
            });
        });
        compilation.hooks.processAssets.tap({
            name: PLUGIN_NAME,
            // Have to be in the optimize stage to run after updating the CSS
            // asset hash via extract mini css plugin.
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_HASH
        }, (assets)=>{
            const manifest = JSON.stringify({
                ...serverCSSManifest,
                ...edgeServerCSSManifest,
                __entry_css_mods__: {
                    ...serverCSSManifest.__entry_css_mods__,
                    ...edgeServerCSSManifest.__entry_css_mods__
                }
            }, null, this.dev ? 2 : undefined);
            assets[FLIGHT_SERVER_CSS_MANIFEST + ".json"] = new sources.RawSource(manifest);
            assets[FLIGHT_SERVER_CSS_MANIFEST + ".js"] = new sources.RawSource("self.__RSC_CSS_MANIFEST=" + manifest);
        });
        const res = await Promise.all(promises);
        // Invalidate in development to trigger recompilation
        const invalidator = getInvalidator();
        // Check if any of the entry injections need an invalidation
        if (invalidator && res.includes(true)) {
            invalidator.invalidate([
                COMPILER_NAMES.client
            ]);
        }
    }
    collectClientComponentsAndCSSForDependency({ entryRequest , compilation , dependency , clientEntryDependencyMap  }) {
        /**
     * Keep track of checked modules to avoid infinite loops with recursive imports.
     */ const visitedBySegment = {};
        const clientComponentImports = [];
        const serverCSSImports = {};
        const filterClientComponents = (dependencyToFilter, inClientComponentBoundary)=>{
            var ref, ref1;
            const mod = compilation.moduleGraph.getResolvedModule(dependencyToFilter);
            if (!mod) return;
            const rawRequest = mod.rawRequest;
            const isCSS = regexCSS.test(rawRequest);
            // We have to always use the resolved request here to make sure the
            // server and client are using the same module path (required by RSC), as
            // the server compiler and client compiler have different resolve configs.
            const modRequest = ((ref = mod.resourceResolveData) == null ? void 0 : ref.path) + ((ref1 = mod.resourceResolveData) == null ? void 0 : ref1.query);
            // Ensure module is not walked again if it's already been visited
            if (!visitedBySegment[entryRequest]) {
                visitedBySegment[entryRequest] = new Set();
            }
            const storeKey = (inClientComponentBoundary ? "0" : "1") + ":" + modRequest;
            if (!modRequest || visitedBySegment[entryRequest].has(storeKey)) {
                return;
            }
            visitedBySegment[entryRequest].add(storeKey);
            const isClientComponent = isClientComponentModule(mod);
            if (isCSS) {
                const sideEffectFree = mod.factoryMeta && mod.factoryMeta.sideEffectFree;
                if (sideEffectFree) {
                    const unused = !compilation.moduleGraph.getExportsInfo(mod).isModuleUsed(this.isEdgeServer ? EDGE_RUNTIME_WEBPACK : "webpack-runtime");
                    if (unused) {
                        return;
                    }
                }
                serverCSSImports[entryRequest] = serverCSSImports[entryRequest] || [];
                serverCSSImports[entryRequest].push(modRequest);
            }
            // Check if request is for css file.
            if (!inClientComponentBoundary && isClientComponent || isCSS) {
                clientComponentImports.push(modRequest);
                // Here we are entering a client boundary, and we need to collect dependencies
                // in the client graph too.
                if (isClientComponent && clientEntryDependencyMap) {
                    if (clientEntryDependencyMap[modRequest]) {
                        filterClientComponents(clientEntryDependencyMap[modRequest], true);
                    }
                }
                return;
            }
            compilation.moduleGraph.getOutgoingConnections(mod).forEach((connection)=>{
                filterClientComponents(connection.dependency, inClientComponentBoundary || isClientComponent);
            });
        };
        // Traverse the module graph to find all client components.
        filterClientComponents(dependency, false);
        return [
            clientComponentImports,
            serverCSSImports
        ];
    }
    async injectClientEntryAndSSRModules({ compiler , compilation , entryName , clientComponentImports , bundlePath  }) {
        let shouldInvalidate = false;
        const loaderOptions = {
            modules: clientComponentImports,
            server: false
        };
        // For the client entry, we always use the CJS build of Next.js. If the
        // server is using the ESM build (when using the Edge runtime), we need to
        // replace them.
        const clientLoader = `next-flight-client-entry-loader?${stringify({
            modules: this.isEdgeServer ? clientComponentImports.map((importPath)=>importPath.replace("neer/dist/esm/", "neer/dist/")) : clientComponentImports,
            server: false
        })}!`;
        const clientSSRLoader = `next-flight-client-entry-loader?${stringify({
            ...loaderOptions,
            server: true
        })}!`;
        // Add for the client compilation
        // Inject the entry to the client compiler.
        if (this.dev) {
            const pageKey = COMPILER_NAMES.client + bundlePath;
            if (!entries[pageKey]) {
                entries[pageKey] = {
                    type: EntryTypes.CHILD_ENTRY,
                    parentEntries: new Set([
                        entryName
                    ]),
                    bundlePath,
                    request: clientLoader,
                    dispose: false,
                    lastActiveTime: Date.now()
                };
                shouldInvalidate = true;
            } else {
                const entryData = entries[pageKey];
                // New version of the client loader
                if (entryData.request !== clientLoader) {
                    entryData.request = clientLoader;
                    shouldInvalidate = true;
                }
                if (entryData.type === EntryTypes.CHILD_ENTRY) {
                    entryData.parentEntries.add(entryName);
                }
            }
        } else {
            injectedClientEntries.set(bundlePath, clientLoader);
        }
        // Inject the entry to the server compiler (__sc_client__).
        const clientComponentEntryDep = webpack.EntryPlugin.createDependency(clientSSRLoader, {
            name: bundlePath
        });
        // Add the dependency to the server compiler.
        await this.addEntry(compilation, // Reuse compilation context.
        compiler.context, clientComponentEntryDep, {
            // By using the same entry name
            name: entryName,
            // Layer should be client for the SSR modules
            // This ensures the client components are bundled on client layer
            layer: WEBPACK_LAYERS.client
        });
        return shouldInvalidate;
    }
    addEntry(compilation, context, dependency, options) /* Promise<module> */ {
        return new Promise((resolve, reject)=>{
            const entry = compilation.entries.get(options.name);
            entry.includeDependencies.push(dependency);
            compilation.hooks.addEntry.call(entry, options);
            compilation.addModuleTree({
                context,
                dependency,
                contextInfo: {
                    issuerLayer: options.layer
                }
            }, (err, module)=>{
                if (err) {
                    compilation.hooks.failedEntry.call(dependency, options, err);
                    return reject(err);
                }
                compilation.hooks.succeedEntry.call(dependency, options, module);
                return resolve(module);
            });
        });
    }
}

//# sourceMappingURL=flight-client-entry-plugin.js.map