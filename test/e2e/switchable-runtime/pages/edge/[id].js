import Link from 'neer/link'

export default function Page() {
  return (
    <div>
      <Link href="/edge/foo">to /edge/foo</Link>
    </div>
  )
}

export const config = {
  runtime: 'experimental-edge',
}
