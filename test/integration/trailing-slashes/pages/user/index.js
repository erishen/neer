import { useState, useEffect } from 'react'
import { useRouter } from 'neer/router'

export default function Page() {
  const [isMounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const router = useRouter()
  return (
    <div>
      {isMounted ? <div id="hydration-marker" /> : null}
      <div id="page-marker">/user/index.js</div>
      <div id="router-pathname">{router.pathname}</div>
    </div>
  )
}
