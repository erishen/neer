import { useRouter } from 'neer/router'

const Page = () => {
  const { query } = useRouter()
  return <p id="query">{JSON.stringify(query)}</p>
}

Page.getInitialProps = () => ({ hello: 'GIPGIP' })

export default Page
