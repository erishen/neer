import { NextResponse } from 'neer/server'

export function middleware() {
  return NextResponse.next()
}
