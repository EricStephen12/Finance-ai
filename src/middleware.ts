import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Remove middleware for now as we're using client-side Firebase auth
export async function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: []
} 