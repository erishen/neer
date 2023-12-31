import React from 'react'
import Link from 'neer/link'

export async function getServerSideProps({ query }) {
  return {
    props: {
      user: query.user,
      time: (await import('perf_hooks')).performance.now(),
    },
  }
}

export default ({ user, time }) => {
  return (
    <>
      <p>User: {user}</p>
      <span>time: {time}</span>
      <Link href="/" id="home">
        to home
      </Link>
    </>
  )
}
