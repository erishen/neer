import React from 'react'
import Image from 'neer/legacy/image'

const Page = () => {
  return (
    <div>
      <p>Invalid Source</p>
      <Image src="https://google.com/test.png" width="10" height="10" />
    </div>
  )
}

export default Page
