"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap, BookOpen, Brain, TrendingUp, Trophy, Map, ClipboardList,
  Sparkles, ChevronRight, Check, ArrowRight, Loader2
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { PrepAcceptedUniversities } from "@/components/prep/accepted-universities"
import { PrepImportantChapters } from "@/components/prep/important-chapters"
import { PrepWeaknessAnalysis } from "@/components/prep/weakness-analysis"
import { PrepProgressTracker } from "@/components/prep/progress-tracker"
import { PrepLeaderboard } from "@/components/prep/leaderboard"
import { PrepMockTests } from "@/components/prep/mock-tests"
import { PrepAIRecommendations } from "@/components/prep/ai-recommendations"
import { PrepStudyRoadmap } from "@/components/prep/study-roadmap"

const ENTRY_TESTS = ["NET", "ECAT", "MDCAT", "FAST Entry Test", "NTS", "GIKI Test", "UET", "AKU"]
const STREAMS = ["Pre-Engineering", "Pre-Medical", "ICS", "Commerce", "Arts", "FSc General"]
const TARGET_UNIS = ["NUST", "LUMS", "FAST-NU", "COMSATS", "UET", "PIEAS", "GIKI", "Aga Khan University"]

const NAV_TABS = [
  { id: "universities", label: "Accepted Universities", icon: GraduationCap },
  { id: "chapters",     label: "Important Chapters",    icon: BookOpen },
  { id: "weakness",     label: "Weakness Analysis",     icon: Brain },
  { id: "progress",     label: "Progress Tracker",      icon: TrendingUp },
  { id: "leaderboard",  label: "Leaderboard",           icon: Trophy },
  { id: "roadmap",      label: "Study Roadmap",         icon: Map },
  { id: "mock",         label: "Mock Tests",            icon: ClipboardList },
  { id: "ai",           label: "AI Recommendations",   icon: Sparkles },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

export default function EntryTestPage() {
  const [dark, setDark] = useState(true)
  const [profile, setProfile] = useState<{ tests: string[]; stream: string; universities: string[] } | null>(null)
  const [activeTab, setActiveTab] = useState("universities")

  // Onboarding state
  const [step, setStep] = useState(1)
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [selectedStream, setSelectedStream] = useState("")
  const [selectedUnis, setSelectedUnis] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("unipath-theme")
    if (stored) setDark(stored === "dark")
    const savedProfile = localStorage.getItem("unipath-prep-profile")
    if (savedProfile) setProfile(JSON.parse(savedProfile))
  }, [])

  const toggleDark = () => setDark(prev => {
    const next = !prev
    localStorage.setItem("unipath-theme", next ? "dark" : "light")
    return next
  })

  const toggleTest = (t: string) =>
    setSelectedTests(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const toggleUni = (u: string) =>
    setSelectedUnis(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u])

  const handleSaveProfile = async () => {
    if (!selectedTests.length || !selectedStream) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    const p = { tests: selectedTests, stream: selectedStream, universities: selectedUnis }
    localStorage.setItem("unipath-prep-profile", JSON.stringify(p))
    setProfile(p)
    setSaving(false)
  }

  const bg = dark ? "#060E1C" : "#F9FAFB"

  return (
    <div className={dark ? "dark" : ""} style={{ minHeight: "100svh", background: bg }}>
      <Navbar dark={dark} toggleDark={toggleDark} />

      <AnimatePresence mode="wait">
        {!profile ? (
          /* ─── ONBOARDING ─── */
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-4 py-24"
          >
            <div className="w-full max-w-2xl">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: step === s ? 1.15 : 1 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300"
                      style={{
                        background: step >= s ? "linear-gradient(135deg,#F59E0B,#D97706)" : "var(--muted)",
                        color: step >= s ? "#0B1F3A" : "var(--muted-foreground)",
                      }}
                    >
                      {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                    </motion.div>
                    {s < 3 && <div className="w-12 h-0.5 rounded-full" style={{ background: step > s ? "#F59E0B" : "var(--border)" }} />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">

                {/* STEP 1 — Select Tests */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                    <div className="text-center mb-8">
                      <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                        style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                        Step 1 of 3
                      </span>
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Which Entry <span className="gold-text">Tests</span> are you preparing for?
                      </h1>
                      <p className="text-muted-foreground text-sm">Select all that apply — you can prepare for multiple tests simultaneously.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                      {ENTRY_TESTS.map((t, i) => {
                        const sel = selectedTests.includes(t)
                        return (
                          <motion.button key={t} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                            onClick={() => toggleTest(t)}
                            className="relative px-4 py-4 rounded-2xl font-semibold text-sm text-center transition-all duration-200 cursor-pointer"
                            style={{
                              background: sel ? "linear-gradient(135deg,#1E3A8A,#0B1F3A)" : "var(--card)",
                              border: sel ? "1px solid #F59E0B" : "1px solid var(--border)",
                              color: sel ? "#F9FAFB" : "var(--foreground)",
                              fontFamily: "Poppins, sans-serif",
                            }}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          >
                            {sel && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background: "#F59E0B" }}>
                                <Check className="w-2.5 h-2.5 text-[#0B1F3A]" />
                              </div>
                            )}
                            {t}
                          </motion.button>
                        )
                      })}
                    </div>
                    <motion.button
                      disabled={!selectedTests.length}
                      onClick={() => setStep(2)}
                      className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                      style={{
                        background: selectedTests.length ? "linear-gradient(135deg,#F59E0B,#D97706)" : "var(--muted)",
                        color: selectedTests.length ? "#0B1F3A" : "var(--muted-foreground)",
                        fontFamily: "Poppins, sans-serif",
                        cursor: selectedTests.length ? "pointer" : "not-allowed",
                      }}
                      whileHover={selectedTests.length ? { scale: 1.02 } : {}}
                      whileTap={selectedTests.length ? { scale: 0.98 } : {}}
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}

                {/* STEP 2 — Select Stream */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                    <div className="text-center mb-8">
                      <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                        style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                        Step 2 of 3
                      </span>
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Your Academic <span className="gold-text">Stream</span>
                      </h1>
                      <p className="text-muted-foreground text-sm">Your field of study determines the subject syllabus and MCQ distribution.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                      {STREAMS.map((s, i) => {
                        const sel = selectedStream === s
                        return (
                          <motion.button key={s} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                            onClick={() => setSelectedStream(s)}
                            className="px-4 py-5 rounded-2xl font-semibold text-sm text-center transition-all duration-200 cursor-pointer relative"
                            style={{
                              background: sel ? "linear-gradient(135deg,#1E3A8A,#0B1F3A)" : "var(--card)",
                              border: sel ? "1px solid #F59E0B" : "1px solid var(--border)",
                              color: sel ? "#F9FAFB" : "var(--foreground)",
                              fontFamily: "Poppins, sans-serif",
                            }}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          >
                            {sel && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background: "#F59E0B" }}>
                                <Check className="w-2.5 h-2.5 text-[#0B1F3A]" />
                              </div>
                            )}
                            {s}
                          </motion.button>
                        )
                      })}
                    </div>
                    <div className="flex gap-3">
                      <motion.button onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-2xl font-semibold text-sm border transition-all duration-200"
                        style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "Poppins, sans-serif" }}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      >Back</motion.button>
                      <motion.button disabled={!selectedStream} onClick={() => setStep(3)}
                        className="flex-[2] py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                        style={{
                          background: selectedStream ? "linear-gradient(135deg,#F59E0B,#D97706)" : "var(--muted)",
                          color: selectedStream ? "#0B1F3A" : "var(--muted-foreground)",
                          fontFamily: "Poppins, sans-serif",
                          cursor: selectedStream ? "pointer" : "not-allowed",
                        }}
                        whileHover={selectedStream ? { scale: 1.02 } : {}} whileTap={selectedStream ? { scale: 0.98 } : {}}
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 — Target Universities */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                    <div className="text-center mb-8">
                      <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                        style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                        Step 3 of 3
                      </span>
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Target <span className="gold-text">Universities</span>
                      </h1>
                      <p className="text-muted-foreground text-sm">Optional — helps us personalise your roadmap and recommendations.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                      {TARGET_UNIS.map((u, i) => {
                        const sel = selectedUnis.includes(u)
                        return (
                          <motion.button key={u} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                            onClick={() => toggleUni(u)}
                            className="px-4 py-4 rounded-2xl font-semibold text-sm text-center transition-all duration-200 cursor-pointer relative"
                            style={{
                              background: sel ? "linear-gradient(135deg,#1E3A8A,#0B1F3A)" : "var(--card)",
                              border: sel ? "1px solid #F59E0B" : "1px solid var(--border)",
                              color: sel ? "#F9FAFB" : "var(--foreground)",
                              fontFamily: "Poppins, sans-serif",
                            }}
                            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          >
                            {sel && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background: "#F59E0B" }}>
                                <Check className="w-2.5 h-2.5 text-[#0B1F3A]" />
                              </div>
                            )}
                            {u}
                          </motion.button>
                        )
                      })}
                    </div>
                    <div className="flex gap-3">
                      <motion.button onClick={() => setStep(2)}
                        className="flex-1 py-4 rounded-2xl font-semibold text-sm"
                        style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "Poppins, sans-serif" }}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      >Back</motion.button>
                      <motion.button onClick={handleSaveProfile}
                        className="flex-[2] py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                        style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#0B1F3A", fontFamily: "Poppins, sans-serif" }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        disabled={saving}
                      >
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...</> : <><Sparkles className="w-4 h-4" /> Start Preparing <ArrowRight className="w-4 h-4" /></>}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>

        ) : (
          /* ─── PREPARATION DASHBOARD ─── */
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-16">

            {/* Dashboard hero strip */}
            <div className="relative py-10 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg,#0B1F3A 0%,#1E3A8A 100%)" }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #F59E0B 0%, transparent 50%), radial-gradient(circle at 80% 20%, #60A5FA 0%, transparent 40%)" }} />
              <div className="max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#F59E0B" }}>Preparation Dashboard</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {profile.tests.join(" · ")}
                    </h1>
                    <p className="text-white/60 text-sm">{profile.stream} &nbsp;·&nbsp; {profile.universities.length > 0 ? `Targeting ${profile.universities.slice(0, 3).join(", ")}` : "No target universities selected"}</p>
                  </div>
                  <motion.button
                    onClick={() => { setProfile(null); setStep(1); setSelectedTests([]); setSelectedStream(""); setSelectedUnis([]) }}
                    className="text-xs font-semibold px-4 py-2 rounded-full text-white/60 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                    whileHover={{ scale: 1.03 }}
                  >
                    Change Profile
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div
              className="sticky z-30 overflow-x-auto"
              style={{ top: "64px", background: "var(--card)", borderBottom: "1px solid var(--border)" }}
            >
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-0 min-w-max">
                  {NAV_TABS.map(tab => {
                    const active = activeTab === tab.id
                    return (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className="relative flex items-center gap-2 px-5 py-4 text-xs font-semibold transition-colors duration-150 whitespace-nowrap flex-shrink-0"
                        style={{
                          color: active ? "#F59E0B" : "var(--muted-foreground)",
                          fontFamily: "Poppins, sans-serif",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <tab.icon className="w-3.5 h-3.5 flex-shrink-0" />
                        {tab.label}
                        {active && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                            style={{ background: "#F59E0B" }}
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Tab content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {activeTab === "universities" && <PrepAcceptedUniversities tests={profile.tests} />}
                  {activeTab === "chapters"     && <PrepImportantChapters tests={profile.tests} stream={profile.stream} />}
                  {activeTab === "weakness"     && <PrepWeaknessAnalysis tests={profile.tests} />}
                  {activeTab === "progress"     && <PrepProgressTracker tests={profile.tests} stream={profile.stream} />}
                  {activeTab === "leaderboard"  && <PrepLeaderboard tests={profile.tests} />}
                  {activeTab === "roadmap"      && <PrepStudyRoadmap tests={profile.tests} stream={profile.stream} />}
                  {activeTab === "mock"         && <PrepMockTests tests={profile.tests} />}
                  {activeTab === "ai"           && <PrepAIRecommendations profile={profile} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
