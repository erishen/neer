import url from 'url'
import Link from 'neer/link'

console.log(url.parse('https://example.com'))

export default () => (
  <div>
    <Link href="/">Index Page</Link>
    <p>Another</p>
  </div>
)
