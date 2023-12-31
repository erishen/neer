import { SimpleWebpackError } from './simpleWebpackError';
import type { webpack } from 'neer/dist/compiled/webpack/webpack';
export declare function getNotFoundError(compilation: webpack.Compilation, input: any, fileName: string): Promise<any>;
export declare function getImageError(compilation: any, input: any, err: Error): Promise<SimpleWebpackError | false>;
