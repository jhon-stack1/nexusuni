import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createAdminClient } from '@/lib/db'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'unipath_session'
const SESSION_DURATION_DAYS = 7

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // English error messages only
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const db = createAdminClient()
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '0.0.0.0'

    // Case-insensitive email lookup
    const { data: user, error: userError } = await db
      .from('users')
      .select('user_id, full_name, username, email, password_hash, is_active, is_verified, locked_until, role_id')
      .ilike('email', email.trim())
      .maybeSingle()

    if (userError) {
      console.error('[Login] DB query error:', userError)
      return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
    }

    // Check: account locked?
    if (user?.locked_until && new Date(user.locked_until) > new Date()) {
      await logAttempt(db, email, ip, false, 'account_locked')
      const unlockTime = new Date(user.locked_until).toLocaleTimeString()
      return NextResponse.json(
        { error: `Account temporarily locked. Please try again after ${unlockTime}.` },
        { status: 423 }
      )
    }

    // User not found
    if (!user) {
      await logAttempt(db, email, ip, false, 'user_not_found')
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      await logAttempt(db, email, ip, false, 'wrong_password')

      // Lock account after 4 failed attempts in 30 minutes
      const { count } = await db
        .from('login_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('email', email.toLowerCase().trim())
        .eq('was_successful', false)
        .gte('attempted_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())

      if ((count ?? 0) >= 4) {
        await db
          .from('users')
          .update({ locked_until: new Date(Date.now() + 30 * 60 * 1000).toISOString() })
          .eq('user_id', user.user_id)
      }

      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // Account is not active — use null for failure_reason to avoid DB constraint error
    if (!user.is_active) {
      await logAttempt(db, email, ip, false, null)
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    // Generate session token
    const token = crypto.randomUUID() + '-' + crypto.randomUUID()
    const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)

    const { error: sessionError } = await db.from('user_sessions').insert({
      user_id: user.user_id,
      token,
      device_info: req.headers.get('user-agent') ?? 'unknown',
      ip_address: ip,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true,
    })

    if (sessionError) {
      console.error('[Login] Session insert error:', sessionError)
      return NextResponse.json({ error: 'Failed to create session. Please try again.' }, { status: 500 })
    }

    // Update last_login and last_active
    const { error: updateError } = await db
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        last_active: new Date().toISOString(),
        locked_until: null,
      })
      .eq('user_id', user.user_id)

    if (updateError) {
      console.error('[Login] User update error:', updateError)
    }

    await logAttempt(db, email, ip, true, null)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return NextResponse.json({
      message: 'Login successful!',
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        is_verified: user.is_verified,
      },
    })
  } catch (err) {
    console.error('[Login] Unexpected error:', err)
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}

async function logAttempt(
  db: ReturnType<typeof createAdminClient>,
  email: string,
  ip: string,
  success: boolean,
  reason: string | null
) {
  await db.from('login_attempts').insert({
    email: email.toLowerCase().trim(),
    ip_address: ip,
    attempted_at: new Date().toISOString(),
    was_successful: success,
    failure_reason: reason,
  })
}
