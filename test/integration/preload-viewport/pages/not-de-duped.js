import Link from 'neer/link'

export default () => {
  return (
    <p>
      <Link href="/first" as="/first#different">
        to /first
      </Link>
    </p>
  )
}
