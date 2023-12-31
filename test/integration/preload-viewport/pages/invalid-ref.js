import React from 'react'
import Link from 'neer/link'

class Button extends React.Component {
  render() {
    return <button {...this.props}>Click me</button>
  }
}

export default () => (
  <div>
    <Link href="/another" passHref legacyBehavior>
      <Button id="btn-link" />
    </Link>
  </div>
)
