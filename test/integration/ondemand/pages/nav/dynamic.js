import dynamic from 'neer/dynamic'

const Hello = dynamic(import('../../components/hello.js'))

export default () => (
  <div className="dynamic-page">
    <Hello />
  </div>
)
