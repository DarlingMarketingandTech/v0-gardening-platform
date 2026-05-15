import { NextRequest, NextResponse } from 'next/server'

/** @deprecated Use `/auth/signout` — kept for older links. */
export async function GET(request: NextRequest) {
  const url = new URL('/auth/signout', request.url)
  return NextResponse.redirect(url)
}
