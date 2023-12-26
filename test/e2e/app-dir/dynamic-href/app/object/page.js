import Link from 'neer/link'

export default function HomePage() {
  return (
    <Link
      id="link"
      href={{
        pathname: '/object/[slug]',
        query: { slug: '1' },
      }}
    >
      to slug
    </Link>
  )
}
