import React from 'react'
import Image from 'neer/image'

export default function Page() {
  return (
    <div>
      <p>Invalid height</p>

      <Image src="/test.jpg" width={400} height="50vh" />
    </div>
  )
}
