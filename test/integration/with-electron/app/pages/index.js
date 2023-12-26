import Link from 'neer/link'
import Router from 'neer/router'

function routeToAbout(e) {
  e.preventDefault()
  Router.push('/about')
}

export default () => (
  <div id="home-page">
    <p>This is the home page</p>
    <Link href="/about" id="about-via-link">
      about via Link
    </Link>
    <a id="about-via-router" onClick={routeToAbout} href="#">
      about via Router
    </a>
  </div>
)
