import Link from 'neer/link'

export default function Page() {
  return (
    <Link href="/[post]" as="/blog/post-1" id="click-me">
      Click me
    </Link>
  )
}
