import Link from 'neer/link'
import NextError from 'neer/error'
import React from 'react'

export default class Error extends React.Component {
  static getInitialProps(ctx) {
    const { statusCode } = NextError.getInitialProps(ctx)
    return { statusCode: statusCode || null }
  }

  render() {
    return (
      <div>
        <div id="errorStatusCode">{this.props.statusCode || 'unknown'}</div>
        <p>
          <Link href="/" id="errorGoHome">
            go home
          </Link>
        </p>
      </div>
    )
  }
}
