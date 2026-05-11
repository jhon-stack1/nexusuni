"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Target, CheckCircle2, Clock, Flame, Calendar } from "lucide-react"

interface ProgressData {
  subject: string
  completed: number
  total: number
  streak: number
  lastStudied: string
}

const MOCK_PROGRESS: ProgressData[] = [
  { subject: "Mathematics", completed: 45, total: 60, streak: 7, lastStudied: "2025-01-10" },
  { subject: "Physics", completed: 32, total: 48, streak: 5, lastStudied: "2025-01-10" },
  { subject: "Chemistry", completed: 18, total: 40, streak: 2, lastStudied: "2025-01-09" },
  { subject: "English", completed: 28, total: 30, streak: 12, lastStudied: "2025-01-10" },
]

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#F59E0B",
  Physics: "#60A5FA",
  Chemistry: "#34D399",
  English: "#A78BFA",
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

export function PrepProgressTracker({ tests }: { tests: string[] }) {
  const [data, setData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => { setData(MOCK_PROGRESS); setLoading(false) }, 800)
  }, [tests])

  const totalCompleted = data.reduce((s, d) => s + d.completed, 0)
  const totalTopics = data.reduce((s, d) => s + d.total, 0)
  const overallProgress = totalTopics ? Math.round((totalCompleted / totalTopics) * 100) : 0
  const maxStreak = data.length ? Math.max(...data.map(d => d.streak)) : 0

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl shimmer" />)}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34D399" }}>
          Progress
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
          Progress <span className="gold-text">Tracker</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Track your study progress across all subjects and maintain your streak.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Target, label: "Overall Progress", value: `${overallProgress}%`, color: "#F59E0B" },
          { icon: CheckCircle2, label: "Topics Completed", value: `${totalCompleted}/${totalTopics}`, color: "#34D399" },
          { icon: Flame, label: "Best Streak", value: `${maxStreak} days`, color: "#EF4444" },
          { icon: Calendar, label: "Subjects Active", value: `${data.length}`, color: "#60A5FA" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
            className="p-4 rounded-2xl text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
            <p className="text-xl font-bold mb-1" style={{ color: stat.color, fontFamily: "Poppins, sans-serif" }}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Subject progress cards */}
      <div className="space-y-4">
        {data.map((item, i) => {
          const color = SUBJECT_COLORS[item.subject] || "#F59E0B"
          const progress = Math.round((item.completed / item.total) * 100)
          return (
            <motion.div key={item.subject} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="p-5 rounded-2xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "18" }}>
                    <TrendingUp className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.completed} of {item.total} topics completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}>
                    <Flame className="w-3 h-3" /> {item.streak}d
                  </div>
                  <span className="text-lg font-bold" style={{ color, fontFamily: "Poppins, sans-serif" }}>{progress}%</span>
                </div>
              </div>

              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
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
