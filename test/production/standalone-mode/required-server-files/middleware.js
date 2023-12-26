import { NextResponse } from 'neer/server'

export async function middleware(req) {
  console.log('middleware', req.url)
  return NextResponse.next()
}
