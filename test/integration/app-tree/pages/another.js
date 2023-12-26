import { useRouter } from 'neer/router'

const Page = () => {
  const { pathname } = useRouter()
  return (
    <>
      <h3>page: {pathname}</h3>
    </>
  )
}

export default Page
