import React from 'react'
import { useRouter } from 'neer/router'

const Post = () => {
  const router = useRouter()

  return (
    <>
      <div id="as-path">{router.asPath}</div>
    </>
  )
}

Post.getInitialProps = () => ({ hello: 'hi' })

export default Post
