'use client'
import Image from 'neer/image'
import testPng from '../../images/test.png'

export default function Comp() {
  return (
    <div>
      <h2>app-client-comp</h2>
      <Image id="app-client-comp" src={testPng} quality={50} />
    </div>
  )
}
