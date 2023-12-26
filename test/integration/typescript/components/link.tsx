import React from 'react'
import Link, { LinkProps } from 'neer/link'

export default () => {
  const props: LinkProps = {
    href: '/page',
    as: '/as-page',
  }

  return <Link {...props}>Test</Link>
}
