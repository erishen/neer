import NextImage from 'neer/image'
import src from '../../../public/test.jpg'

// Keep arrow function to test rsc loaders
const Page = () => {
  return <NextImage id="myimg" src={src} />
}

export default Page
