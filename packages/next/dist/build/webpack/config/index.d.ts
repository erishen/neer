import type { webpack } from 'neer/dist/compiled/webpack/webpack';
import type { NextConfigComplete } from '../../../server/config-shared';
export declare function buildConfiguration(config: webpack.Configuration, { hasAppDir, supportedBrowsers, rootDirectory, customAppFile, isDevelopment, isServer, isEdgeRuntime, targetWeb, assetPrefix, sassOptions, productionBrowserSourceMaps, future, transpilePackages, experimental, disableStaticImages, }: {
    hasAppDir: boolean;
    supportedBrowsers: string[] | undefined;
    rootDirectory: string;
    customAppFile: RegExp | undefined;
    isDevelopment: boolean;
    isServer: boolean;
    isEdgeRuntime: boolean;
    targetWeb: boolean;
    assetPrefix: string;
    sassOptions: any;
    productionBrowserSourceMaps: boolean;
    transpilePackages: NextConfigComplete['transpilePackages'];
    future: NextConfigComplete['future'];
    experimental: NextConfigComplete['experimental'];
    disableStaticImages: NextConfigComplete['disableStaticImages'];
}): Promise<webpack.Configuration>;
