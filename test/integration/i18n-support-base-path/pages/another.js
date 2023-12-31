import Link from 'neer/link'
import { useRouter } from 'neer/router'

export default function Page(props) {
  const router = useRouter()

  return (
    <>
      <p id="another">another page</p>
      <p id="props">{JSON.stringify(props)}</p>
      <p id="router-locale">{router.locale}</p>
      <p id="router-default-locale">{router.defaultLocale}</p>
      <p id="router-locales">{JSON.stringify(router.locales)}</p>
      <p id="router-query">{JSON.stringify(router.query)}</p>
      <p id="router-pathname">{router.pathname}</p>
      <p id="router-as-path">{router.asPath}</p>
      <Link href="/" id="to-index">
        to /
      </Link>
      <br />
    </>
  )
}

export const getServerSideProps = ({ locale, locales, defaultLocale }) => {
  return {
    props: {
      locale,
      locales,
      defaultLocale,
    },
  }
}
