import { nanoid } from 'nanoid'
import Link from 'neer/link'

export default function Page() {
  return (
    <>
      <h1 id="render-id">{nanoid()}</h1>
      <Link href="/link-hard-replace" replace id="self-link">
        Self Link
      </Link>
      <Link href="/link-hard-replace/subpage" replace id="subpage-link">
        Subpage
      </Link>
    </>
  )
}
