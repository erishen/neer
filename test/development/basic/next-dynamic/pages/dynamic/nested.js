import dynamic from 'neer/dynamic'

const DynamicComponent = dynamic(() => import('../../components/nested1'))

export default DynamicComponent
