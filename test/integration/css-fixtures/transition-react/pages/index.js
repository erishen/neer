import Link from 'neer/link'

export default function Home() {
  return (
    <main>
      <Link href="/other" prefetch={false} id="link-other">
        other
      </Link>
    </main>
  )
}
