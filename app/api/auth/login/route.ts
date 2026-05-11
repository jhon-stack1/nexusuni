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

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email aur password dono zaroori hain.' },
        { status: 400 }
      )
    }

    const db = createAdminClient()
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '0.0.0.0'

    // User dhundo by email
    const { data: user, error: userError } = await db
      .from('users')
      .select('user_id, full_name, username, email, password_hash, is_active, is_verified, locked_until, role_id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (userError) {
      console.error('[Login] DB query error:', userError)
      return NextResponse.json({ error: 'Server error. Dobara try karein.' }, { status: 500 })
    }

    // Check: account locked hai?
    if (user?.locked_until && new Date(user.locked_until) > new Date()) {
      await logAttempt(db, email, ip, false, 'account_locked')
      const unlockTime = new Date(user.locked_until).toLocaleTimeString('ur-PK')
      return NextResponse.json(
        { error: `Account temporarily lock hai. ${unlockTime} ke baad try karein.` },
        { status: 423 }
      )
    }

    // User nahi mila ya password wrong
    if (!user) {
      await logAttempt(db, email, ip, false, 'user_not_found')
      return NextResponse.json(
        { error: 'Email ya password galat hai.' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      await logAttempt(db, email, ip, false, 'wrong_password')

      // 5 failed attempts mein account lock karo (30 min)
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
        { error: 'Email ya password galat hai.' },
        { status: 401 }
      )
    }

    // Account active nahi
    if (!user.is_active) {
      await logAttempt(db, email, ip, false, 'account_inactive')
      return NextResponse.json(
        { error: 'Aapka account deactivate kar diya gaya hai. Support se rabta karein.' },
        { status: 403 }
      )
    }

    // Session token banao
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
      return NextResponse.json({ error: 'Session banana mein error aya.' }, { status: 500 })
    }

    // Last login update karo
    await db
      .from('users')
      .update({ last_login: new Date().toISOString(), last_active: new Date().toISOString(), locked_until: null })
      .eq('user_id', user.user_id)

    await logAttempt(db, email, ip, true, null)

    // Session cookie set karo
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
    return NextResponse.json({ error: 'Server error. Thori der baad try karein.' }, { status: 500 })
  }
}

async function logAttempt(db: ReturnType<typeof createAdminClient>, email: string, ip: string, success: boolean, reason: string | null) {
  await db.from('login_attempts').insert({
    email: email.toLowerCase().trim(),
    ip_address: ip,
    attempted_at: new Date().toISOString(),
    was_successful: success,
    failure_reason: reason,
  })
}
