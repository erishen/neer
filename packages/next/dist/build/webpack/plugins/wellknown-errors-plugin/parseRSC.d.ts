import type { webpack } from 'neer/dist/compiled/webpack/webpack';
import { SimpleWebpackError } from './simpleWebpackError';
export declare function getRscError(fileName: string, err: Error, module: any, compilation: webpack.Compilation, compiler: webpack.Compiler): SimpleWebpackError | false;
