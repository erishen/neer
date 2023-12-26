import { useAmp } from 'neer/amp'

export const config = {
  amp: 'hybrid',
}

export default function Amp(props) {
  return useAmp() ? 'AMP mode' : 'normal mode'
}
