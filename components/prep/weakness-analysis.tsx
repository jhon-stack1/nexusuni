"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, TrendingDown, TrendingUp, Minus, Brain, Target } from "lucide-react"

interface WeaknessData {
  subject: string
  accuracy: number
  completed: number
  trend: "up" | "down" | "stable"
  weak_chapters: string[]
  insight: string
}

const MOCK_WEAKNESS: WeaknessData[] = [
  { subject: "Mathematics", accuracy: 45, completed: 60, trend: "up", weak_chapters: ["Calculus", "Probability", "Matrices"], insight: "Your calculus performance is improving but probability remains a critical gap. Spend 2 extra sessions on Bayes' theorem." },
  { subject: "Physics", accuracy: 72, completed: 75, trend: "up", weak_chapters: ["Electromagnetism", "Modern Physics"], insight: "Strong overall but electromagnetism chapters need revision. Attempt more numerical problems." },
  { subject: "Chemistry", accuracy: 38, completed: 40, trend: "down", weak_chapters: ["Organic Reactions", "Electrochemistry", "Polymers"], insight: "Organic chemistry is your weakest area. Focus on reaction mechanisms and practice naming compounds daily." },
  { subject: "English", accuracy: 81, completed: 90, trend: "stable", weak_chapters: ["Idioms & Phrases"], insight: "Strong command of grammar and vocabulary. Review idioms to push accuracy above 90%." },
]

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#F59E0B", Physics: "#60A5FA", Chemistry: "#34D399", English: "#A78BFA",
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up")     return <TrendingUp   className="w-4 h-4" style={{ color: "#34D399" }} />
  if (trend === "down")   return <TrendingDown  className="w-4 h-4" style={{ color: "#EF4444" }} />
  return                         <Minus          className="w-4 h-4" style={{ color: "#9CA3AF" }} />
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

export function PrepWeaknessAnalysis({ tests }: { tests: string[] }) {
  const [data, setData] = useState<WeaknessData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // Replace with: fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weakness-analysis?tests=${tests.join(",")}`)
    setTimeout(() => { setData(MOCK_WEAKNESS); setLoading(false) }, 900)
  }, [tests])

  const critical = data.filter(d => d.accuracy < 50)
  const avgAccuracy = data.length ? Math.round(data.reduce((s, d) => s + d.accuracy, 0) / data.length) : 0

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl shimmer" />)}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#EF4444" }}>
          AI Analysis
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
          Weakness <span className="gold-text">Analysis</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">AI-powered insights based on your quiz scores, practice tests, and chapter completion.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Avg Accuracy",     value: `${avgAccuracy}%`, color: avgAccuracy >= 70 ? "#34D399" : avgAccuracy >= 50 ? "#F59E0B" : "#EF4444" },
          { label: "Subjects Tracked", value: `${data.length}`,  color: "#60A5FA" },
          { label: "Critical Areas",   value: `${critical.length}`, color: "#EF4444" },
          { label: "Areas Strong",     value: `${data.filter(d => d.accuracy >= 70).length}`, color: "#34D399" },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <p className="text-2xl font-bold mb-1" style={{ color: stat.color, fontFamily: "Poppins, sans-serif" }}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Critical alert */}
      {critical.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-3 p-4 rounded-2xl mb-6"
          style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-red-400 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Critical Areas Detected</p>
            <p className="text-xs text-muted-foreground">
              {critical.map(c => c.subject).join(" and ")} need urgent attention. These subjects have accuracy below 50% which can significantly lower your score.
            </p>
          </div>
        </motion.div>
      )}

      {/* Subject cards */}
      <div className="space-y-4">
        {data.map((item, i) => {
          const color = SUBJECT_COLORS[item.subject] || "#F59E0B"
          const isCritical = item.accuracy < 50
          return (
            <motion.div key={item.subject} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: "var(--card)",
                border: isCritical ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--border)",
              }}
            >
              {isCritical && (
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(to right, transparent, #EF4444, transparent)" }} />
              )}

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "18" }}>
                    <Brain className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>{item.subject}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <TrendIcon trend={item.trend} />
                      <span className="text-xs text-muted-foreground">
                        {item.trend === "up" ? "Improving" : item.trend === "down" ? "Declining" : "Stable"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold" style={{ color: isCritical ? "#EF4444" : color, fontFamily: "Poppins, sans-serif" }}>
                    {item.accuracy}%
                  </p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>

              {/* Accuracy bar */}
              <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "var(--muted)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.accuracy}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: isCritical ? "linear-gradient(to right,#EF4444,#F87171)" : `linear-gradient(to right, #1E3A8A, ${color})` }}
                />
              </div>

              {/* Weak chapters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.weak_chapters.map(ch => (
                  <span key={ch} className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                    {ch}
                  </span>
                ))}
              </div>

              {/* AI insight */}
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "var(--muted)" }}>
                <Target className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
                <p className="text-xs text-muted-foreground leading-relaxed">{item.insight}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
