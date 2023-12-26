import dynamic from 'neer/dynamic'

const Hello = dynamic(import('../../components/hello1'), { ssr: true })

export default Hello
