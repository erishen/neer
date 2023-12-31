import rule from 'eslint-plugin-neer/dist/rules/no-head-import-in-document'
import { RuleTester } from 'eslint'
;(RuleTester as any).setDefaultConfig({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
})
const ruleTester = new RuleTester()

ruleTester.run('no-head-import-in-document', rule, {
  valid: [
    {
      code: `import Document, { Html, Head, Main, NextScript } from 'neer/document'

      class MyDocument extends Document {
        static async getInitialProps(ctx) {
          //...
        }

        render() {
          return (
            <Html>
              <Head>
              </Head>
            </Html>
          )
        }
      }

      export default MyDocument
    `,
      filename: 'pages/_document.tsx',
    },
    {
      code: `import Head from "neer/head";

      export default function IndexPage() {
        return (
          <Head>
            <title>My page title</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
        );
      }
    `,
      filename: 'pages/index.tsx',
    },
  ],
  invalid: [
    {
      code: `
      import Document, { Html, Main, NextScript } from 'neer/document'
      import Head from 'neer/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head />
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      filename: 'pages/_document.js',
      errors: [
        {
          message:
            '`next/head` should not be imported in `pages/_document.js`. Use `<Head />` from `next/document` instead. See: https://nextjs.org/docs/messages/no-head-import-in-document',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'neer/document'
      import Head from 'neer/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head />
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      filename: 'pages/_document.page.tsx',
      errors: [
        {
          message:
            '`next/head` should not be imported in `pages/_document.page.tsx`. Use `<Head />` from `next/document` instead. See: https://nextjs.org/docs/messages/no-head-import-in-document',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'neer/document'
      import Head from 'neer/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head />
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      filename: 'pages/_document/index.js',
      errors: [
        {
          message:
            '`next/head` should not be imported in `pages/_document/index.js`. Use `<Head />` from `next/document` instead. See: https://nextjs.org/docs/messages/no-head-import-in-document',
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `
      import Document, { Html, Main, NextScript } from 'neer/document'
      import Head from 'neer/head'

      class MyDocument extends Document {
        render() {
          return (
            <Html>
              <Head />
              <body>
                <Main />
                <NextScript />
              </body>
            </Html>
          )
        }
      }

      export default MyDocument
      `,
      filename: 'pages/_document/index.tsx',
      errors: [
        {
          message:
            '`next/head` should not be imported in `pages/_document/index.tsx`. Use `<Head />` from `next/document` instead. See: https://nextjs.org/docs/messages/no-head-import-in-document',
          type: 'ImportDeclaration',
        },
      ],
    },
  ],
})
