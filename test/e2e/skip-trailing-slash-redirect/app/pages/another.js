import Link from 'neer/link'

export default function Page(props) {
  return (
    <>
      <p id="another">another page</p>
      <Link href="/" id="to-index">
        to index
      </Link>
      <br />
    </>
  )
}
