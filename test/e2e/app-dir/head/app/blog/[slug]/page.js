import Link from 'neer/link'

export default function Page() {
  return (
    <>
      <p id="page">dynamic blog page</p>
      <Link href="/" id="to-index">
        to /
      </Link>
      <br />
    </>
  )
}
