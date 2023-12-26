import { useRouter } from 'neer/router'

const Page = () => <p id="slug">slug: {useRouter().query.slug}</p>
export default Page
