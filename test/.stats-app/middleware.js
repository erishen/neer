import { NextResponse } from 'neer/server'

export default async function middleware() {
  return NextResponse.next()
}
