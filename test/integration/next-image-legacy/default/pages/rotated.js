import Image from 'neer/legacy/image'
import React from 'react'

const Page = () => {
  return (
    <div>
      <p>Hello World</p>
      <Image id="exif-rotation-image" src="/exif-rotation.jpg" unsized />
      <p id="stubtext">This is the rotated page</p>
    </div>
  )
}

export default Page
