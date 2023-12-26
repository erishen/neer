'use client'

import dynamic from 'neer/dynamic'

const ClientHead = dynamic(() => import('./client-head'), { ssr: false })

export default ClientHead
