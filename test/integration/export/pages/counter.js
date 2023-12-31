import React from 'react'
import Link from 'neer/link'

let counter = 0

export default class Counter extends React.Component {
  increaseCounter() {
    counter++
    this.forceUpdate()
  }

  render() {
    return (
      <div id="counter-page">
        <div>
          <Link href="/" id="go-back">
            Go Back
          </Link>
        </div>
        <p>Counter: {counter}</p>
        <button id="counter-increase" onClick={() => this.increaseCounter()}>
          Increase
        </button>
      </div>
    )
  }
}
