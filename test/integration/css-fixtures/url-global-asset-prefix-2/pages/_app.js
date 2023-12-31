import React from 'react'
import App from 'neer/app'
import '../styles/global1.css'
import '../styles/global2.css'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}

export default MyApp
