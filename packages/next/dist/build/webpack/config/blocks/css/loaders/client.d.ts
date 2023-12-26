import type { webpack } from 'neer/dist/compiled/webpack/webpack';
export declare function getClientStyleLoader({ hasAppDir, isDevelopment, assetPrefix, }: {
    hasAppDir: boolean;
    isDevelopment: boolean;
    assetPrefix: string;
}): webpack.RuleSetUseItem;
