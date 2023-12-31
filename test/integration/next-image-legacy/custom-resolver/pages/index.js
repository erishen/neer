import React from 'react'
import Image from 'neer/legacy/image'
import Link from 'neer/link'

const myLoader = ({ src, width, quality }) => {
  return `https://customresolver.com/${src}?w~~${width},q~~${quality}`
}

const MyImage = (props) => {
  return <Image loader={myLoader} {...props}></Image>
}

const Page = () => {
  return (
    <div>
      <p id="ssr">Image SSR Test</p>
      <MyImage
        id="basic-image"
        src="foo.jpg"
        loading="eager"
        width={300}
        height={400}
        quality={60}
      />
      <Image
        id="unoptimized-image"
        unoptimized
        src="https://arbitraryurl.com/foo.jpg"
        loading="eager"
        width={300}
        height={400}
      />
      <Link href="/client-side" id="clientlink">
        Client Side
      </Link>
    </div>
  )
}

export default Page
