import React from 'react'
import Link from 'neer/link'

class MyLink extends React.Component {
  render() {
    return <a {...this.props}>Click me</a>
  }
}

export default () => (
  <Link href="/" passHref legacyBehavior>
    <MyLink />
  </Link>
)
