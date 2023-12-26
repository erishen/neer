import { useRouter } from 'neer/router'

export default function Page() {
  const router = useRouter()
  return <p id="current-locale">{router.locale}</p>
}
