import { Abel } from 'neer-font/google'
const abel = Abel({ weight: '400', display: 'optional', preload: false })

export default function NoPreload() {
  return <p className={abel.className}>Hello world</p>
}
