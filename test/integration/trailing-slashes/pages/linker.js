import Link from 'neer/link'
import { useRouter } from 'neer/router'

export async function getServerSideProps({ query }) {
  return {
    props: { href: query.href || '/' },
  }
}

export default function Linker({ href }) {
  const router = useRouter()
  const pushRoute = () => {
    router.push(href)
  }
  return (
    <div>
      <Link href={href} id="link">
        link to{href}
      </Link>
      <button id="route-pusher" onClick={pushRoute}>
        push route {href}
      </button>
    </div>
  )
}
