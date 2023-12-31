import React from 'react'
import Link from 'neer/link'
import css from './other.module.css'

export default class Other extends React.Component {
  ref = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      color: null,
    }
  }

  componentDidMount() {
    this.setState({
      color: window.getComputedStyle(this.ref.current).color,
    })
  }

  render() {
    return (
      <main>
        <Link href="/" prefetch={false} id="link-index">
          index page
        </Link>
        <br />
        <h1 id="red-title" className={css.root} ref={this.ref}>
          {this.state.color}
        </h1>
      </main>
    )
  }
}
