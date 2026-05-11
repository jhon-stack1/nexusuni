"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, SlidersHorizontal, X, MapPin, Calendar, ExternalLink,
  BookmarkPlus, BookmarkCheck, ChevronDown, GraduationCap,
  Building2, CheckCircle2, Clock, AlertCircle
} from "lucide-react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import {
  getUniversities, getFilterOptions,
  type University, type FilterOptions
} from "@/lib/api"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCity(u: University) {
  return (u.locations as any)?.city_name ?? ''
}
function getProvince(u: University) {
  return (u.locations as any)?.provinces?.province_name ?? ''
}
function allowsNonMath(u: University) {
  return (u.university_departments as any[])?.some((ud: any) => ud.allows_non_math_students)
}
function getDepts(u: University): string[] {
  return (u.university_departments as any[])
    ?.map((ud: any) => ud.departments?.dept_name)
    .filter(Boolean) ?? []
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function UniversitySkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
      <div className="shimmer h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="shimmer h-5 w-3/4 rounded-lg" />
        <div className="shimmer h-4 w-1/2 rounded-lg" />
        <div className="flex gap-2 mt-4">
          <div className="shimmer h-7 w-20 rounded-full" />
          <div className="shimmer h-7 w-24 rounded-full" />
        </div>
        <div className="shimmer h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}

// ─── Sector Badge ─────────────────────────────────────────────────────────────
function SectorBadge({ type }: { type: string }) {
  const isPublic = type === "Public"
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: isPublic ? "rgba(30,58,138,0.9)" : "rgba(124,58,237,0.9)",
        color: "#fff",
        backdropFilter: "blur(8px)",
      }}
    >
      {type}
    </span>
  )
}

// ─── University Card ──────────────────────────────────────────────────────────
function UniversityCard({ uni, saved, onSave }: {
  uni: University
  saved: boolean
  onSave: (id: number) => void
}) {
  const city     = getCity(uni)
  const province = getProvince(uni)
  const depts    = getDepts(uni).slice(0, 3)
  const noMath   = allowsNonMath(uni)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(11,31,58,0.5)" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl overflow-hidden border border-white/8 flex flex-col"
      style={{ background: "rgba(13,30,53,0.7)", backdropFilter: "blur(12px)" }}
    >
      {/* Image / Logo area */}
      <div className="relative h-48 overflow-hidden bg-navy/40">
        {uni.logo_url ? (
          <Image
            src={uni.logo_url}
            alt={uni.uni_name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0B1F3A, #1E3A8A)" }}>
            <GraduationCap className="w-16 h-16 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1E35] via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <SectorBadge type={uni.uni_type} />
          {noMath && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/80 text-white">
              No Math
            </span>
          )}
        </div>

        {/* Save button */}
        <motion.button
          onClick={() => onSave(uni.uni_id)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: saved ? "rgba(245,158,11,0.9)" : "rgba(11,31,58,0.7)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {saved
            ? <BookmarkCheck className="w-4 h-4 text-[#0B1F3A]" />
            : <BookmarkPlus className="w-4 h-4 text-white/70" />}
        </motion.button>

        {/* Year */}
        {uni.established_year && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(245,158,11,0.9)", color: "#0B1F3A" }}>
            Est. {uni.established_year}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-white leading-tight mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          {uni.uni_name}
        </h3>

        {(city || province) && (
          <div className="flex items-center gap-1.5 text-white/50 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {[city, province].filter(Boolean).join(", ")}
          </div>
        )}

        {/* Department chips */}
        {depts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {depts.map(d => (
              <span key={d} className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>
                {d}
              </span>
            ))}
          </div>
        )}

        {uni.description && (
          <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-4">
            {uni.description}
          </p>
        )}

        <div className="mt-auto flex gap-2">
          {uni.website && (
            <motion.a
              href={uni.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0B1F3A" }}
              whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}
              whileTap={{ scale: 0.98 }}
            >
              Visit Website <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{
        background: active ? "#F59E0B" : "rgba(255,255,255,0.07)",
        color: active ? "#0B1F3A" : "rgba(255,255,255,0.65)",
        border: active ? "1px solid #F59E0B" : "1px solid rgba(255,255,255,0.1)",
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdmissionsPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [saved, setSaved]               = useState<Set<number>>(new Set())
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [total, setTotal]               = useState(0)

  const [search, setSearch]       = useState("")
  const [provinceId, setProvinceId] = useState("")
  const [uniType, setUniType]     = useState("")
  const [deptId, setDeptId]       = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getFilterOptions().then(setFilterOptions).catch(() => {})
  }, [])

  const loadUniversities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getUniversities({
        search,
        province_id: provinceId || undefined,
        uni_type:    uniType    || undefined,
        dept_id:     deptId     || undefined,
        limit: 100,
      })
      setUniversities(res.data)
      setTotal(res.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load universities")
    } finally {
      setLoading(false)
    }
  }, [search, provinceId, uniType, deptId])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(loadUniversities, search ? 400 : 0)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [loadUniversities, search])

  const toggleSave = (id: number) => {
    setSaved(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }
  const clearFilters = () => {
    setSearch(""); setProvinceId(""); setUniType(""); setDeptId("")
  }
  const hasFilters = search || provinceId || uniType || deptId

  return (
    <div style={{ minHeight: "100svh", background: "#060E1C" }}>
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>
              <Building2 className="w-3 h-3" />
              University Explorer
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              Find Your <span style={{ color: "#F59E0B" }}>Dream University</span>
            </h1>
            <p className="text-white/55 text-base max-w-xl">
              Browse all universities, filter by province, type, department and more.
            </p>
          </motion.div>

          {/* Search + Filter Bar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#F59E0B] transition-colors" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search universities..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-white placeholder:text-white/35 outline-none transition-all"
                style={{ background: "rgba(13,30,53,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <motion.button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-white"
              style={{
                background: filtersOpen ? "rgba(245,158,11,0.2)" : "rgba(13,30,53,0.8)",
                border: filtersOpen ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.1)",
              }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />}
            </motion.button>
          </motion.div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden mb-6"
              >
                <div className="rounded-2xl p-5 space-y-4"
                  style={{ background: "rgba(13,30,53,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>

                  {filterOptions?.provinces && filterOptions.provinces.length > 0 && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-2.5">Province</p>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.provinces.map(p => (
                          <FilterChip
                            key={p.province_id}
                            label={p.province_name}
                            active={provinceId === String(p.province_id)}
                            onClick={() => setProvinceId(provinceId === String(p.province_id) ? "" : String(p.province_id))}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2.5">University Type</p>
                    <div className="flex flex-wrap gap-2">
                      {(filterOptions?.uni_types ?? ["Public", "Private"]).map(t => (
                        <FilterChip key={t} label={t} active={uniType === t} onClick={() => setUniType(uniType === t ? "" : t)} />
                      ))}
                    </div>
                  </div>

                  {filterOptions?.departments && filterOptions.departments.length > 0 && (
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-2.5">Department</p>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.departments.slice(0, 12).map(d => (
                          <FilterChip
                            key={d.dept_id}
                            label={d.dept_name}
                            active={deptId === String(d.dept_id)}
                            onClick={() => setDeptId(deptId === String(d.dept_id) ? "" : String(d.dept_id))}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {hasFilters && (
                    <div className="pt-2 flex justify-end">
                      <button onClick={clearFilters} className="text-xs text-[#F59E0B] hover:text-[#FCD34D] transition-colors">
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Count */}
          {!loading && (
            <p className="text-white/40 text-sm mb-5">
              {universities.length === 0
                ? "No universities found"
                : `Showing ${universities.length} of ${total} universities`}
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl p-6 mb-6 text-center"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-red-400 font-medium mb-1">Failed to load universities</p>
              <p className="text-red-400/60 text-sm mb-3">{error}</p>
              <button onClick={loadUniversities}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }}>
                Try again
              </button>
            </div>
          )}

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <UniversitySkeleton key={i} />)
                : universities.map(uni => (
                    <UniversityCard
                      key={uni.uni_id}
                      uni={uni}
                      saved={saved.has(uni.uni_id)}
                      onSave={toggleSave}
                    />
                  ))
              }
            </AnimatePresence>
          </motion.div>

          {!loading && universities.length === 0 && !error && (
            <div className="text-center py-24">
              <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium">No universities found</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-3 text-sm text-[#F59E0B] hover:text-[#FCD34D]">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
