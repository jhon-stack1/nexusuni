'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, LayoutGrid, List, BarChart3, GraduationCap, Building2, Calendar, Award } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { getMeritLists, getFilterOptions, type MeritList, type FilterOptions } from '@/lib/api'

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-white/30 text-sm">N/A</span>
  const color =
    score >= 80 ? '#22C55E' :
    score >= 60 ? '#F59E0B' :
    '#EF4444'
  return (
    <span className="font-bold text-lg" style={{ color }}>
      {score.toFixed(1)}
    </span>
  )
}

// ─── Merit Card (Grid) ────────────────────────────────────────────────────────
function MeritCard({ item }: { item: MeritList }) {
  const uniName = item.university?.uni_name ?? `University #${item.uni_id}`
  const deptName = item.departments?.dept_name ?? `Dept #${item.dept_id}`
  const city = item.university?.locations?.city_name ?? '—'
  const province = item.university?.locations?.provinces?.province_name ?? ''

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-2xl p-5 border border-white/8 hover:border-amber-400/30 transition-colors group"
      style={{ background: 'rgba(13,30,53,0.7)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Building2 className="w-5 h-5 text-amber-400" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm leading-tight truncate">{uniName}</p>
          <p className="text-white/50 text-xs mt-0.5 truncate">{city}{province ? `, ${province}` : ''}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl"
        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <GraduationCap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span className="text-indigo-300 text-xs font-medium truncate">{deptName}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg py-2 px-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <ScoreBadge score={item.merit_closing_score} />
          <p className="text-white/35 text-xs mt-0.5">Closing</p>
        </div>
        <div className="rounded-lg py-2 px-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <span className="font-bold text-lg text-sky-400">{item.merit_year}</span>
          <p className="text-white/35 text-xs mt-0.5">Year</p>
        </div>
        <div className="rounded-lg py-2 px-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <span className="font-bold text-sm text-purple-300 capitalize">{item.seat_type}</span>
          <p className="text-white/35 text-xs mt-0.5">Seat</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Merit Row (Table) ────────────────────────────────────────────────────────
function MeritRow({ item, index }: { item: MeritList; index: number }) {
  const uniName = item.university?.uni_name ?? `University #${item.uni_id}`
  const deptName = item.departments?.dept_name ?? `Dept #${item.dept_id}`
  const city = item.university?.locations?.city_name ?? '—'

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-white/5 hover:bg-white/3 transition-colors"
    >
      <td className="py-3.5 px-4">
        <p className="text-white text-sm font-medium">{uniName}</p>
        <p className="text-white/40 text-xs mt-0.5">{city}</p>
      </td>
      <td className="py-3.5 px-4 text-white/70 text-sm">{deptName}</td>
      <td className="py-3.5 px-4 text-white/60 text-sm">{item.merit_year}</td>
      <td className="py-3.5 px-4"><ScoreBadge score={item.merit_closing_score} /></td>
      <td className="py-3.5 px-4">
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
          style={{ background: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}>
          {item.seat_type}
        </span>
      </td>
    </motion.tr>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function MeritSkeleton({ view }: { view: 'grid' | 'table' }) {
  if (view === 'table') return (
    <tr className="border-b border-white/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="h-4 rounded-md animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  )
  return (
    <div className="rounded-2xl p-5 border border-white/5 animate-pulse" style={{ background: 'rgba(13,30,53,0.5)' }}>
      <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 rounded-md w-3/4" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-3 rounded-md w-1/2" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>
      <div className="h-8 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3].map(i => <div key={i} className="h-14 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MeritListPage() {
  const [meritLists, setMeritLists] = useState<MeritList[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 12

  const [search, setSearch]       = useState('')
  const [uniId, setUniId]         = useState('')
  const [deptId, setDeptId]       = useState('')
  const [meritYear, setMeritYear] = useState('')
  const [seatType, setSeatType]   = useState('')
  const [provinceId, setProvinceId] = useState('')

  const YEARS = Array.from({ length: 8 }, (_, i) => String(new Date().getFullYear() - i))
  const SEAT_TYPES = ['Open', 'Self', 'Reserved', 'Foreign', 'FATA', 'Sports', 'Disabled']

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getMeritLists({ search, uni_id: uniId, dept_id: deptId, merit_year: meritYear, seat_type: seatType, province_id: provinceId, page, limit })
      setMeritLists(res.data)
      setTotal(res.total)
    } catch (e: any) {
      setError(e.message ?? 'Failed to load merit lists')
    } finally {
      setLoading(false)
    }
  }, [search, uniId, deptId, meritYear, seatType, provinceId, page, limit])

  useEffect(() => { getFilterOptions().then(setFilterOptions).catch(() => {}) }, [])
  useEffect(() => { setPage(1) }, [search, uniId, deptId, meritYear, seatType, provinceId])
  useEffect(() => { fetchData() }, [fetchData])

  const clearFilters = () => {
    setSearch(''); setUniId(''); setDeptId(''); setMeritYear(''); setSeatType(''); setProvinceId('')
  }
  const activeFiltersCount = [uniId, deptId, meritYear, seatType, provinceId].filter(Boolean).length
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #060D1A 0%, #0A1628 50%, #0D1F3C 100%)' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.25),rgba(245,158,11,0.08))', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Merit Lists</h1>
              <p className="text-white/40 text-sm mt-0.5">Historical closing merit scores by university &amp; department</p>
            </div>
          </div>
          {total > 0 && !loading && (
            <p className="text-white/30 text-sm">{total.toLocaleString()} records found</p>
          )}
        </div>

        {/* Search + Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search university or department..."
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <button
            onClick={() => setFiltersOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ background: filtersOpen ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)', color: filtersOpen ? '#F59E0B' : 'rgba(255,255,255,0.7)', border: `1px solid ${filtersOpen ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}` }}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: '#F59E0B', color: '#0A1628' }}>{activeFiltersCount}</span>
            )}
          </button>
          <div className="flex rounded-xl overflow-hidden border border-white/8">
            {(['grid', 'table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-4 py-3 transition-colors"
                style={{ background: view === v ? 'rgba(245,158,11,0.15)' : 'transparent', color: view === v ? '#F59E0B' : 'rgba(255,255,255,0.4)' }}>
                {v === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-2xl p-5 border border-white/8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                style={{ background: 'rgba(13,30,53,0.6)', backdropFilter: 'blur(12px)' }}>
                {/* Province */}
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Province</label>
                  <select value={provinceId} onChange={e => setProvinceId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <option value="">All Provinces</option>
                    {filterOptions?.provinces.map(p => (
                      <option key={p.province_id} value={p.province_id}>{p.province_name}</option>
                    ))}
                  </select>
                </div>
                {/* Department */}
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Department</label>
                  <select value={deptId} onChange={e => setDeptId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <option value="">All Departments</option>
                    {filterOptions?.departments.map(d => (
                      <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>
                    ))}
                  </select>
                </div>
                {/* Year */}
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Merit Year</label>
                  <select value={meritYear} onChange={e => setMeritYear(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <option value="">All Years</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {/* Seat Type */}
                <div>
                  <label className="text-xs text-white/40 font-medium mb-1.5 block">Seat Type</label>
                  <select value={seatType} onChange={e => setSeatType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <option value="">All Types</option>
                    {SEAT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {/* Clear */}
                <div className="flex items-end">
                  <button onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <X className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl text-red-300 text-sm flex items-center gap-3"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <X className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Grid View */}
        {view === 'grid' && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <MeritSkeleton key={i} view="grid" />)
                : meritLists.map(item => <MeritCard key={item.list_id} item={item} />)
              }
            </AnimatePresence>
          </motion.div>
        )}

        {/* Table View */}
        {view === 'table' && (
          <div className="rounded-2xl overflow-hidden border border-white/8"
            style={{ background: 'rgba(13,30,53,0.7)', backdropFilter: 'blur(12px)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    {['University', 'Department', 'Year', 'Closing Score', 'Seat Type'].map(h => (
                      <th key={h} className="text-left py-4 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {loading
                      ? Array.from({ length: 8 }).map((_, i) => <MeritSkeleton key={i} view="table" />)
                      : meritLists.map((item, i) => <MeritRow key={item.list_id} item={item} index={i} />)
                    }
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && meritLists.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <BarChart3 className="w-16 h-16 text-white/15 mx-auto mb-4" />
            <p className="text-white/40 text-lg font-medium mb-2">No merit lists found</p>
            <p className="text-white/25 text-sm mb-5">Adjust your search or filters</p>
            <button onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Previous
            </button>
            <span className="text-white/40 text-sm px-2">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30 transition-colors"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
