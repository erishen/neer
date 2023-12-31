"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _path = require("path");
const isLoadIntentTest = process.env.NODE_ENV === "test";
const isLoadIntentDevelopment = process.env.NODE_ENV === "development";
// Resolve styled-jsx plugins
function styledJsxOptions(options) {
    options = options || {};
    options.styleModule = "styled-jsx/style";
    if (!Array.isArray(options.plugins)) {
        return options;
    }
    options.plugins = options.plugins.map((plugin)=>{
        if (Array.isArray(plugin)) {
            const [name, pluginOptions] = plugin;
            return [
                require.resolve(name),
                pluginOptions
            ];
        }
        return require.resolve(plugin);
    });
    return options;
}
// Taken from https://github.com/babel/babel/commit/d60c5e1736543a6eac4b549553e107a9ba967051#diff-b4beead8ad9195361b4537601cc22532R158
function supportsStaticESM(caller) {
    return !!(caller == null ? void 0 : caller.supportsStaticESM);
}
var _default = (api, options = {})=>{
    var ref, ref1;
    const supportsESM = api.caller(supportsStaticESM);
    const isServer = api.caller((caller)=>!!caller && caller.isServer);
    const isCallerDevelopment = api.caller((caller)=>{
        return caller == null ? void 0 : caller.isDev;
    });
    // Look at external intent if used without a caller (e.g. via Jest):
    const isTest = isCallerDevelopment == null && isLoadIntentTest;
    // Look at external intent if used without a caller (e.g. Storybook):
    const isDevelopment = isCallerDevelopment === true || isCallerDevelopment == null && isLoadIntentDevelopment;
    // Default to production mode if not `test` nor `development`:
    const isProduction = !(isTest || isDevelopment);
    const isBabelLoader = api.caller((caller)=>!!caller && (caller.name === "babel-loader" || caller.name === "next-babel-turbo-loader"));
    const useJsxRuntime = ((ref = options["preset-react"]) == null ? void 0 : ref.runtime) === "automatic" || Boolean(api.caller((caller)=>!!caller && caller.hasJsxRuntime)) && ((ref1 = options["preset-react"]) == null ? void 0 : ref1.runtime) !== "classic";
    const presetEnvConfig = {
        // In the test environment `modules` is often needed to be set to true, babel figures that out by itself using the `'auto'` option
        // In production/development this option is set to `false` so that webpack can handle import/export with tree-shaking
        modules: "auto",
        exclude: [
            "transform-typeof-symbol"
        ],
        ...options["preset-env"]
    };
    // When transpiling for the server or tests, target the current Node version
    // if not explicitly specified:
    if ((isServer || isTest) && (!presetEnvConfig.targets || !(typeof presetEnvConfig.targets === "object" && "node" in presetEnvConfig.targets))) {
        presetEnvConfig.targets = {
            // Targets the current process' version of Node. This requires apps be
            // built and deployed on the same version of Node.
            // This is the same as using "current" but explicit
            node: process.versions.node
        };
    }
    return {
        sourceType: "unambiguous",
        presets: [
            [
                require("neer/dist/compiled/babel/preset-env"),
                presetEnvConfig, 
            ],
            [
                require("neer/dist/compiled/babel/preset-react"),
                {
                    // This adds @babel/plugin-transform-react-jsx-source and
                    // @babel/plugin-transform-react-jsx-self automatically in development
                    development: isDevelopment || isTest,
                    ...useJsxRuntime ? {
                        runtime: "automatic"
                    } : {
                        pragma: "__jsx"
                    },
                    ...options["preset-react"]
                }, 
            ],
            [
                require("neer/dist/compiled/babel/preset-typescript"),
                {
                    allowNamespaces: true,
                    ...options["preset-typescript"]
                }, 
            ], 
        ],
        plugins: [
            !useJsxRuntime && [
                require("./plugins/jsx-pragma"),
                {
                    // This produces the following injected import for modules containing JSX:
                    //   import React from 'react';
                    //   var __jsx = React.createElement;
                    module: "react",
                    importAs: "React",
                    pragma: "__jsx",
                    property: "createElement"
                }, 
            ],
            [
                require("./plugins/optimize-hook-destructuring"),
                {
                    // only optimize hook functions imported from React/Preact
                    lib: true
                }, 
            ],
            require("neer/dist/compiled/babel/plugin-syntax-dynamic-import"),
            require("neer/dist/compiled/babel/plugin-syntax-import-assertions"),
            require("./plugins/react-loadable-plugin"),
            [
                require("neer/dist/compiled/babel/plugin-proposal-class-properties"),
                options["class-properties"] || {}, 
            ],
            [
                require("neer/dist/compiled/babel/plugin-proposal-object-rest-spread"),
                {
                    useBuiltIns: true
                }, 
            ],
            !isServer && [
                require("neer/dist/compiled/babel/plugin-transform-runtime"),
                {
                    corejs: false,
                    helpers: true,
                    regenerator: true,
                    useESModules: supportsESM && presetEnvConfig.modules !== "commonjs",
                    absoluteRuntime: isBabelLoader ? (0, _path).dirname(require.resolve("neer/dist/compiled/@babel/runtime/package.json")) : undefined,
                    ...options["transform-runtime"]
                }, 
            ],
            [
                isTest && options["styled-jsx"] && options["styled-jsx"]["babel-test"] ? require("styled-jsx/babel-test") : require("styled-jsx/babel"),
                styledJsxOptions(options["styled-jsx"]), 
            ],
            require("./plugins/amp-attributes"),
            isProduction && [
                require("neer/dist/compiled/babel/plugin-transform-react-remove-prop-types"),
                {
                    removeImport: true
                }, 
            ],
            isServer && require("neer/dist/compiled/babel/plugin-syntax-bigint"),
            // Always compile numeric separator because the resulting number is
            // smaller.
            require("neer/dist/compiled/babel/plugin-proposal-numeric-separator"),
            require("neer/dist/compiled/babel/plugin-proposal-export-namespace-from"), 
        ].filter(Boolean)
    };
};
exports.default = _default;

//# sourceMappingURL=preset.js.map