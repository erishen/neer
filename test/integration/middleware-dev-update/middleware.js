import { NextResponse } from 'neer/server'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/_next/')) return

  const res = NextResponse.rewrite(new URL('/', request.url))
  res.headers.set('X-From-Middleware', 'true')
  return res
}
