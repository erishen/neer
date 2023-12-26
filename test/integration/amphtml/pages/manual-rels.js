import Head from 'neer/head'
import { useAmp } from 'neer/amp'

export const config = { amp: 'hybrid' }

export default () => (
  <>
    <Head>
      {!useAmp() && <link rel="amphtml" href="/my-custom-amphtml" />}
      <link rel="canonical" href="/my-custom-canonical" />
    </Head>

    <p>Hello world</p>
  </>
)
