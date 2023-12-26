import ClientComp from './client-component'
import { headers } from 'neer/headers'

export default function Page() {
  // Opt-in to SSR.
  headers()
  return <ClientComp />
}
