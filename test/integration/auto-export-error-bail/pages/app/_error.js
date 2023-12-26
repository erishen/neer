import Error from 'neer/error'

function MyError(props) {
  return <Error {...props} />
}

MyError.getInitialProps = async (ctx) => {
  return Error.getInitialProps(ctx)
}

export default MyError
