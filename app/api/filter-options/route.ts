import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET() {
  try {
    const db = createAdminClient()

    const [provincesRes, locationsRes, deptsRes, uniTypesRes] = await Promise.all([
      db.from('provinces').select('province_id, province_name').order('province_name'),
      db.from('locations').select('location_id, city_name, province_id').order('city_name'),
      db.from('departments').select('dept_id, dept_name, category').order('dept_name'),
      db.from('university').select('uni_type, sector').eq('is_active', true),
    ])

    const uni_types = [...new Set(
      (uniTypesRes.data ?? []).map((u: any) => u.uni_type).filter(Boolean)
    )].sort()

    const sectors = [...new Set(
      (uniTypesRes.data ?? []).map((u: any) => u.sector).filter(Boolean)
    )].sort()

    return NextResponse.json({
      provinces: provincesRes.data ?? [],
      locations: locationsRes.data ?? [],
      departments: deptsRes.data ?? [],
      uni_types,
      sectors,
      scholarship_types: ['Merit-Based', 'Need-Based', 'Government', 'Private', 'International'],
    })
  } catch (err) {
    console.error('[Filter Options API] Error:', err)
    // Fallback so UI never breaks
    return NextResponse.json({
      provinces: [],
      locations: [],
      departments: [],
      uni_types: ['Public', 'Private'],
      sectors: ['Engineering', 'Medical', 'General', 'Business'],
      scholarship_types: ['Merit-Based', 'Need-Based', 'Government', 'Private'],
    })
  }
}
