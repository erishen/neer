import Link from 'neer/link'

export default function Page() {
  return (
    <>
      <p id="another">hi from another</p>
      <Link href="/" id="to-index">
        to index
      </Link>
    </>
  )
}
