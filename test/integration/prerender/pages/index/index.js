import Link from 'neer/link'

export async function getStaticProps() {
  return {
    props: { world: 'nested index' },
  }
}

export default ({ world }) => {
  return (
    <>
      <p>hello {world}</p>
      <Link href="/" id="home">
        to home
      </Link>
    </>
  )
}
