import { Fraunces, Indie_Flower, Roboto } from 'neer-font/google'

const indieFlower = Indie_Flower({ weight: '400', preload: false })
const fraunces = Fraunces({ weight: '400', preload: false })

const robotoMultiple = Roboto({
  weight: ['900', '100'],
  style: ['normal', 'italic'],
})
const frauncesMultiple = Fraunces({
  style: ['italic', 'normal'],
  axes: ['SOFT', 'WONK', 'opsz'],
})

const frauncesMultipleWeights = Fraunces({ weight: ['100', '400', '900'] })

export default function WithFonts() {
  return (
    <>
      <div id="first-google-font" className={indieFlower.className}>
        {JSON.stringify(indieFlower)}
      </div>
      <div id="second-google-font" className={fraunces.className}>
        {JSON.stringify(fraunces)}
      </div>
      <div id="multiple-roboto" className={robotoMultiple.className}>
        {JSON.stringify(robotoMultiple)}
      </div>
      <div id="multiple-fraunces" className={frauncesMultiple.className}>
        {JSON.stringify(frauncesMultiple)}
      </div>
      <div
        id="multiple-weights-fraunces"
        className={frauncesMultipleWeights.className}
      >
        {JSON.stringify(frauncesMultipleWeights)}
      </div>
    </>
  )
}
