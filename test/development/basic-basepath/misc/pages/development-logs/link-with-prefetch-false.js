import Link from 'neer/link'

export default function PrefetchFalsePage() {
  return (
    <div>
      <Link href="/about" prefetch={false}>
        Prefetch set to false
      </Link>
    </div>
  )
}
