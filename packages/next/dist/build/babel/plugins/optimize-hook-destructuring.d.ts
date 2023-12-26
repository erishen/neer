import { PluginObj, types as BabelTypes } from 'neer/dist/compiled/babel/core';
export default function ({ types: t, }: {
    types: typeof BabelTypes;
}): PluginObj<any>;
