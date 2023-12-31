import React from 'react'
import Link from 'neer/link'
import { useRouter } from 'neer/router'

export async function getServerSideProps({ params, query }) {
  return {
    world: 'world',
    query: query || {},
    params: params || {},
    time: new Date().getTime(),
    random: Math.random(),
  }
}

export default ({ world, time, params, random, query }) => {
  return (
    <>
      <p>hello: {world}</p>
      <span>time: {time}</span>
      <div id="random">{random}</div>
      <div id="params">{JSON.stringify(params)}</div>
      <div id="initial-query">{JSON.stringify(query)}</div>
      <div id="query">{JSON.stringify(useRouter().query)}</div>
      <Link href="/" id="home">
        to home
      </Link>
      <br />
      <Link href="/another" id="another">
        to another
      </Link>
    </>
  )
}
