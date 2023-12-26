import { Html, Head, Main, NextScript } from 'neer/document'
import { Abel } from 'neer-font/google'

// eslint-disable-next-line no-unused-vars
const abel = Abel({ weight: '400' })

export default function Document() {
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
