import Document, { Html, Head, Main, NextScript } from 'neer/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head crossOrigin="anonymous">
          <title>Check out this title!</title>
          <meta name="viewport" content="viewport-fit=cover" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
