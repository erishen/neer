import Link from 'neer/link'
import getConfig from 'neer/config'
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

const About = ({ bar }) => (
  <div id="about-page">
    <div>
      <Link href="/">Go Back</Link>
    </div>
    <p>{`This is the About page ${publicRuntimeConfig.foo}${bar || ''}`}</p>
  </div>
)

About.getInitialProps = async (ctx) => {
  return { bar: serverRuntimeConfig.bar }
}

export default About
