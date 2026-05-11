import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ test_id: string }> }
) {
  const { test_id: testIdStr } = await params
  const test_id = parseInt(testIdStr)
  
  if (isNaN(test_id)) {
    return NextResponse.json({ error: 'Invalid test_id' }, { status: 400 })
  }

  try {
    const db = createAdminClient()

    const [testRes, structureRes, chaptersRes, prepRes, universityRes, recommendationRes] =
      await Promise.all([
        db.from('entry_test')
          .select('*')
          .eq('test_id', test_id)
          .single(),

        db.from('test_subject_structure')
          .select(`
            structure_id, questions_count, weightage_percentage,
            subject ( subject_id, sub_name, category )
          `)
          .eq('test_id', test_id)
          .order('weightage_percentage', { ascending: false }),

        db.from('subject_chapters')
          .select(`
            chapter_id, chapter_name, importance_rank, weightage_note,
            subject ( subject_id, sub_name )
          `)
          .eq('test_id', test_id)
          .order('importance_rank', { ascending: true }),

        db.from('test_prep_material')
          .select('material_id, title, material_type, importance_level, description, resource_link')
          .eq('test_id', test_id)
          .order('importance_level'),

        db.from('university_test_mapping')
          .select(`
            weightage_percentage, min_score_required,
            university ( uni_id, uni_name, logo_url, sector, uni_type,
              locations ( city_name, provinces ( province_name ) )
            )
          `)
          .eq('test_id', test_id)
          .order('weightage_percentage', { ascending: false }),

        db.from('test_recommendation_rules')
          .select('rule_id, previous_education, target_field, description')
          .eq('recommended_test_id', test_id),
      ])

    if (!testRes.data) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    return NextResponse.json({
      test: testRes.data,
      subject_structure: structureRes.data ?? [],
      important_chapters: chaptersRes.data ?? [],
      prep_material: prepRes.data ?? [],
      accepting_universities: universityRes.data ?? [],
      recommendation_rules: recommendationRes.data ?? [],
    })
  } catch (err) {
    console.error('[Entry Test Detail API] Error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
