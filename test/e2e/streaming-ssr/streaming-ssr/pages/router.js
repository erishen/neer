import { useRouter } from 'neer/router'
import Link from 'neer/link'

export default () => {
  useRouter()
  return <Link href="/">link</Link>
}

export const config = { runtime: 'experimental-edge' }
