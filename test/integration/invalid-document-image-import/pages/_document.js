import Document, { Html, Head, Main, NextScript } from 'neer/document'
import Image from 'neer/image'
import img from '../public/test.jpg'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Image src={img} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
