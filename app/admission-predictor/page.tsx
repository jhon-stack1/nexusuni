"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BrainCircuit, ChevronRight, ChevronLeft, CheckCircle2, BookOpen,
  GraduationCap, Beaker, ChevronDown, TrendingUp, TrendingDown,
  Lightbulb, MapPin, AlertTriangle
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import {
  predictAdmission, getFilterOptions, getFormulas,
  type PredictorPayload, type PredictorResult, type FilterOptions, type UniversityFormula
} from "@/lib/api"

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            animate={{
              background: i < current ? "#10B981" : i === current ? "#F59E0B" : "rgba(255,255,255,0.12)",
              scale: i === current ? 1.15 : 1,
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ color: i < current ? "#fff" : i === current ? "#0B1F3A" : "rgba(255,255,255,0.35)" }}
          >
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </motion.div>
          {i < total - 1 && (
            <div className="w-8 h-px" style={{ background: i < current ? "#10B981" : "rgba(255,255,255,0.12)" }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Marks Input ──────────────────────────────────────────────────────────────
function MarksInput({
  label, obtained, total,
  onObtainedChange, onTotalChange, icon: Icon
}: {
  label: string; obtained: string; total: string
  onObtainedChange: (v: string) => void; onTotalChange: (v: string) => void
  icon: React.ElementType
}) {
  const pct = obtained && total && parseFloat(total) > 0
    ? ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(1) : null
  return (
    <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
          <Icon className="w-4 h-4 text-[#F59E0B]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>{label}</p>
          {pct && <p className="text-xs font-medium" style={{ color: "#F59E0B" }}>{pct}%</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Obtained Marks", val: obtained, onChange: onObtainedChange, placeholder: "e.g. 950" },
          { label: "Total Marks", val: total, onChange: onTotalChange, placeholder: "e.g. 1100" },
        ].map(f => (
          <div key={f.label}>
            <label className="text-xs text-white/40 mb-1.5 block">{f.label}</label>
            <input type="number" value={f.val} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)" }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
              min="0"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Chance Indicator ─────────────────────────────────────────────────────────
function ChanceIndicator({ chance, message }: { chance: "High" | "Moderate" | "Low"; message: string }) {
  const cfg = {
    High: { color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", glow: "0 0 30px rgba(16,185,129,0.2)" },
    Moderate: { color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", glow: "0 0 30px rgba(245,158,11,0.2)" },
    Low: { color: "#EF4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", glow: "0 0 30px rgba(239,68,68,0.2)" },
  }[chance]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-6 text-center"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: cfg.glow }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
        className="text-5xl font-black mb-2"
        style={{ fontFamily: "Poppins, sans-serif", color: cfg.color }}
      >
        {chance === "High" ? "High Chance" : chance === "Moderate" ? "Moderate" : "Low Chance"}
      </motion.div>
      <p className="text-sm leading-relaxed" style={{ color: cfg.color, opacity: 0.8 }}>{message}</p>
    </motion.div>
  )
}

// ─── Trend Chart (mini) ───────────────────────────────────────────────────────
function MiniTrendChart({ data }: { data: Array<{ year: number; closing_merit: number }> }) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.closing_merit))
  const min = Math.min(...data.map(d => d.closing_merit))
  const range = max - min || 1

  return (
    <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
      <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Merit Trend (Last Years)</p>
      <div className="flex items-end gap-2 h-24">
        {data.map((d, i) => {
          const height = ((d.closing_merit - min) / range) * 80 + 10
          const isLast = i === data.length - 1
          return (
            <div key={d.year} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs font-bold" style={{ color: isLast ? "#F59E0B" : "rgba(255,255,255,0.7)" }}>
                {d.closing_merit.toFixed(1)}%
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-lg"
                style={{ background: isLast ? "linear-gradient(to top, #1E3A8A, #F59E0B)" : "rgba(30,58,138,0.6)" }}
              />
              <span className="text-xs text-white/35">{d.year}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Safe Universities ────────────────────────────────────────────────────────
function SafeUniversities({ unis }: { unis: Array<{ name: string; department: string; city: string }> }) {
  if (!unis.length) return null
  return (
    <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
      <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Recommended Safe Universities</p>
      <div className="space-y-2">
        {unis.map((u, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
          >
            <div>
              <p className="text-sm font-semibold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>{u.name}</p>
              <p className="text-xs text-white/45">{u.department}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <MapPin className="w-3 h-3" />
              {u.city}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── AI Insights ──────────────────────────────────────────────────────────────
function AIInsights({ insights }: { insights: string[] }) {
  if (!insights.length) return null
  return (
    <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-4 h-4 text-[#F59E0B]" />
        <p className="text-xs text-white/40 uppercase tracking-widest">AI Insights</p>
      </div>
      <div className="space-y-2.5">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-2.5 text-sm text-white/65 leading-relaxed"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            {insight}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdmissionPredictorPage() {
  const [dark, setDark] = useState(true)
  const [step, setStep] = useState(0)
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [formulas, setFormulas] = useState<UniversityFormula[]>([])
  const [loadingFormulas, setLoadingFormulas] = useState(false)
  const [result, setResult] = useState<PredictorResult | null>(null)
  const [predicting, setPredicting] = useState(false)
  const [predictError, setPredictError] = useState<string | null>(null)

  const [form, setForm] = useState<Partial<PredictorPayload> & {
    matric_obtained_s: string; matric_total_s: string
    inter_obtained_s: string; inter_total_s: string
    olevel_obtained_s: string; olevel_total_s: string
    alevel_obtained_s: string; alevel_total_s: string
    entry_test_marks_s: string
  }>({
    qualification_type: "matric_fsc",
    matric_obtained_s: "", matric_total_s: "",
    inter_obtained_s: "", inter_total_s: "",
    olevel_obtained_s: "", olevel_total_s: "",
    alevel_obtained_s: "", alevel_total_s: "",
    entry_test_marks_s: "",
    university_id: "", department: "",
  })

  useEffect(() => {
    const s = localStorage.getItem("unipath-theme")
    if (s !== null) setDark(s === "dark")
  }, [])
  const toggleDark = () => {
    setDark(prev => { const n = !prev; localStorage.setItem("unipath-theme", n ? "dark" : "light"); return n })
  }

  useEffect(() => { getFilterOptions().then(setFilterOptions).catch(() => {}) }, [])

  useEffect(() => {
    if (!form.university_id) { setFormulas([]); return }
    setLoadingFormulas(true)
    getFormulas(form.university_id).then(setFormulas).catch(() => setFormulas([])).finally(() => setLoadingFormulas(false))
  }, [form.university_id])

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))
  const isMatric = form.qualification_type === "matric_fsc"

  const canGoNext = () => {
    if (step === 0) return !!form.qualification_type
    if (step === 1) {
      if (isMatric) return !!form.matric_obtained_s && !!form.matric_total_s && !!form.inter_obtained_s && !!form.inter_total_s
      return !!form.olevel_obtained_s && !!form.olevel_total_s && !!form.alevel_obtained_s && !!form.alevel_total_s
    }
    if (step === 2) return !!form.university_id && !!form.department
    return true
  }

  const predict = async () => {
    setPredicting(true); setPredictError(null)
    try {
      const payload: PredictorPayload = {
        qualification_type: form.qualification_type!,
        university_id: form.university_id!,
        department: form.department!,
      }
      if (isMatric) {
        payload.matric_obtained = form.matric_obtained_s ? parseFloat(form.matric_obtained_s) : undefined
        payload.matric_total = form.matric_total_s ? parseFloat(form.matric_total_s) : undefined
        payload.inter_obtained = form.inter_obtained_s ? parseFloat(form.inter_obtained_s) : undefined
        payload.inter_total = form.inter_total_s ? parseFloat(form.inter_total_s) : undefined
      } else {
        payload.olevel_obtained = form.olevel_obtained_s ? parseFloat(form.olevel_obtained_s) : undefined
        payload.olevel_total = form.olevel_total_s ? parseFloat(form.olevel_total_s) : undefined
        payload.alevel_obtained = form.alevel_obtained_s ? parseFloat(form.alevel_obtained_s) : undefined
        payload.alevel_total = form.alevel_total_s ? parseFloat(form.alevel_total_s) : undefined
      }
      if (form.entry_test_marks_s) payload.entry_test_marks = parseFloat(form.entry_test_marks_s)

      const res = await predictAdmission(payload)
      setResult(res); setStep(3)
    } catch (e) {
      setPredictError(e instanceof Error ? e.message : "Prediction failed. Please try again.")
    } finally { setPredicting(false) }
  }

  const stepLabels = ["Qualification", "Your Marks", "University & Program", "Prediction"]

  return (
    <div className={dark ? "dark" : ""} style={{ minHeight: "100svh", background: dark ? "#060E1C" : "#F9FAFB" }}>
      <Navbar dark={dark} toggleDark={toggleDark} />

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>
              <BrainCircuit className="w-3 h-3" />
              AI Admission Predictor
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              Predict Your <span className="gold-text">Admission Chance</span>
            </h1>
            <p className="text-white/50 text-base max-w-md mx-auto">
              AI-powered analysis against real merit trends from the Supabase database.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <div className="flex flex-col items-center mb-8 gap-3">
            <StepIndicator current={step} total={4} />
            <p className="text-sm font-medium text-white/60" style={{ fontFamily: "Poppins, sans-serif" }}>
              Step {step + 1}: {stepLabels[step]}
            </p>
          </div>

          {/* Steps */}
          <AnimatePresence mode="wait">

            {/* Step 0: Qualification */}
            {step === 0 && (
              <motion.div key="s0"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Select your qualification system
                </h2>
                {[
                  { value: "matric_fsc", label: "Matric + FSC / Inter", desc: "Pakistan Board Matric and FSC / ICS / I.Com", icon: BookOpen },
                  { value: "olevel_alevel", label: "O Level + A Level", desc: "Cambridge O Level and A Level equivalence", icon: GraduationCap },
                ].map(opt => (
                  <motion.button key={opt.value}
                    onClick={() => set("qualification_type", opt.value)}
                    className="w-full flex items-start gap-4 p-5 rounded-2xl border text-left"
                    style={{
                      background: form.qualification_type === opt.value ? "rgba(245,158,11,0.1)" : "rgba(13,30,53,0.6)",
                      border: form.qualification_type === opt.value ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: form.qualification_type === opt.value ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.07)" }}>
                      <opt.icon className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{opt.label}</p>
                      <p className="text-xs text-white/45 leading-relaxed">{opt.desc}</p>
                    </div>
                    {form.qualification_type === opt.value && <CheckCircle2 className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Step 1: Marks */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Enter your academic marks
                </h2>
                {isMatric ? (
                  <>
                    <MarksInput label="Matric" icon={BookOpen}
                      obtained={form.matric_obtained_s!} total={form.matric_total_s!}
                      onObtainedChange={v => set("matric_obtained_s", v)} onTotalChange={v => set("matric_total_s", v)}
                    />
                    <MarksInput label="FSC / Inter" icon={Beaker}
                      obtained={form.inter_obtained_s!} total={form.inter_total_s!}
                      onObtainedChange={v => set("inter_obtained_s", v)} onTotalChange={v => set("inter_total_s", v)}
                    />
                  </>
                ) : (
                  <>
                    <MarksInput label="O Level" icon={BookOpen}
                      obtained={form.olevel_obtained_s!} total={form.olevel_total_s!}
                      onObtainedChange={v => set("olevel_obtained_s", v)} onTotalChange={v => set("olevel_total_s", v)}
                    />
                    <MarksInput label="A Level" icon={GraduationCap}
                      obtained={form.alevel_obtained_s!} total={form.alevel_total_s!}
                      onObtainedChange={v => set("alevel_obtained_s", v)} onTotalChange={v => set("alevel_total_s", v)}
                    />
                  </>
                )}
                <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
                      <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Entry Test Score</p>
                      <p className="text-xs text-white/40">Optional — leave blank for minimum score guidance</p>
                    </div>
                  </div>
                  <input type="number" value={form.entry_test_marks_s} onChange={e => set("entry_test_marks_s", e.target.value)}
                    placeholder="e.g. 87 (out of 100)"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)" }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
                    min="0" max="100"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: University */}
            {step === 2 && (
              <motion.div key="s2"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Select target university and program
                </h2>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">University</label>
                  <div className="relative">
                    <select value={form.university_id} onChange={e => { set("university_id", e.target.value); set("department", "") }}
                      className="w-full appearance-none px-4 pr-10 py-4 rounded-2xl text-sm text-white outline-none cursor-pointer"
                      style={{ background: "rgba(13,30,53,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <option value="">Select a university...</option>
                      {(filterOptions?.universities ?? []).map(u => (
                        <option key={u.id} value={u.id} style={{ background: "#0D1E35" }}>{u.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Department / Program</label>
                  <div className="relative">
                    <select value={form.department} onChange={e => set("department", e.target.value)}
                      disabled={!form.university_id || loadingFormulas}
                      className="w-full appearance-none px-4 pr-10 py-4 rounded-2xl text-sm text-white outline-none cursor-pointer disabled:opacity-50"
                      style={{ background: "rgba(13,30,53,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <option value="">{loadingFormulas ? "Loading..." : "Select a department..."}</option>
                      {formulas.map(f => (
                        <option key={f.id} value={f.department} style={{ background: "#0D1E35" }}>{f.department}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 3 && result && (
              <motion.div key="s3"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="space-y-5"
              >
                {/* Aggregate */}
                <div className="rounded-2xl p-5 flex items-center gap-5 border border-white/8"
                  style={{ background: "rgba(13,30,53,0.7)" }}>
                  <div className="text-center">
                    <p className="text-4xl font-black" style={{ fontFamily: "Poppins, sans-serif", color: "#F59E0B" }}>
                      {result.aggregate.toFixed(2)}
                      <span className="text-xl text-white/50">%</span>
                    </p>
                    <p className="text-xs text-white/40 mt-1">Your Aggregate</p>
                  </div>
                  <div className="h-12 w-px bg-white/10" />
                  <div className="flex-1">
                    {result.closing_merit_last_year !== null && (
                      <div className="flex items-center gap-2 mb-1.5">
                        {result.aggregate >= result.closing_merit_last_year
                          ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                          : <TrendingDown className="w-4 h-4 text-red-400" />
                        }
                        <span className="text-sm text-white/70">
                          Last year closing: <span className="font-bold text-white">{result.closing_merit_last_year.toFixed(1)}%</span>
                        </span>
                      </div>
                    )}
                    {result.minimum_entry_test_required !== null && !form.entry_test_marks_s && (
                      <p className="text-xs text-[#F59E0B]">
                        Minimum entry test needed: {result.minimum_entry_test_required.toFixed(0)}/100
                      </p>
                    )}
                  </div>
                </div>

                {/* Chance */}
                <ChanceIndicator chance={result.chance} message={result.chance_message} />

                {/* Trend Chart */}
                {result.trend_data?.length > 0 && <MiniTrendChart data={result.trend_data} />}

                {/* Safe Universities */}
                {result.safe_universities?.length > 0 && <SafeUniversities unis={result.safe_universities} />}

                {/* Insights */}
                {result.insights?.length > 0 && <AIInsights insights={result.insights} />}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <motion.button onClick={() => { setStep(0); setResult(null) }}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    New Prediction
                  </motion.button>
                  <motion.a href="/merit-list"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0B1F3A" }}
                    whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }} whileTap={{ scale: 0.98 }}>
                    View Merit Lists <ChevronRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {predictError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl p-4 flex items-start gap-3"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{predictError}</p>
            </motion.div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div className="flex items-center gap-3 mt-8">
              {step > 0 && (
                <motion.button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium text-white"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </motion.button>
              )}
              <motion.button
                onClick={step === 2 ? predict : () => setStep(s => s + 1)}
                disabled={!canGoNext() || predicting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0B1F3A" }}
                whileHover={canGoNext() ? { scale: 1.02, boxShadow: "0 6px 20px rgba(245,158,11,0.35)" } : {}}
                whileTap={canGoNext() ? { scale: 0.98 } : {}}
              >
                {predicting
                  ? <div className="w-4 h-4 rounded-full border-2 border-[#0B1F3A]/40 border-t-[#0B1F3A] animate-spin" />
                  : <>{step === 2 ? "Predict Admission" : "Continue"} <ChevronRight className="w-4 h-4" /></>
                }
              </motion.button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
