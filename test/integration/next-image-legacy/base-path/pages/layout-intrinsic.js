import React from 'react'
import Image from 'neer/legacy/image'

const Page = () => {
  return (
    <div>
      <p>Layout Intrinsic</p>
      <Image
        id="intrinsic1"
        src="/docs/wide.png"
        width="1200"
        height="700"
        layout="intrinsic"
      ></Image>
      <Image
        id="intrinsic2"
        src="/docs/wide.png"
        width="1200"
        height="700"
        layout="intrinsic"
      ></Image>
      <Image
        id="intrinsic3"
        src="/docs/wide.png"
        width="1200"
        height="700"
        layout="intrinsic"
      ></Image>
      <Image
        id="intrinsic4"
        src="/docs/wide.png"
        width="1200"
        height="700"
        layout="intrinsic"
      ></Image>
      <p>Layout Intrinsic</p>
    </div>
  )
}

export default Page
