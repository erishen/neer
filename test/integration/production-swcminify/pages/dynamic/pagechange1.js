import dynamic from 'neer/dynamic'

const Hello = dynamic(import('../../components/dynamic-css/with-css'))

export default function PageChange1() {
  return (
    <div>
      PageChange1
      <Hello />
    </div>
  )
}
