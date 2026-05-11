import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/db'

const SESSION_COOKIE = 'unipath_session'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const db = createAdminClient()

    // Session check karo
    const { data: session, error } = await db
      .from('user_sessions')
      .select('user_id, expires_at, is_active')
      .eq('token', token)
      .maybeSingle()

    if (error || !session || !session.is_active || new Date(session.expires_at) < new Date()) {
      // Expired ya invalid session — cookie delete karo
      cookieStore.delete(SESSION_COOKIE)
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // User info fetch karo
    const { data: user } = await db
      .from('users')
      .select('user_id, full_name, username, email, role_id, is_verified, is_active, profile_picture, province_id, location_id')
      .eq('user_id', session.user_id)
      .single()

    if (!user || !user.is_active) {
      cookieStore.delete(SESSION_COOKIE)
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (err) {
    console.error('[Me] Error:', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
