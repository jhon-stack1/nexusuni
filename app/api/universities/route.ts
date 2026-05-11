import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const search    = searchParams.get('search')    ?? ''
    const province_id = searchParams.get('province_id') ?? ''
    const location_id = searchParams.get('location_id') ?? ''
    const uni_type  = searchParams.get('uni_type')  ?? ''
    const sector    = searchParams.get('sector')    ?? ''
    const dept_id   = searchParams.get('dept_id')   ?? ''
    const page      = parseInt(searchParams.get('page')  ?? '1')
    const limit     = parseInt(searchParams.get('limit') ?? '50')
    const offset    = (page - 1) * limit

    const db = createAdminClient()

    let query = db
      .from('university')
      .select(`
        uni_id,
        uni_name,
        uni_type,
        sector,
        website,
        contact_email,
        logo_url,
        description,
        established_year,
        is_active,
        locations (
          location_id,
          city_name,
          provinces (
            province_id,
            province_name
          )
        ),
        university_departments (
          dept_id,
          is_famous,
          rating,
          total_seats,
          fee_per_semester,
          allows_non_math_students,
          departments (
            dept_name,
            category
          )
        )
      `, { count: 'exact' })
      .eq('is_active', true)

    if (search)      query = query.ilike('uni_name', `%${search}%`)
    if (uni_type)    query = query.eq('uni_type', uni_type)
    if (sector)      query = query.eq('sector', sector)
    if (location_id) query = query.eq('location_id', parseInt(location_id))

    const { data, error, count } = await query
      .order('uni_name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[Universities API] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let results = data ?? []

    // Post-filter by province
    if (province_id) {
      results = results.filter((u: any) =>
        (u.locations as any)?.provinces?.province_id === parseInt(province_id)
      )
    }

    // Post-filter by department
    if (dept_id) {
      results = results.filter((u: any) =>
        (u.university_departments as any[])?.some(
          (ud: any) => ud.dept_id === parseInt(dept_id)
        )
      )
    }

    return NextResponse.json({
      data: results,
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    })
  } catch (err) {
    console.error('[Universities API] Unexpected:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
