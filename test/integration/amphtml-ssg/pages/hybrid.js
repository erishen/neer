import { useAmp } from 'neer/amp'

export const config = {
  amp: 'hybrid',
}

export const getStaticProps = () => {
  return {
    props: {
      hello: 'hello',
      random: Math.random(),
    },
  }
}

export default ({ hello, random }) => (
  <>
    <p id="use-amp">useAmp: {useAmp() ? 'yes' : 'no'}</p>
    <p id="hello">{hello}</p>
    <p id="random">{random}</p>
  </>
)
