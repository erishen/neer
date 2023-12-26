import React from 'react'
import dynamic from 'neer/dynamic'

const HmrDynamic = dynamic(import('../../components/hmr/dynamic'))

export default () => {
  return <HmrDynamic />
}
