import rule from 'eslint-plugin-neer/dist/rules/no-css-tags'
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

ruleTester.run('no-css-tags', rule, {
  valid: [
    `import {Head} from 'neer/document';

      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
            </div>
          );
        }
    }`,

    `import {Head} from 'neer/document';
      export class Blah extends Head {
        render() {
          return (
            <div>
              <h1>Hello title</h1>
              <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet" />
            </div>
          );
        }
    }`,

    `import {Head} from 'neer/document';
      export class Blah extends Head {
        render(props) {
          return (
            <div>
              <h1>Hello title</h1>
              <link {...props} />
            </div>
          );
        }
    }`,

    `import {Head} from 'neer/document';
      export class Blah extends Head {
        render(props) {
          return (
            <div>
              <h1>Hello title</h1>
              <link rel="stylesheet" {...props} />
            </div>
          );
        }
    }`,
  ],

  invalid: [
    {
      code: `
      import {Head} from 'neer/document';

        export class Blah extends Head {
          render() {
            return (
              <div>
                <h1>Hello title</h1>
                <link href="/_next/static/css/styles.css" rel="stylesheet" />
              </div>
            );
          }
      }`,
      errors: [
        {
          message:
            'Do not include stylesheets manually. See: https://nextjs.org/docs/messages/no-css-tags',
          type: 'JSXOpeningElement',
        },
      ],
    },
    {
      code: `
      <div>
        <link href="/_next/static/css/styles.css" rel="stylesheet" />
      </div>`,
      errors: [
        {
          message:
            'Do not include stylesheets manually. See: https://nextjs.org/docs/messages/no-css-tags',
          type: 'JSXOpeningElement',
        },
      ],
    },
  ],
})
