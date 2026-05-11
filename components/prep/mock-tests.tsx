"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ClipboardList, Clock, Play, CheckCircle2, Target, BarChart3 } from "lucide-react"

interface MockTest {
  id: number
  title: string
  duration: number
  totalQuestions: number
  difficulty: "Easy" | "Medium" | "Hard"
  completed: boolean
  score?: number
  attempts: number
}

const MOCK_TESTS: MockTest[] = [
  { id: 1, title: "NET Full Mock Test #1", duration: 120, totalQuestions: 100, difficulty: "Hard", completed: true, score: 72, attempts: 2 },
  { id: 2, title: "NET Mathematics Focus", duration: 60, totalQuestions: 50, difficulty: "Medium", completed: true, score: 68, attempts: 1 },
  { id: 3, title: "NET Physics & IQ", duration: 45, totalQuestions: 40, difficulty: "Medium", completed: false, attempts: 0 },
  { id: 4, title: "FAST Entry Practice", duration: 75, totalQuestions: 60, difficulty: "Medium", completed: false, attempts: 0 },
  { id: 5, title: "NET Full Mock Test #2", duration: 120, totalQuestions: 100, difficulty: "Hard", completed: false, attempts: 0 },
  { id: 6, title: "Quick Math Drill", duration: 30, totalQuestions: 25, difficulty: "Easy", completed: true, score: 88, attempts: 3 },
]

const DIFFICULTY_STYLE: Record<string, { bg: string; color: string }> = {
  Easy: { bg: "rgba(52,211,153,0.12)", color: "#34D399" },
  Medium: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  Hard: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

export function PrepMockTests({ tests }: { tests: string[] }) {
  const [data, setData] = useState<MockTest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => { setData(MOCK_TESTS); setLoading(false) }, 800)
  }, [tests])

  const completedTests = data.filter(t => t.completed).length
  const avgScore = data.filter(t => t.score).length
    ? Math.round(data.filter(t => t.score).reduce((s, t) => s + (t.score || 0), 0) / data.filter(t => t.score).length)
    : 0

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="h-40 rounded-2xl shimmer" />)}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60A5FA" }}>
          Practice
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
          Mock <span className="gold-text">Tests</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Practice with full-length and topic-wise mock tests designed for your entry tests.</p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: CheckCircle2, label: "Completed", value: `${completedTests}/${data.length}`, color: "#34D399" },
          { icon: Target, label: "Avg Score", value: `${avgScore}%`, color: "#F59E0B" },
          { icon: BarChart3, label: "Total Attempts", value: `${data.reduce((s, t) => s + t.attempts, 0)}`, color: "#60A5FA" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
            className="p-4 rounded-2xl text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
            <p className="text-lg font-bold mb-0.5" style={{ color: stat.color, fontFamily: "Poppins, sans-serif" }}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Test cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((test, i) => {
          const diff = DIFFICULTY_STYLE[test.difficulty]
          return (
            <motion.div key={test.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="p-5 rounded-2xl relative overflow-hidden group cursor-pointer"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(245,158,11,0.1)" }}>
              
              {test.completed && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5" style={{ color: "#34D399" }} />
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(96,165,250,0.15)" }}>
                  <ClipboardList className="w-5 h-5" style={{ color: "#60A5FA" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm leading-snug" style={{ fontFamily: "Poppins, sans-serif" }}>{test.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: diff.bg, color: diff.color }}>
                      {test.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">{test.totalQuestions} Qs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {test.duration} min
                </div>
                {test.completed ? (
                  <div className="text-sm font-bold" style={{ color: "#F59E0B", fontFamily: "Poppins, sans-serif" }}>
                    Score: {test.score}%
                  </div>
                ) : (
                  <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                    style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#0B1F3A" }}>
                    <Play className="w-3 h-3" /> Start
                  </button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
