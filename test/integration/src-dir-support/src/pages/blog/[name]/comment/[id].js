import { useRouter } from 'neer/router'

const Page = () => {
  const router = useRouter()
  const { name, id } = router.query

  return (
    <>
      <p>
        Blog post {name} comment {id || '(all)'}
      </p>
    </>
  )
}

Page.getInitialProps = () => ({})

export default Page
