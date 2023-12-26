import dynamic from 'neer/dynamic'

const options = { loading: () => <p>...</p>, ssr: false }
const DynamicComponentWithCustomLoading = dynamic(
  () => import('../components/hello'),
  options
)
