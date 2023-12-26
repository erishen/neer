import Image from 'neer/image'
import testPng from '../images/test.png'

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <h2>app-layout</h2>
        <Image id="app-layout" src={testPng} quality={85} />
        {children}
      </body>
    </html>
  )
}
