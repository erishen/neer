import dynamic from 'neer/dynamic'

const Foo = dynamic(() => import('../components/foo'))

export default () => (
  <div>
    <Foo />
  </div>
)
