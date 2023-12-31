import React from 'react'
import App from 'neer/app'
import '../../styles/global.scss'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}

export default MyApp
