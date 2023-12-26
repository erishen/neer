'use client'

import { usePathname } from 'neer/navigation'

export default function Page() {
  const pathname = usePathname()

  return (
    <>
      <h1 id="pathname" data-pathname={pathname}>
        hello from {pathname}
      </h1>
    </>
  )
}
