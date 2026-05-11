import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/db'

export async function GET() {
  try {
    const db = createAdminClient()

    const [testsRes, structureRes, prepRes, chaptersRes, uniMappingRes] = await Promise.all([
      // All entry tests with full info
      db.from('entry_test')
        .select('test_id, test_name, conducting_body, test_type, test_date, registration_deadline, official_link')
        .order('test_name'),

      // Subject structure per test (how many questions, weightage per subject)
      db.from('test_subject_structure')
        .select(`
          structure_id, test_id, questions_count, weightage_percentage,
          subject ( subject_id, sub_name, category )
        `)
        .order('test_id'),

      // Prep materials per test
      db.from('test_prep_material')
        .select('material_id, test_id, title, material_type, importance_level, description, resource_link')
        .order('test_id'),

      // Important chapters per test (via subject_chapters linked to entry_test)
      db.from('subject_chapters')
        .select(`
          chapter_id, chapter_name, importance_rank, weightage_note, test_id,
          subject ( subject_id, sub_name )
        `)
        .order('importance_rank', { ascending: true }),

      // Which universities accept which tests
      db.from('university_test_mapping')
        .select(`
          uni_id, test_id, weightage_percentage, min_score_required,
          university ( uni_id, uni_name, logo_url, sector, uni_type,
            locations ( city_name, provinces ( province_name ) )
          )
        `)
        .order('uni_id'),
    ])

    return NextResponse.json({
      tests: testsRes.data ?? [],
      subject_structure: structureRes.data ?? [],
      prep_material: prepRes.data ?? [],
      important_chapters: chaptersRes.data ?? [],
      university_mapping: uniMappingRes.data ?? [],
    })
  } catch (err) {
    console.error('[Entry Tests API] Error:', err)
    return NextResponse.json({
      tests: [],
      subject_structure: [],
      prep_material: [],
      important_chapters: [],
      university_mapping: [],
    })
  }
}
