import { useRouter } from 'neer/router'

const Page = () => {
  const router = useRouter()
  const { query } = router
  return <p id="asdf">This is {query.id}</p>
}

export default Page
