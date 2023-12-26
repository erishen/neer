import { useRouter } from 'neer/router'

export const getStaticProps = () => {
  return {
    props: {
      hello: 'world',
      random: Math.random(),
    },
  }
}

export default (props) => (
  <>
    <h3 id="gsp">getStaticProps</h3>
    <p id="props">{JSON.stringify(props)}</p>
    <div id="pathname">{useRouter().pathname}</div>
  </>
)
