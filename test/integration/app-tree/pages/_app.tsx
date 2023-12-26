import React from 'react'
import Link from 'neer/link'
import { createContext } from 'react'
import { render } from 'react-dom'
import App, { AppContext } from 'neer/app'
import { renderToString } from 'react-dom/server'

export const DummyContext = createContext(null)

export default class MyApp extends App<{ html: string }> {
  static async getInitialProps({ Component, AppTree, ctx }: AppContext) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    let html: string
    const toRender = <AppTree pageProps={pageProps} another="prop" />

    if (typeof window !== 'undefined') {
      const el = document.createElement('div')
      document.querySelector('body').appendChild(el)
      render(toRender, el)
      html = el.innerHTML
      el.remove()
    } else {
      html = renderToString(toRender)
    }

    return { pageProps, html }
  }

  render() {
    const { Component, pageProps, html, router } = this.props
    const href = router.pathname === '/' ? '/another' : '/'
    const child =
      html && router.pathname !== '/hello' ? (
        <>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <Link href={href} id={href === '/' ? 'home' : 'another'}>
            to{href}
          </Link>
        </>
      ) : (
        <Component {...pageProps} />
      )

    return (
      <DummyContext.Provider value={'::ctx::'}>{child}</DummyContext.Provider>
    )
  }
}