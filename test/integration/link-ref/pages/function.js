import React from 'react'
import Link from 'neer/link'

const MyLink = React.forwardRef((props, ref) => (
  <a {...props} ref={ref}>
    Click me
  </a>
))

export default () => (
  <Link href="/" passHref legacyBehavior>
    <MyLink />
  </Link>
)
