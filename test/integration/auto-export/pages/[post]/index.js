import { useRouter } from 'neer/router'

export default function Page() {
  const { query } = useRouter()

  return <p>post: {query.post}</p>
}
