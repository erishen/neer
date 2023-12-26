import Link from 'neer/link'

function Index() {
  return (
    <>
      <h3>Hi 👋</h3>
      <Link href="/a-non-existing-page">a link to no-where</Link>
    </>
  )
}

Index.getInitialProps = () => ({})

export default Index
