import { NextResponse } from 'neer/server'

export async function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: '/(.*$)',
}
