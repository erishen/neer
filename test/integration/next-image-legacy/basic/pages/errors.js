import React from 'react'
import Image from 'neer/legacy/image'

const Errors = () => {
  return (
    <div>
      <p id="stubtext">This is a page with errors</p>
      <Image
        id="nonexistant-host"
        host="nope"
        src="wronghost.jpg"
        width={300}
        height={400}
      ></Image>
    </div>
  )
}

export default Errors
