import { withRouter } from 'neer/router'

function useWithRouter(props) {
  return <div>I use withRouter</div>
}

// we add getServerSideProps to prevent static optimization
// to allow us to compare server-side changes
export const getServerSideProps = () => {
  return {
    props: {},
  }
}

export default withRouter(useWithRouter)
