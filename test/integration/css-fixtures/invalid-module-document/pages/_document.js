import Document, { Head, Html, Main, NextScript } from 'neer/document'
import styles from '../styles.module.css'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body className={styles['red-text']}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
