import Script from 'neer/script'
import Link from 'neer/link'

const Page = () => {
  return (
    <div class="container">
      <Script
        id="scriptAfterInteractive"
        src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js?a=scriptAfterInteractive"
      ></Script>
      <div>index</div>
      <div>
        <Link href="/page1">Page1</Link>
      </div>
      <div>
        <Link href="/page5">Page5</Link>
      </div>
    </div>
  )
}

export default Page
