import dynamic from 'neer/dynamic'

const Hello = dynamic(
  import(
    /* webpackChunkName: 'hello-world' */ '../../components/hello-chunkfilename'
  )
)

export default Hello
