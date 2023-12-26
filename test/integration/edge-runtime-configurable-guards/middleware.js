import { NextResponse } from 'neer/server'

// populated with tests
export default () => {
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
