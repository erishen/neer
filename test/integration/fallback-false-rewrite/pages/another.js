import { useRouter } from 'neer/router'

export const getServerSideProps = () => {
  return {
    props: {},
  }
}

export default function Page() {
  return (
    <>
      <p id="another">another</p>
      <p id="query">{JSON.stringify(useRouter().query)}</p>
    </>
  )
}
