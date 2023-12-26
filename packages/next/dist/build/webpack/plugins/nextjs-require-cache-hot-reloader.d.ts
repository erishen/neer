import type { webpack } from 'neer/dist/compiled/webpack/webpack';
declare type Compiler = webpack.Compiler;
declare type WebpackPluginInstance = webpack.WebpackPluginInstance;
export declare class NextJsRequireCacheHotReloader implements WebpackPluginInstance {
    prevAssets: any;
    hasServerComponents: boolean;
    constructor(opts: {
        hasServerComponents: boolean;
    });
    apply(compiler: Compiler): void;
}
export {};
