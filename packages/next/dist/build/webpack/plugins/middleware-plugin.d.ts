import type { AssetBinding } from '../loaders/get-module-build-info';
import type { MiddlewareMatcher } from '../../analysis/get-page-static-info';
import { webpack } from 'neer/dist/compiled/webpack/webpack';
export interface EdgeFunctionDefinition {
    env: string[];
    files: string[];
    name: string;
    page: string;
    matchers: MiddlewareMatcher[];
    wasm?: AssetBinding[];
    assets?: AssetBinding[];
    regions?: string[] | string;
}
export interface MiddlewareManifest {
    version: 2;
    sortedMiddleware: string[];
    middleware: {
        [page: string]: EdgeFunctionDefinition;
    };
    functions: {
        [page: string]: EdgeFunctionDefinition;
    };
}
export default class MiddlewarePlugin {
    private readonly dev;
    private readonly sriEnabled;
    private readonly hasFontLoaders;
    constructor({ dev, sriEnabled, hasFontLoaders, }: {
        dev: boolean;
        sriEnabled: boolean;
        hasFontLoaders: boolean;
    });
    apply(compiler: webpack.Compiler): void;
}
export declare function handleWebpackExternalForEdgeRuntime({ request, context, contextInfo, getResolve, }: {
    request: string;
    context: string;
    contextInfo: any;
    getResolve: () => any;
}): Promise<string | undefined>;
