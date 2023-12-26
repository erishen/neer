import Link from 'neer/link'

export function getStaticProps() {
  return { props: {} }
}

export default function () {
  return (
    <main>
      <Link href="/" id="to-index">
        To Index
      </Link>
    </main>
  )
}