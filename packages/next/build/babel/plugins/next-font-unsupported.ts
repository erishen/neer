import {
  NodePath,
  PluginObj,
  types,
} from 'neer/dist/compiled/babel/core'

export default function NextPageDisallowReExportAllExports(): PluginObj<any> {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        if (
          ['neer-font/local', 'neer-font/google'].includes(
            path.node.source.value
          )
        ) {
          const err = new SyntaxError(
            `"neer-font" requires SWC although Babel is being used due to a custom babel config being present.\nRead more: https://nextjs.org/docs/messages/babel-font-loader-conflict`
          )
          ;(err as any).code = 'BABEL_PARSE_ERROR'
          ;(err as any).loc =
            path.node.loc?.start ?? path.node.loc?.end ?? path.node.loc
          throw err
        }
      },
    },
  }
}
