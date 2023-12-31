import dynamic from 'neer/dynamic'

const DynamicHello = dynamic(() => import('../components/hello'))

const Page = () => (
  <>
    <p>testing next/dynamic size</p>
    <DynamicHello />
  </>
)

// we add getServerSideProps to prevent static optimization
// to allow us to compare server-side changes
export const getServerSideProps = () => {
  return {
    props: {},
  }
}

export default Page
