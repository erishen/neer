import React from 'react'
import Router from 'neer/router'

class Page extends React.Component {
  componentDidMount() {
    Router.push('/')
  }

  render() {
    return <p>redirecting..</p>
  }
}

export default Page
