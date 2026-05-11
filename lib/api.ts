// ─── UniPath API Client ───────────────────────────────────────────────────────
// All requests go to Next.js API routes which query Supabase directly.
// ─────────────────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error')
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// ─── Database Types (matching real schema) ────────────────────────────────────

export interface Province {
  province_id: number
  province_name: string
}

export interface Location {
  location_id: number
  city_name: string
  province_id: number
}

export interface Department {
  dept_id: number
  dept_name: string
  category: string
}

export interface UniversityDepartment {
  dept_id: number
  is_famous: boolean
  rating: number | null
  total_seats: number | null
  fee_per_semester: number | null
  allows_non_math_students: boolean
  requires_bridge_course: boolean
  bridge_course_info: string | null
  departments: { dept_name: string; category: string }
}

export interface University {
  uni_id: number
  uni_name: string
  uni_type: string
  sector: string
  website: string | null
  contact_email: string | null
  logo_url: string | null
  description: string | null
  established_year: number | null
  is_active: boolean
  locations: {
    location_id: number
    city_name: string
    provinces: { province_id: number; province_name: string }
  }
  university_departments: UniversityDepartment[]
}

export interface ScholarshipAvailability {
  avail_id: number
  uni_id: number
  quota_seats: number | null
  uni_specific_note: string | null
  university: {
    uni_id: number
    uni_name: string
    logo_url: string | null
    locations: { city_name: string }
  }
}

export interface Scholarship {
  scholarship_id: number
  title: string
  scholarship_type: string
  eligible_criteria: string | null
  required_docs: string | null
  how_to_apply: string | null
  apply_link: string | null
  amount_pkr: number | null
  deadline: string | null
  is_open: boolean
  provinces: { province_id: number; province_name: string } | null
  scholarship_availability: ScholarshipAvailability[]
}

export interface Admission {
  admission_id: number
  uni_id: number
  dept_id: number
  title: string
  eligible_criteria: string | null
  required_docs: string | null
  how_to_apply: string | null
  apply_link: string | null
  apply_start_date: string | null
  deadline: string | null
  is_open: boolean
  university?: { uni_name: string; logo_url: string | null; locations?: { city_name: string } }
  departments?: { dept_name: string; category: string }
}

export interface MeritList {
  list_id: number
  uni_id: number
  dept_id: number
  merit_closing_score: number | null
  merit_year: number
  seat_type: string
  university?: { uni_id: number; uni_name: string; logo_url: string | null; locations?: { city_name: string; provinces?: { province_name: string } } }
  departments?: { dept_id: number; dept_name: string; category: string }
}

export interface MeritListFilters {
  search?: string
  uni_id?: string
  dept_id?: string
  merit_year?: string
  seat_type?: string
  province_id?: string
  page?: number
  limit?: number
}

export const getMeritLists = (filters: MeritListFilters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) params.set(k, String(v))
  })
  const qs = params.toString()
  return apiFetch<PaginatedResponse<MeritList>>(`/api/merit-list${qs ? `?${qs}` : ''}`)
}

export interface FilterOptions {
  provinces: Province[]
  locations: Location[]
  departments: Department[]
  uni_types: string[]
  sectors: string[]
  scholarship_types: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CurrentUser {
  user_id: number
  full_name: string
  username: string
  email: string
  role: string
  province_id: number | null
  location_id: number | null
  profile_picture_url: string | null
}

// ─── Universities ─────────────────────────────────────────────────────────────

export interface UniversityFilters {
  search?: string
  province_id?: string
  location_id?: string
  uni_type?: string
  sector?: string
  dept_id?: string
  page?: number
  limit?: number
}

export const getUniversities = (filters: UniversityFilters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) params.set(k, String(v))
  })
  const qs = params.toString()
  return apiFetch<PaginatedResponse<University>>(`/api/universities${qs ? `?${qs}` : ''}`)
}

// ─── Scholarships ─────────────────────────────────────────────────────────────

export interface ScholarshipFilters {
  search?: string
  province_id?: string
  scholarship_type?: string
  uni_id?: string
  is_open?: boolean
  page?: number
  limit?: number
}

export const getScholarships = (filters: ScholarshipFilters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) params.set(k, String(v))
  })
  const qs = params.toString()
  return apiFetch<PaginatedResponse<Scholarship>>(`/api/scholarships${qs ? `?${qs}` : ''}`)
}

// ─── Admissions ───────────────────────────────────────────────────────────────

export interface AdmissionFilters {
  search?: string
  uni_id?: string
  dept_id?: string
  is_open?: boolean
  page?: number
  limit?: number
}

export const getAdmissions = (filters: AdmissionFilters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== null) params.set(k, String(v))
  })
  const qs = params.toString()
  return apiFetch<PaginatedResponse<Admission>>(`/api/admissions${qs ? `?${qs}` : ''}`)
}

// ─── Filter Options ──────────────────────────────────────────────────────────

export const getFilterOptions = () =>
  apiFetch<FilterOptions>('/api/filter-options')

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const data = await apiFetch<{ user: CurrentUser }>('/api/auth/me')
    return data.user ?? null
  } catch {
    return null
  }
}

export async function logout() {
  await apiFetch('/api/auth/logout', { method: 'POST' })
}

// ─── Admission Predictor ──────────────────────────────────────────────────────

export interface UniversityFormula {
  formula_id: number
  uni_id: number
  dept_name: string
  matric_weight: number
  inter_weight: number
  entry_test_weight: number
  olevel_weight: number | null
  alevel_weight: number | null
}

export interface PredictorPayload {
  qualification_type: 'matric_fsc' | 'olevel_alevel'
  matric_obtained?: number
  matric_total?: number
  inter_obtained?: number
  inter_total?: number
  olevel_obtained?: number
  olevel_total?: number
  alevel_obtained?: number
  alevel_total?: number
  entry_test_obtained?: number
  entry_test_total?: number
  university_id: number
  department: string
}

export interface PredictorResult {
  aggregate: number
  formula_used: UniversityFormula
  historical_cutoffs: { year: number; cutoff: number }[]
  prediction: 'high' | 'medium' | 'low'
  message: string
}

export async function getFormulas(uni_id: number): Promise<UniversityFormula[]> {
  return apiFetch<UniversityFormula[]>(`/api/aggregate-formulas?uni_id=${uni_id}`)
}

export async function predictAdmission(payload: PredictorPayload): Promise<PredictorResult> {
  // Calculate aggregate based on formula
  const formulas = await getFormulas(payload.university_id)
  const formula = formulas.find(f => f.dept_name === payload.department)
  
  if (!formula) {
    throw new Error('No formula found for this department')
  }

  let aggregate = 0
  
  if (payload.qualification_type === 'matric_fsc') {
    const matricPercent = payload.matric_obtained && payload.matric_total 
      ? (payload.matric_obtained / payload.matric_total) * 100 : 0
    const interPercent = payload.inter_obtained && payload.inter_total 
      ? (payload.inter_obtained / payload.inter_total) * 100 : 0
    const entryPercent = payload.entry_test_obtained && payload.entry_test_total 
      ? (payload.entry_test_obtained / payload.entry_test_total) * 100 : 0
    
    aggregate = (matricPercent * formula.matric_weight / 100) +
                (interPercent * formula.inter_weight / 100) +
                (entryPercent * formula.entry_test_weight / 100)
  } else {
    const olevelPercent = payload.olevel_obtained && payload.olevel_total 
      ? (payload.olevel_obtained / payload.olevel_total) * 100 : 0
    const alevelPercent = payload.alevel_obtained && payload.alevel_total 
      ? (payload.alevel_obtained / payload.alevel_total) * 100 : 0
    const entryPercent = payload.entry_test_obtained && payload.entry_test_total 
      ? (payload.entry_test_obtained / payload.entry_test_total) * 100 : 0
    
    aggregate = (olevelPercent * (formula.olevel_weight ?? 0) / 100) +
                (alevelPercent * (formula.alevel_weight ?? 0) / 100) +
                (entryPercent * formula.entry_test_weight / 100)
  }

  // Fetch historical merit data
  const meritData = await getMeritLists({ 
    uni_id: String(payload.university_id),
    limit: 5 
  })
  
  const historicalCutoffs = meritData.data
    .filter(m => m.departments?.dept_name === payload.department)
    .map(m => ({ year: m.merit_year, cutoff: m.merit_closing_score ?? 0 }))
    .sort((a, b) => b.year - a.year)

  const avgCutoff = historicalCutoffs.length > 0 
    ? historicalCutoffs.reduce((acc, c) => acc + c.cutoff, 0) / historicalCutoffs.length 
    : 70

  let prediction: 'high' | 'medium' | 'low'
  let message: string

  if (aggregate >= avgCutoff + 5) {
    prediction = 'high'
    message = 'Excellent chances! Your aggregate is well above the historical cutoff.'
  } else if (aggregate >= avgCutoff - 5) {
    prediction = 'medium'
    message = 'Good chances! Your aggregate is close to the historical cutoff.'
  } else {
    prediction = 'low'
    message = 'Consider improving your scores or exploring other options.'
  }

  return {
    aggregate: Math.round(aggregate * 100) / 100,
    formula_used: formula,
    historical_cutoffs: historicalCutoffs,
    prediction,
    message,
  }
}

export async function getUniversitiesForPredictor(): Promise<{ uni_id: number; uni_name: string }[]> {
  const data = await getUniversities({ limit: 100 })
  return data.data.map(u => ({ uni_id: u.uni_id, uni_name: u.uni_name }))
}
