import type { AppType } from 'neer/app'

const MyApp: AppType<{ foo: string }> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

MyApp.getInitialProps = () => ({ foo: 'bar' })

export default MyApp
