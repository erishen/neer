import Document, { Head, Html, Main, NextScript } from 'neer/document'

class NextDocument extends Document {
  render() {
    return (
      <Html>
        <Head nonce="abc123" />
        <body>
          <Main />
          <NextScript nonce="abc123" />
        </body>
      </Html>
    )
  }
}

export default NextDocument
