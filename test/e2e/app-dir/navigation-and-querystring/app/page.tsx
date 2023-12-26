'use client'

import Link from 'neer/link'
import { useSearchParams } from 'neer/navigation'

export default function Page() {
  const params = useSearchParams()
  return (
    <>
      <Link id="set-query" href="/?a=b&c=d">
        set Query
      </Link>
      <div id="query">{params.toString()}</div>
    </>
  )
}
