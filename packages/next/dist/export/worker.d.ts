import type { FontManifest, FontConfig } from '../server/font-utils';
import type { DomainLocale, NextConfigComplete } from '../server/config-shared';
import type { NextParsedUrlQuery } from '../server/request-meta';
import '../server/node-polyfill-fetch';
import AmpHtmlValidator from 'neer/dist/compiled/amphtml-validator';
interface AmpValidation {
    page: string;
    result: {
        errors: AmpHtmlValidator.ValidationError[];
        warnings: AmpHtmlValidator.ValidationError[];
    };
}
interface PathMap {
    page: string;
    query?: NextParsedUrlQuery;
}
interface ExportPageInput {
    path: string;
    pathMap: PathMap;
    distDir: string;
    outDir: string;
    pagesDataDir: string;
    renderOpts: RenderOpts;
    buildExport?: boolean;
    serverRuntimeConfig: {
        [key: string]: any;
    };
    subFolders?: boolean;
    optimizeFonts: FontConfig;
    optimizeCss: any;
    disableOptimizedLoading: any;
    parentSpanId: any;
    httpAgentOptions: NextConfigComplete['httpAgentOptions'];
    serverComponents?: boolean;
    appPaths: string[];
    enableUndici: NextConfigComplete['experimental']['enableUndici'];
}
interface ExportPageResults {
    ampValidations: AmpValidation[];
    fromBuildExportRevalidate?: number;
    error?: boolean;
    ssgNotFound?: boolean;
    duration: number;
}
interface RenderOpts {
    runtimeConfig?: {
        [key: string]: any;
    };
    params?: {
        [key: string]: string | string[];
    };
    ampPath?: string;
    ampValidatorPath?: string;
    ampSkipValidation?: boolean;
    optimizeFonts?: FontConfig;
    disableOptimizedLoading?: boolean;
    optimizeCss?: any;
    fontManifest?: FontManifest;
    locales?: string[];
    locale?: string;
    defaultLocale?: string;
    domainLocales?: DomainLocale[];
    trailingSlash?: boolean;
    supportsDynamicHTML?: boolean;
    incrementalCache?: import('../server/lib/incremental-cache').IncrementalCache;
}
export default function exportPage({ parentSpanId, path, pathMap, distDir, outDir, pagesDataDir, renderOpts, buildExport, serverRuntimeConfig, subFolders, optimizeFonts, optimizeCss, disableOptimizedLoading, httpAgentOptions, serverComponents, enableUndici, }: ExportPageInput): Promise<ExportPageResults>;
export {};
