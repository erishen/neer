'use client'
import Link from 'neer/link'
import { useRouter } from 'neer/navigation'

export default function Page({ params }) {
  const router = useRouter()
  return (
    <>
      <h1 id={`message-${params.id}`}>Hello from {params.id}</h1>
      <Link
        href={params.id === '1' ? '/back-forward/2' : '/back-forward/1'}
        id="to-other-page"
      >
        Go to {params.id === '1' ? '2' : '1'}
      </Link>
      <button onClick={() => router.back()} id="back-button">
        Back
      </button>
      <button onClick={() => router.forward()} id="forward-button">
        Forward
      </button>
    </>
  )
}
