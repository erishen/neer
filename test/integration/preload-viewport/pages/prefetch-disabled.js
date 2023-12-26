import Link from 'neer/link'

export default () => {
  return (
    <div>
      <br />
      <Link href="/another" prefetch={false} id="link-another">
        to /another
      </Link>
    </div>
  )
}
