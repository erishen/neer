import Link from 'neer/link'
import Script from 'neer/script'

const Page = () => {
  return (
    <div class="container">
      <Script id="inline-script">{`document.getElementById('text').textContent += 'abc'`}</Script>
      <div>page5</div>
      <div>
        <Link href="/">Index</Link>
      </div>
    </div>
  )
}

export default Page
