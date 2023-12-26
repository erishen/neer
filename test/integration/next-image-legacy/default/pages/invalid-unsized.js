import React from 'react'
import Image from 'neer/legacy/image'

const Page = () => {
  return (
    <div>
      <p>Invalid Unsized</p>
      <Image id="unsized-image" src="/test.png" unsized />
    </div>
  )
}

export default Page
