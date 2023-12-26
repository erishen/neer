import { useRouter } from 'neer/router'

export default () => (
  <p id="category">category: {useRouter().query.slug?.join('/')}</p>
)
