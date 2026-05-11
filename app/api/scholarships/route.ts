import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const search          = searchParams.get('search')          ?? ''
    const province_id     = searchParams.get('province_id')     ?? ''
    const scholarship_type = searchParams.get('scholarship_type') ?? ''
    const uni_id          = searchParams.get('uni_id')          ?? ''
    const is_open         = searchParams.get('is_open')         ?? ''
    const page            = parseInt(searchParams.get('page')   ?? '1')
    const limit           = parseInt(searchParams.get('limit')  ?? '50')
    const offset          = (page - 1) * limit

    const db = createAdminClient()

    let query = db
      .from('scholarship')
      .select(`
        scholarship_id,
        title,
        scholarship_type,
        eligible_criteria,
        required_docs,
        how_to_apply,
        apply_link,
        amount_pkr,
        deadline,
        is_open,
        created_at,
        provinces (
          province_id,
          province_name
        ),
        scholarship_availability (
          avail_id,
          uni_id,
          quota_seats,
          uni_specific_note,
          university (
            uni_id,
            uni_name,
            logo_url,
            locations (
              city_name
            )
          )
        )
      `, { count: 'exact' })

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    if (province_id) {
      query = query.eq('province_id', parseInt(province_id))
    }
    if (scholarship_type) {
      query = query.eq('scholarship_type', scholarship_type)
    }
    if (is_open === 'true') {
      query = query.eq('is_open', true)
    }

    const { data, error, count } = await query
      .order('deadline', { ascending: true, nullsFirst: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[Scholarships API] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let results = data ?? []

    // Post-filter by university
    if (uni_id) {
      results = results.filter((s: any) =>
        (s.scholarship_availability as any[])?.some(
          (sa: any) => sa.uni_id === parseInt(uni_id)
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
    console.error('[Scholarships API] Unexpected:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
