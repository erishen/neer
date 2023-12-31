import Link from 'neer/link'
import { useRouter } from 'neer/router'
import { useEffect } from 'react'

export default function Page(props) {
  const router = useRouter()

  useEffect(() => {
    window.hashChangeStart = 'no'
    window.hashChangeComplete = 'no'
    const hashChangeStart = () => {
      window.hashChangeStart = 'yes'
    }
    const hashChangeComplete = () => {
      window.hashChangeComplete = 'yes'
    }

    router.events.on('hashChangeStart', hashChangeStart)
    router.events.on('hashChangeComplete', hashChangeComplete)

    return () => {
      router.events.off('hashChangeStart', hashChangeStart)
      router.events.off('hashChangeComplete', hashChangeComplete)
    }
  }, [router.events])

  return (
    <>
      <p id="props-locale">{props.locale}</p>
      <p id="router-locale">{router.locale}</p>
      <Link
        href={{ pathname: router.pathname, query: router.query, hash: '#hash' }}
        locale={router.locale === 'fr' ? 'en' : 'fr'}
        id="change-locale"
      >
        Change Locale
      </Link>
      <Link href={{ hash: '#newhash' }} id="hash-change">
        Hash Change
      </Link>
    </>
  )
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      locale,
    },
  }
}
