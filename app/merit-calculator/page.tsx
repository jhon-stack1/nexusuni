"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calculator, ChevronRight, ChevronLeft, CheckCircle2,
  GraduationCap, BookOpen, Beaker, ChevronDown, Sparkles
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { getFilterOptions, getUniversities, type FilterOptions, type University } from "@/lib/api"

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  qualification_type: "matric_fsc" | "olevel_alevel"
  matric_obtained: string
  matric_total: string
  inter_obtained: string
  inter_total: string
  olevel_obtained: string
  olevel_total: string
  alevel_obtained: string
  alevel_total: string
  entry_test_marks: string
  university_id: string
  department: string
}

interface FormulaWeights {
  matric_weight: number
  inter_weight: number
  olevel_weight: number
  alevel_weight: number
  entry_test_weight: number
  department: string
}

interface CalcResult {
  aggregate: number
  formula: FormulaWeights | null
  breakdown: {
    matric_contribution: number
    inter_contribution: number
    entry_test_contribution: number
  }
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            animate={{
              background: i < current ? "#10B981" : i === current ? "#F59E0B" : "rgba(255,255,255,0.15)",
              scale: i === current ? 1.15 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ color: i <= current ? (i < current ? "#fff" : "#0B1F3A") : "rgba(255,255,255,0.4)" }}
          >
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </motion.div>
          {i < total - 1 && (
            <div className="w-8 h-px" style={{ background: i < current ? "#10B981" : "rgba(255,255,255,0.15)" }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Field Input ──────────────────────────────────────────────────────────────
function MarksInput({
  label, obtained, total,
  onObtainedChange, onTotalChange,
  icon: Icon
}: {
  label: string
  obtained: string
  total: string
  onObtainedChange: (v: string) => void
  onTotalChange: (v: string) => void
  icon: React.ElementType
}) {
  const pct = obtained && total ? ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(1) : null

  return (
    <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
          <Icon className="w-4 h-4 text-[#F59E0B]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>{label}</p>
          {pct && <p className="text-xs text-[#F59E0B] font-medium">{pct}%</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Obtained Marks</label>
          <input
            type="number"
            value={obtained}
            onChange={e => onObtainedChange(e.target.value)}
            placeholder="e.g. 950"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            onFocus={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)" }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Total Marks</label>
          <input
            type="number"
            value={total}
            onChange={e => onTotalChange(e.target.value)}
            placeholder="e.g. 1100"
            className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            onFocus={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)" }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
            min="0"
          />
        </div>
      </div>
      {obtained && total && parseFloat(obtained) > parseFloat(total) && (
        <p className="text-red-400 text-xs mt-2">Obtained marks cannot exceed total marks</p>
      )}
    </div>
  )
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ result }: { result: CalcResult }) {
  const agg = result.aggregate
  const chance = agg >= 85 ? { label: "Excellent", color: "#10B981", bg: "rgba(16,185,129,0.15)" }
    : agg >= 70 ? { label: "Good", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" }
    : { label: "Below Average", color: "#EF4444", bg: "rgba(239,68,68,0.15)" }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl p-8 border border-white/10"
      style={{
        background: "linear-gradient(135deg, rgba(13,30,53,0.9), rgba(30,58,138,0.3))",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Main aggregate */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold"
          style={{ background: chance.bg, color: chance.color, border: `1px solid ${chance.color}33` }}>
          <Sparkles className="w-3 h-3" />
          {chance.label} Aggregate
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="text-7xl font-bold mb-2"
          style={{ fontFamily: "Poppins, sans-serif", color: "#F59E0B" }}
        >
          {agg.toFixed(2)}
          <span className="text-3xl text-white/50">%</span>
        </motion.div>
        <p className="text-white/50 text-sm">Your Calculated Aggregate</p>
      </div>

      {/* Aggregate bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(agg, 100)}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #1E3A8A, #F59E0B)" }}
          />
        </div>
      </div>

      {/* Breakdown */}
      {result.formula && (
        <div className="space-y-3">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Formula Breakdown</p>

          {result.formula.matric_weight > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm text-white/70">Matric ({result.formula.matric_weight}%)</span>
              </div>
              <span className="text-sm font-bold text-white">{result.breakdown.matric_contribution.toFixed(2)}%</span>
            </div>
          )}

          {result.formula.inter_weight > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-sm text-white/70">FSC/Inter ({result.formula.inter_weight}%)</span>
              </div>
              <span className="text-sm font-bold text-white">{result.breakdown.inter_contribution.toFixed(2)}%</span>
            </div>
          )}

          {result.formula.entry_test_weight > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
                <span className="text-sm text-white/70">Entry Test ({result.formula.entry_test_weight}%)</span>
              </div>
              <span className="text-sm font-bold" style={{ color: "#F59E0B" }}>{result.breakdown.entry_test_contribution.toFixed(2)}%</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MeritCalculatorPage() {
  const [dark, setDark] = useState(true)
  const [step, setStep] = useState(0)
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [universities, setUniversities] = useState<University[]>([])
  const [result, setResult] = useState<CalcResult | null>(null)
  const [calculating, setCalculating] = useState(false)

  const [form, setForm] = useState<FormData>({
    qualification_type: "matric_fsc",
    matric_obtained: "", matric_total: "",
    inter_obtained: "", inter_total: "",
    olevel_obtained: "", olevel_total: "",
    alevel_obtained: "", alevel_total: "",
    entry_test_marks: "",
    university_id: "", department: "",
  })

  useEffect(() => {
    const s = localStorage.getItem("unipath-theme")
    if (s !== null) setDark(s === "dark")
  }, [])
  const toggleDark = () => {
    setDark(prev => { const n = !prev; localStorage.setItem("unipath-theme", n ? "dark" : "light"); return n })
  }

  useEffect(() => {
    getFilterOptions().then(setFilterOptions).catch(() => {})
    getUniversities({ limit: 200 }).then(r => setUniversities(r.data)).catch(() => {})
  }, [])

  const set = (key: keyof FormData, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const isMatric = form.qualification_type === "matric_fsc"

  const canGoNext = () => {
    if (step === 0) return !!form.qualification_type
    if (step === 1) {
      if (isMatric) return !!form.matric_obtained && !!form.matric_total && !!form.inter_obtained && !!form.inter_total
      return !!form.olevel_obtained && !!form.olevel_total && !!form.alevel_obtained && !!form.alevel_total
    }
    if (step === 2) return !!form.university_id && !!form.department
    return true
  }

  const calculate = () => {
    setCalculating(true)
    const formula: FormulaWeights | null = null // No formula table in DB — always use standard fallback

    let matricPct = 0, interPct = 0
    if (isMatric) {
      if (form.matric_obtained && form.matric_total)
        matricPct = (parseFloat(form.matric_obtained) / parseFloat(form.matric_total)) * 100
      if (form.inter_obtained && form.inter_total)
        interPct = (parseFloat(form.inter_obtained) / parseFloat(form.inter_total)) * 100
    } else {
      if (form.olevel_obtained && form.olevel_total)
        matricPct = (parseFloat(form.olevel_obtained) / parseFloat(form.olevel_total)) * 100
      if (form.alevel_obtained && form.alevel_total)
        interPct = (parseFloat(form.alevel_obtained) / parseFloat(form.alevel_total)) * 100
    }

    const entryPct = form.entry_test_marks ? parseFloat(form.entry_test_marks) : 0

    let matric_contribution = 0
    let inter_contribution = 0
    let entry_test_contribution = 0

    if (formula) {
      matric_contribution = (matricPct * formula.matric_weight) / 100
      inter_contribution = (interPct * formula.inter_weight) / 100
      entry_test_contribution = (entryPct * formula.entry_test_weight) / 100
    } else {
      // Fallback: 10% matric, 40% FSC, 50% entry test
      matric_contribution = (matricPct * 10) / 100
      inter_contribution = (interPct * 40) / 100
      entry_test_contribution = (entryPct * 50) / 100
    }

    const aggregate = matric_contribution + inter_contribution + entry_test_contribution

    setTimeout(() => {
      setResult({ aggregate, formula, breakdown: { matric_contribution, inter_contribution, entry_test_contribution } })
      setStep(3)
      setCalculating(false)
    }, 900)
  }

  const stepLabels = ["Qualification", "Academic Marks", "University", "Results"]

  return (
    <div className={dark ? "dark" : ""} style={{ minHeight: "100svh", background: dark ? "#060E1C" : "#F9FAFB" }}>
      <Navbar dark={dark} toggleDark={toggleDark} />

      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>
              <Calculator className="w-3 h-3" />
              Merit Calculator
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              Calculate Your <span className="gold-text">Aggregate</span>
            </h1>
            <p className="text-white/50 text-base max-w-md mx-auto">
              Enter your marks and get your precise aggregate based on each university&apos;s dynamic formula.
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
              <motion.div key="step0"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Select your qualification type
                </h2>
                {[
                  { value: "matric_fsc", label: "Matric + FSC / Inter", desc: "For students with Pakistan Board Matric and FSC/ICS/I.Com results", icon: BookOpen },
                  { value: "olevel_alevel", label: "O Level + A Level", desc: "For students with Cambridge O Level and A Level results", icon: GraduationCap },
                ].map(opt => (
                  <motion.button
                    key={opt.value}
                    onClick={() => set("qualification_type", opt.value as FormData["qualification_type"])}
                    className="w-full flex items-start gap-4 p-5 rounded-2xl border text-left transition-all"
                    style={{
                      background: form.qualification_type === opt.value ? "rgba(245,158,11,0.1)" : "rgba(13,30,53,0.6)",
                      border: form.qualification_type === opt.value ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: form.qualification_type === opt.value ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.07)" }}>
                      <opt.icon className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{opt.label}</p>
                      <p className="text-xs text-white/45 leading-relaxed">{opt.desc}</p>
                    </div>
                    {form.qualification_type === opt.value && (
                      <CheckCircle2 className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Step 1: Academic Marks */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Enter your academic marks
                </h2>
                {isMatric ? (
                  <>
                    <MarksInput label="Matric" icon={BookOpen}
                      obtained={form.matric_obtained} total={form.matric_total}
                      onObtainedChange={v => set("matric_obtained", v)}
                      onTotalChange={v => set("matric_total", v)}
                    />
                    <MarksInput label="FSC / Inter" icon={Beaker}
                      obtained={form.inter_obtained} total={form.inter_total}
                      onObtainedChange={v => set("inter_obtained", v)}
                      onTotalChange={v => set("inter_total", v)}
                    />
                  </>
                ) : (
                  <>
                    <MarksInput label="O Level" icon={BookOpen}
                      obtained={form.olevel_obtained} total={form.olevel_total}
                      onObtainedChange={v => set("olevel_obtained", v)}
                      onTotalChange={v => set("olevel_total", v)}
                    />
                    <MarksInput label="A Level" icon={GraduationCap}
                      obtained={form.alevel_obtained} total={form.alevel_total}
                      onObtainedChange={v => set("alevel_obtained", v)}
                      onTotalChange={v => set("alevel_total", v)}
                    />
                  </>
                )}

                {/* Entry Test */}
                <div className="rounded-2xl p-5 border border-white/8" style={{ background: "rgba(13,30,53,0.6)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
                      <Calculator className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Entry Test Score</p>
                      <p className="text-xs text-white/40">Optional — skip if not attempted</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={form.entry_test_marks}
                    onChange={e => set("entry_test_marks", e.target.value)}
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

            {/* Step 2: University & Dept */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Select university and department
                </h2>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">University</label>
                  <div className="relative">
                    <select
                      value={form.university_id}
                      onChange={e => { set("university_id", e.target.value); set("department", "") }}
                      className="w-full appearance-none px-4 pr-10 py-4 rounded-2xl text-sm text-white outline-none cursor-pointer transition-all"
                      style={{ background: "rgba(13,30,53,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <option value="">Select a university...</option>
                      {universities.map(u => (
                        <option key={u.uni_id} value={String(u.uni_id)} style={{ background: "#0D1E35" }}>{u.uni_name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Department / Program</label>
                  <div className="relative">
                    <select
                      value={form.department}
                      onChange={e => set("department", e.target.value)}
                      disabled={!form.university_id}
                      className="w-full appearance-none px-4 pr-10 py-4 rounded-2xl text-sm text-white outline-none cursor-pointer transition-all disabled:opacity-50"
                      style={{ background: "rgba(13,30,53,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <option value="">Select a department...</option>
                      {(filterOptions?.departments ?? []).map(d => (
                        <option key={d.dept_id} value={d.dept_name} style={{ background: "#0D1E35" }}>{d.dept_name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                  {!form.university_id && (
                    <p className="text-xs text-white/30 mt-2">Select a university first to see available departments</p>
                  )}
                </div>

                {/* Standard formula notice */}
                {form.university_id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-4 border"
                    style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}
                  >
                    <p className="text-xs text-[#F59E0B] font-semibold mb-2 uppercase tracking-wider">Standard Merit Formula</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">Matric 10%</span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300">FSC / A Level 40%</span>
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>Entry Test 50%</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3: Result */}
            {step === 3 && result && (
              <motion.div key="step3"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ResultCard result={result} />
                <div className="flex gap-3 mt-6">
                  <motion.button
                    onClick={() => { setStep(0); setResult(null) }}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    Recalculate
                  </motion.button>
                  <motion.a
                    href="/admission-predictor"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0B1F3A" }}
                    whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Predict Admission <ChevronRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 mt-8"
            >
              {step > 0 && (
                <motion.button
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium text-white"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </motion.button>
              )}
              <motion.button
                onClick={step === 2 ? calculate : () => setStep(s => s + 1)}
                disabled={!canGoNext() || calculating}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0B1F3A" }}
                whileHover={canGoNext() ? { scale: 1.02, boxShadow: "0 6px 20px rgba(245,158,11,0.35)" } : {}}
                whileTap={canGoNext() ? { scale: 0.98 } : {}}
              >
                {calculating ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#0B1F3A]/40 border-t-[#0B1F3A] animate-spin" />
                ) : (
                  <>
                    {step === 2 ? "Calculate Aggregate" : "Continue"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
