import { cookies } from 'neer/headers'

export const runtime = 'experimental-edge'

export default function Page() {
  cookies()
  return <h1>Hello!</h1>
}
