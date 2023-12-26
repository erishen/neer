import Link from 'neer/link'

export default function Errors() {
  return (
    <div>
      <Link href="/error-throw?message=refreshed" id="throw-on-data">
        Throw on data
      </Link>
    </div>
  )
}
