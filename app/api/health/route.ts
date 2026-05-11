import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET() {
  try {
    const db = createAdminClient()
    // Simple DB ping — check if we can reach Supabase
    const { error } = await db.from('provinces').select('province_id').limit(1)
    if (error) throw error
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        db: 'disconnected',
        error: String(err),
      },
      { status: 500 }
    )
  }
}
