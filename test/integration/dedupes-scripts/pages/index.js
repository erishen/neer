import dynamic from 'neer/dynamic'

const Hello = dynamic(() => import('../components/hello'))

export default () => (
  <>
    <Hello />
  </>
)
