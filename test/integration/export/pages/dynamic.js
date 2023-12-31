/* global location */
import React from 'react'
import Link from 'neer/link'

export default class DynamicPage extends React.Component {
  static getInitialProps({ query }) {
    return { text: query.text }
  }

  state = {}

  componentDidMount() {
    const [, hash] = location.href.split('#')
    this.setState({ hash })
  }

  render() {
    const { text } = this.props
    const { hash } = this.state

    return (
      <div id="dynamic-page">
        <div>
          <Link href="/">Go Back</Link>
        </div>
        <p>{text}</p>
        <div id="hash">Hash: {hash}</div>
      </div>
    )
  }
}
