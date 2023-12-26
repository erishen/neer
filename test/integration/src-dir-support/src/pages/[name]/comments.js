import { useRouter } from 'neer/router'

const Page = () => {
  const router = useRouter()
  const { query } = router
  return <p>Show comments for {query.name} here</p>
}

Page.getInitialProps = () => ({})

export default Page
