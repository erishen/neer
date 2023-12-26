import { useAmp } from 'neer/amp'

export const config = { amp: 'hybrid' }

export default () => {
  const isAmp = useAmp()
  return `Hello ${isAmp ? 'AMP' : 'others'}`
}
