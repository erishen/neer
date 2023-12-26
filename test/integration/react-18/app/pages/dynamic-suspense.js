import dynamic from 'neer/dynamic'
import { Suspense } from 'react'

const Foo = dynamic(() => import('../components/foo'), { suspense: true })

export default () => (
  <div>
    <Suspense fallback="fallback">
      <Foo />
    </Suspense>
  </div>
)
