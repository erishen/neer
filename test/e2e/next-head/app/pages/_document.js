import Document, { Html, Head, Main, NextScript } from 'neer/document'

export default function MyDocument() {
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

MyDocument.getInitialProps = async (context) => {
  const initialProps = await Document.getInitialProps(context)

  return {
    ...initialProps,
    head: [
      ...(initialProps?.head ?? []),
      <meta name="test-head-initial-props" content="hello" />,
    ],
  }
}
