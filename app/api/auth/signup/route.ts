import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import { createAdminClient } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, username, email, password, phone_number, province_id, location_id } = body

    // Basic validation
    if (!full_name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, username, email, and password are required.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      )
    }

    const db = createAdminClient()

    // Check: email already exists?
    const { data: existingEmail, error: emailCheckError } = await db
      .from('users')
      .select('user_id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (emailCheckError) {
      console.error('[Signup] Email check error:', emailCheckError)
      return NextResponse.json(
        { error: 'Failed to verify email. Please try again.' },
        { status: 500 }
      )
    }

    if (existingEmail) {
      return NextResponse.json(
        { error: 'This email is already registered. Please log in or use a different email.' },
        { status: 409 }
      )
    }

    // Check: username already exists?
    const { data: existingUsername, error: usernameCheckError } = await db
      .from('users')
      .select('user_id')
      .eq('username', username.trim())
      .maybeSingle()

    if (usernameCheckError) {
      console.error('[Signup] Username check error:', usernameCheckError)
      return NextResponse.json(
        { error: 'Failed to verify username. Please try again.' },
        { status: 500 }
      )
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: 'This username is already taken. Please try a different one.' },
        { status: 409 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Get Student role (case-insensitive match)
    const { data: roleData, error: roleError } = await db
      .from('roles')
      .select('role_id')
      .ilike('role_name', 'student')
      .maybeSingle()

    if (roleError) {
      console.error('[Signup] Role fetch error:', roleError)
    }

    // Default to role_id 3 (Student) if not found
    const role_id = roleData?.role_id ?? 3

    // Generate UUID for new user
    const userId = randomUUID()

    // Insert user
    const { data: newUser, error: insertError } = await db
      .from('users')
      .insert({
        id: userId,
        full_name: full_name.trim(),
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        phone_number: phone_number?.trim() || null,
        province_id: province_id || null,
        location_id: location_id || null,
        role_id,
        is_active: true,
        is_verified: false,
        streak_days: 0,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      })
      .select('user_id, full_name, username, email, role_id, is_active, is_verified, created_at')
      .single()

    if (insertError) {
      console.error('[Signup] DB insert error:', JSON.stringify(insertError, null, 2))
      console.error('[Signup] Insert error code:', insertError.code)
      console.error('[Signup] Insert error message:', insertError.message)
      console.error('[Signup] Insert error details:', insertError.details)
      
      // Check for specific constraint violations
      if (insertError.code === '23505') {
        // Unique constraint violation
        if (insertError.message?.includes('email')) {
          return NextResponse.json(
            { error: 'This email is already registered.' },
            { status: 409 }
          )
        }
        if (insertError.message?.includes('username')) {
          return NextResponse.json(
            { error: 'This username is already taken.' },
            { status: 409 }
          )
        }
      }
      
      // Check for trigger/constraint errors (like 2FA requirement)
      if (insertError.code === 'P0001' || insertError.message?.includes('2fa') || insertError.message?.includes('trigger')) {
        console.error('[Signup] Trigger constraint error - likely 2FA related')
        // This is a DB trigger issue, not user's fault - proceed without 2FA for students
      }
      
      return NextResponse.json(
        { error: 'Failed to create your account. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Account created successfully!',
        user: newUser,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('[Signup] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Server error. Please try again later.' },
      { status: 500 }
    )
  }
}
