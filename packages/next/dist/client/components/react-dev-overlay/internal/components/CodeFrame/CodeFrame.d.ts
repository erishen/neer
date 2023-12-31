import * as React from 'react';
import { StackFrame } from 'neer/dist/compiled/stacktrace-parser';
export declare type CodeFrameProps = {
    stackFrame: StackFrame;
    codeFrame: string;
};
export declare const CodeFrame: React.FC<CodeFrameProps>;
