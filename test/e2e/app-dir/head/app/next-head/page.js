import Head from 'neer/head'
import DynamicHead from './dynamic-head'

export default function page() {
  return (
    <>
      <Head>
        <title>legacy-head</title>
      </Head>
      <DynamicHead />
      <p>page</p>
    </>
  )
}
