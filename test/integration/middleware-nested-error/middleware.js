import { NextResponse } from 'neer/server'

export default function middleware() {
  return NextResponse.next()
}
