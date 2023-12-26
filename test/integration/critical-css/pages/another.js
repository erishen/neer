import styles from '../styles/index.module.css'
import dynamic from 'neer/dynamic'

const Hello = dynamic(() => import('../components/hello'))

export default function Home() {
  return (
    <div className={styles.hello}>
      <p>Hello World</p>
      <Hello />
    </div>
  )
}

export const getServerSideProps = () => {
  return {
    props: {
      hello: 'world',
    },
  }
}
