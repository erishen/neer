import Image from 'neer/image'
import LegacyImage from 'neer/legacy/image'
import profilePic from '../public/small.jpg'

export const config = {
  runtime: 'experimental-edge',
}

function About() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image src={profilePic} alt="Picture of the author" />
      <p>Welcome to my homepage!</p>
    </>
  )
}

export default About

export function AboutFutureImage() {
  return <LegacyImage src={profilePic} alt="Picture of the author" />
}
