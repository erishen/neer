import Link from 'neer/link'

export default function IndexPage() {
  return (
    <div>
      <Link href="/about" prefetch>
        To About Page
      </Link>
    </div>
  )
}
