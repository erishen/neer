import { redirect } from 'neer/navigation'

export default async function Home() {
  redirect('success')
  return <h1>Home</h1>
}
