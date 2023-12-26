import Link from 'neer/link'

export default function Page({ params }) {
  return (
    <>
      <Link href="/dynamic/first/second">To inner dynamic</Link>
      <p id={`dynamic-${params.first}`}>dynamic {params.first}</p>
    </>
  )
}
