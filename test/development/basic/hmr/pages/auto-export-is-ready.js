import { useRouter } from 'neer/router'

export default function Page(props) {
  const router = useRouter()
  return (
    <>
      <p>auto-export router.isReady</p>
      <p id="query">{JSON.stringify(router.query)}</p>
      <p id="ready">{router.isReady ? 'yes' : 'no'}</p>
    </>
  )
}
