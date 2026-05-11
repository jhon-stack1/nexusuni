import { NextRequest, NextResponse } from 'next/server'

// This app uses custom session-based auth, NOT Supabase OAuth.
// This route is kept for compatibility but simply redirects to login.
export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl
  return NextResponse.redirect(`${origin}/login`)
}
