import React from 'react'
import Link from 'neer/link'
import { useRouter } from 'neer/router'

export async function getServerSideProps({ query: { port } }) {
  if (!port) {
    throw new Error('port required')
  }
  return { props: { port } }
}

export default function Page({ port }) {
  const router = useRouter()
  return (
    <>
      <Link
        href={`http://localhost:${port}${router.basePath}/something-else`}
        id="absolute-link"
      >
        http://localhost:{port}
        {router.basePath}/something-else
      </Link>
    </>
  )
}
