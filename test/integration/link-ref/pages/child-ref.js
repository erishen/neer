import React from 'react'
import Link from 'neer/link'

export default () => {
  const myRef = React.createRef(null)

  React.useEffect(() => {
    if (!myRef.current) {
      console.error(`ref wasn't updated`)
    }
  })

  return (
    <Link href="/" ref={myRef}>
      Click me
    </Link>
  )
}
