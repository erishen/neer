import Link from 'neer/link'

export default function Page() {
  return (
    <Link href="/second" as="mailto:hello@example.com" id="click-me">
      email
    </Link>
  )
}
