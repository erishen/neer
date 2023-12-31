import App from 'neer/app'
import React from 'react'
import '../styles/global.css'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}

export default MyApp
