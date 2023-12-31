import Link from 'neer/link'
import { useRouter } from 'neer/router'

export default function Page(props) {
  const router = useRouter()

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

export const getStaticPaths = () => {
  return {
    paths: [
      {
        params: { slug: ['a'] },
        locale: 'en',
      },
      {
        params: { slug: ['a'] },
        locale: 'fr',
      },
    ],
    fallback: false,
  }
}
