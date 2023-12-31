import { useRouter } from 'neer/router'

const $comment = ({ gipQuery }) => {
  const router = useRouter()
  const { query } = router

  return (
    <>
      <p id="asdf">
        I am {query.comment} on {query.name}
      </p>
      <span>gip {gipQuery && gipQuery.name}</span>
    </>
  )
}

$comment.getInitialProps = async ({ query }) => {
  return { gipQuery: query }
}

export default $comment
