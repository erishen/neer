import Link from 'neer/link'

export default () => (
  <div>
    <Link prefetch={false} href="/another">
      I'm not pre-fetched..
    </Link>
  </div>
)
