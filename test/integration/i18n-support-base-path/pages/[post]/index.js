import { useRouter } from 'neer/router'

export default function Post() {
  const router = useRouter()

  return (
    <>
      <p id="post">post: {router.query.post}</p>
      <p id="router">{JSON.stringify(router)}</p>
    </>
  )
}
