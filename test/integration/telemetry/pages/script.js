import Script from 'neer/script'
import dynamic from 'neer/dynamic'

const DynamicComponent = dynamic(() => import('./about'))

export default function Home() {
  return (
    <>
      <Script src="https://www.google-analytics.com/analytics.js" />
      <DynamicComponent />
    </>
  )
}
