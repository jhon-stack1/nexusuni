import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/db'

const SESSION_COOKIE = 'unipath_session'

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (token) {
      const db = createAdminClient()
      await db
        .from('user_sessions')
        .update({ is_active: false })
        .eq('token', token)

      cookieStore.delete(SESSION_COOKIE)
    }

    return NextResponse.json({ message: 'Logout successful.' })
  } catch (err) {
    console.error('[Logout] Error:', err)
    return NextResponse.json({ error: 'Logout mein error aya.' }, { status: 500 })
  }
}
