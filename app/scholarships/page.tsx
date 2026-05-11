"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, SlidersHorizontal, X, MapPin, Calendar, ExternalLink,
  BookmarkPlus, BookmarkCheck, Award, CheckCircle2, Clock,
  AlertCircle, Trophy
} from "lucide-react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import {
  getScholarships, getFilterOptions,
  type Scholarship, type FilterOptions
} from "@/lib/api"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getProvinceName(s: Scholarship) {
  return (s.provinces as any)?.province_name ?? ''
}
function getUniversityNames(s: Scholarship): string[] {
  return (s.scholarship_availability as any[])
    ?.map((sa: any) => sa.university?.uni_name)
    .filter(Boolean) ?? []
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ScholarshipSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
      <div className="shimmer h-44 w-full" />
      <div className="p-5 space-y-3">
        <div className="shimmer h-5 w-3/4 rounded-lg" />
        <div className="shimmer h-4 w-1/2 rounded-lg" />
        <div className="flex gap-2 mt-3">
          <div className="shimmer h-6 w-24 rounded-full" />
          <div className="shimmer h-6 w-20 rounded-full" />
        </div>
        <div className="shimmer h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ is_open }: { is_open: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: is_open ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        color: is_open ? "#10B981" : "#EF4444",
      }}
    >
      {is_open
        ? <><CheckCircle2 className="w-3 h-3" />Open</>
        : <><AlertCircle className="w-3 h-3" />Closed</>}
    </span>
  )
}

// ─── Scholarship Card ─────────────────────────────────────────────────────────
function ScholarshipCard({ sc, saved, onSave }: {
  sc: Scholarship
  saved: boolean
  onSave: (id: number) => void
}) {
  const deadline    = sc.deadline ? new Date(sc.deadline) : null
  const daysLeft    = deadline ? Math.ceil((deadline.getTime() - Date.now()) / 86_400_000) : null
  const province    = getProvinceName(sc)
  const universities = getUniversityNames(sc)

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
      {/* Header area */}
      <div className="relative h-44 overflow-hidden">
        {(sc.scholarship_availability as any)?.[0]?.university?.logo_url ? (
          <Image
            src={(sc.scholarship_availability as any)[0].university.logo_url}
            alt={sc.title}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0B1F3A, #1E3A8A)" }}>
            <Award className="w-14 h-14 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1E35] via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <StatusBadge is_open={sc.is_open} />
        </div>

        {/* Save */}
        <motion.button
          onClick={() => onSave(sc.scholarship_id)}
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

        {/* Amount */}
        {sc.amount_pkr && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/90 text-[#0B1F3A]">
              PKR {Number(sc.amount_pkr).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-sm font-bold text-white leading-snug mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>
          {sc.title}
        </h3>

        {/* University names */}
        {universities.length > 0 && (
          <p className="text-white/50 text-xs mb-2 line-clamp-1">{universities.join(", ")}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-white/45 mb-3">
          {province && (
            <>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {province}
            </>
          )}
          {daysLeft !== null && daysLeft > 0 && (
            <>
              <span className="text-white/20">·</span>
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className={daysLeft <= 7 ? "text-red-400 font-semibold" : ""}>{daysLeft}d left</span>
            </>
          )}
          {deadline && daysLeft !== null && daysLeft <= 0 && (
            <>
              <span className="text-white/20">·</span>
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="text-red-400/70">Expired</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(59,130,246,0.2)", color: "#60A5FA" }}>
            {sc.scholarship_type}
          </span>
          {sc.deadline && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>
              Due: {new Date(sc.deadline).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          )}
        </div>

        {sc.eligible_criteria && (
          <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">{sc.eligible_criteria}</p>
        )}

        <div className="mt-auto">
          {sc.apply_link ? (
            <motion.a
              href={sc.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0B1F3A" }}
              whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}
              whileTap={{ scale: 0.98 }}
            >
              Apply Now <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          ) : (
            <div className="w-full py-2.5 rounded-xl text-sm font-medium text-center text-white/30"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
              No apply link available
            </div>
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
export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [saved, setSaved]               = useState<Set<number>>(new Set())
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [total, setTotal]               = useState(0)

  const [search, setSearch]               = useState("")
  const [provinceId, setProvinceId]       = useState("")
  const [scholarshipType, setScholarshipType] = useState("")
  const [isOpen, setIsOpen]               = useState<boolean | undefined>(undefined)
  const [filtersOpen, setFiltersOpen]     = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getFilterOptions().then(setFilterOptions).catch(() => {})
  }, [])

  const loadScholarships = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getScholarships({
        search,
        province_id:      provinceId || undefined,
        scholarship_type: scholarshipType || undefined,
        is_open:          isOpen,
        limit: 100,
      })
      setScholarships(res.data)
      setTotal(res.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load scholarships")
    } finally {
      setLoading(false)
    }
  }, [search, provinceId, scholarshipType, isOpen])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(loadScholarships, search ? 400 : 0)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [loadScholarships, search])

  const toggleSave = (id: number) => {
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const clearFilters = () => {
    setSearch(""); setProvinceId(""); setScholarshipType(""); setIsOpen(undefined)
  }
  const hasFilters = search || provinceId || scholarshipType || isOpen !== undefined

  return (
    <div style={{ minHeight: "100svh", background: "#060E1C" }}>
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>
              <Trophy className="w-3 h-3" />
              Scholarship Explorer
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              Discover <span style={{ color: "#F59E0B" }}>Scholarships</span>
            </h1>
            <p className="text-white/55 text-base max-w-xl">
              Find merit, need-based, government and university scholarships tailored to your profile.
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
                placeholder="Search scholarships..."
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
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2.5">Scholarship Type</p>
                    <div className="flex flex-wrap gap-2">
                      {(filterOptions?.scholarship_types ?? ["Merit-Based", "Need-Based", "Government", "Private", "International"]).map(t => (
                        <FilterChip key={t} label={t} active={scholarshipType === t} onClick={() => setScholarshipType(scholarshipType === t ? "" : t)} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-2.5">Status</p>
                    <div className="flex flex-wrap gap-2">
                      <FilterChip label="Open" active={isOpen === true} onClick={() => setIsOpen(isOpen === true ? undefined : true)} />
                      <FilterChip label="Closed" active={isOpen === false} onClick={() => setIsOpen(isOpen === false ? undefined : false)} />
                    </div>
                  </div>

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
              {scholarships.length === 0
                ? "No scholarships found"
                : `Showing ${scholarships.length} of ${total} scholarships`}
            </p>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl p-6 mb-6 text-center"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-red-400 font-medium mb-1">Failed to load scholarships</p>
              <p className="text-red-400/60 text-sm mb-3">{error}</p>
              <button onClick={loadScholarships}
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
                ? Array.from({ length: 8 }).map((_, i) => <ScholarshipSkeleton key={i} />)
                : scholarships.map(sc => (
                    <ScholarshipCard
                      key={sc.scholarship_id}
                      sc={sc}
                      saved={saved.has(sc.scholarship_id)}
                      onSave={toggleSave}
                    />
                  ))
              }
            </AnimatePresence>
          </motion.div>

          {!loading && scholarships.length === 0 && !error && (
            <div className="text-center py-24">
              <Award className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium">No scholarships found</p>
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
