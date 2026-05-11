import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const search  = searchParams.get('search')  ?? ''
    const uni_id  = searchParams.get('uni_id')  ?? ''
    const dept_id = searchParams.get('dept_id') ?? ''
    const is_open = searchParams.get('is_open') ?? ''
    const page    = parseInt(searchParams.get('page')  ?? '1')
    const limit   = parseInt(searchParams.get('limit') ?? '50')
    const offset  = (page - 1) * limit

    const db = createAdminClient()

    let query = db
      .from('admission')
      .select(`
        admission_id,
        uni_id,
        dept_id,
        title,
        eligible_criteria,
        required_docs,
        how_to_apply,
        apply_link,
        apply_start_date,
        deadline,
        is_open,
        created_at,
        university (
          uni_id,
          uni_name,
          logo_url,
          locations (
            city_name,
            provinces ( province_name )
          )
        ),
        departments (
          dept_name,
          category
        )
      `, { count: 'exact' })

    if (search)  query = query.ilike('title', `%${search}%`)
    if (uni_id)  query = query.eq('uni_id',  parseInt(uni_id))
    if (dept_id) query = query.eq('dept_id', parseInt(dept_id))
    if (is_open === 'true') query = query.eq('is_open', true)

    const { data, error, count } = await query
      .order('deadline', { ascending: true, nullsFirst: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[Admissions API] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    })
  } catch (err) {
    console.error('[Admissions API] Unexpected:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
