import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const search = searchParams.get('search') ?? ''
    const uni_id = searchParams.get('uni_id') ?? ''
    const dept_id = searchParams.get('dept_id') ?? ''
    const merit_year = searchParams.get('merit_year') ?? ''
    const seat_type = searchParams.get('seat_type') ?? ''
    const province_id = searchParams.get('province_id') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '12', 10))
    const from = (page - 1) * limit
    const to = from + limit - 1

    const db = createAdminClient()

    let query = db
      .from('merit_list')
      .select(
        `list_id, uni_id, dept_id, merit_closing_score, merit_year, seat_type,
         university:uni_id ( uni_id, uni_name, logo_url, locations ( city_name, provinces ( province_name ) ) ),
         departments:dept_id ( dept_id, dept_name, category )`,
        { count: 'exact' }
      )

    if (uni_id) query = query.eq('uni_id', uni_id)
    if (dept_id) query = query.eq('dept_id', dept_id)
    if (merit_year) query = query.eq('merit_year', merit_year)
    if (seat_type) query = query.eq('seat_type', seat_type)

    const { data, count, error } = await query
      .order('merit_year', { ascending: false })
      .order('merit_closing_score', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('[Merit List API] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let filtered = data ?? []

    // Province filter applied in-memory (nested join)
    if (province_id) {
      filtered = filtered.filter(
        (m: any) => m.university?.locations?.provinces?.province_id === parseInt(province_id)
      )
    }

    // Search filter in-memory for nested fields
    if (search) {
      const s = search.toLowerCase()
      filtered = (data ?? []).filter(
        (m: any) =>
          m.university?.uni_name?.toLowerCase().includes(s) ||
          m.departments?.dept_name?.toLowerCase().includes(s)
      )
    }

    return NextResponse.json({
      data: search || province_id ? filtered : data,
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    })
  } catch (err) {
    console.error('[Merit List API] Unexpected:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
