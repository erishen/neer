import Link from 'neer/link'
import { Component } from 'react'
import Router from 'neer/router'

let counter = 0

export default class extends Component {
  increase() {
    counter++
    this.forceUpdate()
  }

  visitQueryStringPage() {
    const href = { pathname: '/nav/querystring', query: { id: 10 } }
    const as = { pathname: '/nav/querystring/10', hash: '10' }
    Router.push(href, as)
  }

  render() {
    return (
      <div id="counter-page">
        <Link href="/no-such-page" id="no-such-page">
          No Such Page
        </Link>
        <br />
        <Link href="/no-such-page" prefetch id="no-such-page-prefetch">
          No Such Page (with prefetch)
        </Link>
        <p>This is the home.</p>
        <div id="counter">Counter: {counter}</div>
        <button id="increase" onClick={() => this.increase()}>
          Increase
        </button>
      </div>
    )
  }
}
