"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Flame, Star, TrendingUp, BookOpen, Filter } from "lucide-react"

interface Chapter {
  id: number
  subject_name: string
  chapter_name: string
  estimated_mcqs: number
  difficulty_level: "Easy" | "Medium" | "Hard"
  importance_score: number
}

const MOCK_CHAPTERS: Chapter[] = [
  { id: 1,  subject_name: "Mathematics", chapter_name: "Trigonometry",             estimated_mcqs: 15, difficulty_level: "Medium", importance_score: 95 },
  { id: 2,  subject_name: "Mathematics", chapter_name: "Algebra",                  estimated_mcqs: 20, difficulty_level: "Hard",   importance_score: 98 },
  { id: 3,  subject_name: "Mathematics", chapter_name: "Calculus & Derivatives",   estimated_mcqs: 10, difficulty_level: "Hard",   importance_score: 90 },
  { id: 4,  subject_name: "Mathematics", chapter_name: "Coordinate Geometry",      estimated_mcqs: 8,  difficulty_level: "Medium", importance_score: 82 },
  { id: 5,  subject_name: "Physics",     chapter_name: "Motion & Forces",          estimated_mcqs: 12, difficulty_level: "Medium", importance_score: 92 },
  { id: 6,  subject_name: "Physics",     chapter_name: "Waves & Oscillations",     estimated_mcqs: 8,  difficulty_level: "Medium", importance_score: 85 },
  { id: 7,  subject_name: "Physics",     chapter_name: "Current Electricity",      estimated_mcqs: 10, difficulty_level: "Hard",   importance_score: 93 },
  { id: 8,  subject_name: "Physics",     chapter_name: "Optics",                   estimated_mcqs: 6,  difficulty_level: "Easy",   importance_score: 75 },
  { id: 9,  subject_name: "Chemistry",   chapter_name: "Organic Chemistry",        estimated_mcqs: 12, difficulty_level: "Hard",   importance_score: 91 },
  { id: 10, subject_name: "Chemistry",   chapter_name: "Electrochemistry",         estimated_mcqs: 7,  difficulty_level: "Medium", importance_score: 80 },
  { id: 11, subject_name: "English",     chapter_name: "Synonyms & Antonyms",      estimated_mcqs: 10, difficulty_level: "Easy",   importance_score: 88 },
  { id: 12, subject_name: "English",     chapter_name: "Sentence Completion",      estimated_mcqs: 8,  difficulty_level: "Medium", importance_score: 84 },
]

const DIFFICULTY_STYLE: Record<string, { bg: string; color: string }> = {
  Easy:   { bg: "rgba(52,211,153,0.12)",  color: "#34D399" },
  Medium: { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B" },
  Hard:   { bg: "rgba(239,68,68,0.12)",   color: "#EF4444" },
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#F59E0B",
  Physics:     "#60A5FA",
  Chemistry:   "#34D399",
  English:     "#A78BFA",
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

export function PrepImportantChapters({ tests, stream }: { tests: string[]; stream: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSubject, setActiveSubject] = useState("All")

  useEffect(() => {
    setLoading(true)
    // Replace with: fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chapters?tests=${tests.join(",")}&stream=${stream}`)
    setTimeout(() => { setChapters(MOCK_CHAPTERS); setLoading(false) }, 800)
  }, [tests, stream])

  const subjects = ["All", ...Array.from(new Set(chapters.map(c => c.subject_name)))]
  const filtered = activeSubject === "All" ? chapters : chapters.filter(c => c.subject_name === activeSubject)

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3,4,5].map(i => <div key={i} className="h-20 rounded-2xl shimmer" />)}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
          Syllabus Analysis
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
          Important <span className="gold-text">Chapters</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Ranked by importance score and estimated MCQ contribution — focus on high-impact chapters first.</p>
      </div>

      {/* Subject filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        {subjects.map(sub => {
          const active = activeSubject === sub
          const color = SUBJECT_COLORS[sub] || "#F59E0B"
          return (
            <button key={sub} onClick={() => setActiveSubject(sub)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer"
              style={{
                background: active ? color + "20" : "var(--card)",
                border: active ? `1px solid ${color}` : "1px solid var(--border)",
                color: active ? color : "var(--muted-foreground)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {sub}
            </button>
          )
        })}
      </div>

      {/* Chapter cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ch, i) => {
          const color = SUBJECT_COLORS[ch.subject_name] || "#F59E0B"
          const diff = DIFFICULTY_STYLE[ch.difficulty_level]
          return (
            <motion.div key={ch.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="group p-5 rounded-2xl relative overflow-hidden cursor-pointer"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              whileHover={{ y: -3, boxShadow: `0 8px 30px ${color}18` }}
            >
              {/* Importance badge */}
              {ch.importance_score >= 90 && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>
                  <Flame className="w-3 h-3" /> Hot
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: color + "18" }}>
                  <BookOpen className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm leading-snug" style={{ fontFamily: "Poppins, sans-serif" }}>{ch.chapter_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ch.subject_name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: diff.bg, color: diff.color }}>
                    {ch.difficulty_level}
                  </span>
                  <span className="text-xs text-muted-foreground">~{ch.estimated_mcqs} MCQs</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold" style={{ color }}>
                  <Star className="w-3 h-3" />
                  {ch.importance_score}%
                </div>
              </div>

              {/* Importance bar */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ch.importance_score}%` }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(to right, #1E3A8A, ${color})` }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
