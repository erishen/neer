import { Component } from 'react'
import Link from 'neer/link'

export default class OnClick extends Component {
  static getInitialProps({ res, query: { count } }) {
    return { count: count ? parseInt(count) : 0 }
  }

  state = {
    stateCounter: 0,
  }

  render() {
    const { stateCounter } = this.state
    const { count } = this.props
    return (
      <div id="on-click-page">
        <Link
          href={`/nav/on-click?count=${count + 1}`}
          replace
          id="on-click-link"
          onClick={() => this.setState({ stateCounter: stateCounter + 1 })}
        >
          Self Reload
        </Link>
        <Link
          href="/nav/on-click"
          id="on-click-link-prevent-default"
          onClick={(e) => {
            e.preventDefault()
            this.setState({ stateCounter: stateCounter + 1 })
          }}
        >
          Self Reload
        </Link>
        <p id="query-count">QUERY COUNT: {count}</p>
        <p id="state-count">STATE COUNT: {stateCounter}</p>
      </div>
    )
  }
}
