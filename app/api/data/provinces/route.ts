import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET() {
  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('provinces')
      .select('province_id, province_name')
      .order('province_name')

    if (error) {
      return NextResponse.json({ error: 'Provinces load nahi ho sakay.' }, { status: 500 })
    }

    return NextResponse.json({ provinces: data })
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
