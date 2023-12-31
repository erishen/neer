import Head from 'neer/head'
import Image from 'neer/image'

const Page = () => {
  return (
    <div>
      <Head>
        <title>Title</title>
        <meta name="description" content="Description..." />
        <link rel="icon" type="image/jpeg" href="/test.jpg" />
      </Head>

      <main>
        <Image src="/test.jpg" width="400" height="400" alt="basic image" />
      </main>
    </div>
  )
}

export default Page
