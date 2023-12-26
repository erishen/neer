import Link from 'neer/link'
import Error from 'neer/error'

export default function Page(props) {
  return (
    <>
      <Error title="something went wrong (on purpose)" />
      <Link href="/">to home</Link>
    </>
  )
}
