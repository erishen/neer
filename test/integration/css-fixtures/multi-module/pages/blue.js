import Link from 'neer/link'
import { blueText } from './blue.module.css'

export default function Blue() {
  return (
    <>
      <div id="verify-blue" className={blueText}>
        This text should be blue.
      </div>
      <br />
      <Link href="/red" prefetch id="link-red">
        Red
      </Link>
      <br />
      <Link href="/none" prefetch={false} id="link-none">
        None
      </Link>
    </>
  )
}
