import { headers } from 'neer/headers'

export const dynamic = 'error'

export default function Page() {
  headers()
  return (
    <>
      <p id="page">/dynamic-error</p>
      <p id="date">{Date.now()}</p>
    </>
  )
}
