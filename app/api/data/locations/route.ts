import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET() {
  try {
    const db = createAdminClient()
    const { data, error } = await db
      .from('locations')
      .select('location_id, city_name, province_id')
      .order('city_name')

    if (error) {
      return NextResponse.json({ error: 'Locations load nahi ho sakay.' }, { status: 500 })
    }

    return NextResponse.json({ locations: data })
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
