import Head from 'neer/head'

export default () => {
  return (
    <div>
      Hello
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `performance.mark('custom-mark')`,
          }}
        />
      </Head>
    </div>
  )
}
