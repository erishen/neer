import Link from 'neer/link'
export default function Page() {
  return (
    <Link
      href="/"
      onClick={() => {
        console.log('link to home clicked')
      }}
    >
      Home
    </Link>
  )
}
