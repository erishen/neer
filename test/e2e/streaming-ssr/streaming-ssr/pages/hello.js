import Link from 'neer/link'

export default function Page() {
  return (
    <div>
      <p>hello nextjs</p>
      <Link href="/">home</Link>
    </div>
  )
}

export const config = { runtime: 'experimental-edge' }
