import { useAmp } from 'neer/amp'

export const config = {
  amp: true,
}

export default () => (useAmp() ? 'AMP mode' : 'Normal mode')
