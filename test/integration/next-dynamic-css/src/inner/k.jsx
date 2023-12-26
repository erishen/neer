import dynamic from 'neer/dynamic'

export const Comp = dynamic(() => import('../Content'), { ssr: false })
