import Link from 'neer/link'
export default function HomePage() {
  return (
    <>
      <p>
        <Link href="/a/" id="to-a-trailing-slash">
          To a with trailing slash
        </Link>
      </p>
    </>
  )
}
