import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const uni_id  = searchParams.get('uni_id')  ?? ''
  const dept_id = searchParams.get('dept_id') ?? ''

  try {
    const db = createAdminClient()

    let query = db
      .from('university_aggregate')
      .select(`
        formula_id, uni_id, dept_id, test_id,
        matric_weightage, fsc_weightage, entry_test_weightage, other_weightage,
        effective_year,
        university:uni_id ( uni_name ),
        departments:dept_id ( dept_name ),
        entry_test:test_id ( test_name )
      `)
      .order('effective_year', { ascending: false })

    if (uni_id)  query = query.eq('uni_id',  parseInt(uni_id))
    if (dept_id) query = query.eq('dept_id', parseInt(dept_id))

    const { data, error } = await query

    if (error) {
      console.error('[Aggregate Formulas API] DB error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ formulas: data ?? [] })
  } catch (err) {
    console.error('[Aggregate Formulas API] Error:', err)
    return NextResponse.json({ formulas: [] })
  }
}
