import Head from 'neer/head'

function Home({ stars }) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://use.typekit.net/ucs7mcf.css"
        ></link>
      </Head>

      <main>
        <div>Next stars: {stars}</div>
      </main>
    </div>
  )
}

Home.getInitialProps = async () => {
  return { stars: Math.random() * 1000 }
}

export default Home
