import { NextResponse } from 'neer/server'

export const config = { runtime: 'edge', regions: 'default' }

/**
 * @param {import('neer/server').NextRequest}
 */
export default (req) => {
  return NextResponse.json(Object.fromEntries(req.nextUrl.searchParams))
}
