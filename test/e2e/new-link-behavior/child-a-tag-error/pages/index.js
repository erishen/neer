import Link from 'neer/link'

export default function Page() {
  return (
    <>
      <h1>Home Page</h1>
      <Link href="/about">
        <a>About</a>
      </Link>
    </>
  )
}
