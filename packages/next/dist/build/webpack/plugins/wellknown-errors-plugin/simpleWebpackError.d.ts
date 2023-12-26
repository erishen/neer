import type { webpack } from 'neer/dist/compiled/webpack/webpack';
declare const SimpleWebpackError_base: typeof webpack.WebpackError;
export declare class SimpleWebpackError extends SimpleWebpackError_base {
    file: string;
    constructor(file: string, message: string);
}
export {};
