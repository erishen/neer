import { useRouter } from 'neer/router'

export default function Page() {
  return <p>hello {useRouter().query.slug}</p>
}

export const getServerSideProps = () => {
  return {
    props: {
      hello: 'world',
    },
  }
}
