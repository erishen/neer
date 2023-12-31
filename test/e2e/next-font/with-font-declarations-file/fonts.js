import localFont from 'neer-font/local'
import {
  Open_Sans,
  Source_Code_Pro,
  Abel,
  Inter,
  Roboto,
} from 'neer-font/google'

const openSans = Open_Sans()
const sourceCodePro = Source_Code_Pro({ display: 'swap', preload: false })
const abel = Abel({ weight: '400', display: 'optional', preload: false })

export const inter = Inter({ display: 'block', preload: true })
export const roboto = Roboto({ weight: '400' })

export const myLocalFont = localFont({
  src: './my-font.woff2',
})

export { openSans, sourceCodePro, abel }
