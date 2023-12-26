import Link from 'neer/link'
import dynamic from 'neer/dynamic'

const DynamicComponent = dynamic(() => import('../components/hello'))

export default () => (
  <div id="dynamic-imports-page">
    <div>
      <Link href="/">Go Back</Link>
    </div>
    <DynamicComponent />
  </div>
)
