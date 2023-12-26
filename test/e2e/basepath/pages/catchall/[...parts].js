import { useRouter } from 'neer/router'

const Page = () => <p>parts: {useRouter().query.parts?.join('/')}</p>
export default Page
