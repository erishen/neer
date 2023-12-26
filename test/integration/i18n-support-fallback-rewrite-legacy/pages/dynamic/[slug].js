import { useRouter } from 'neer/router'

export default function Dynamic(props) {
  const router = useRouter()

  return (
    <p id="router">
      {JSON.stringify({
        pathname: router.pathname,
        asPath: router.asPath,
        query: router.query,
        dynamic: true,
      })}
    </p>
  )
}
