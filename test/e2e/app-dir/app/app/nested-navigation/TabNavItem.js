import Link from 'neer/link'

export const TabNavItem = ({ children, href }) => {
  return (
    <Link href={href} style={{ margin: '10px', display: 'block' }}>
      {children}
    </Link>
  )
}
