"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Lightbulb, ArrowRight, BookOpen, Target, Clock, Zap } from "lucide-react"

interface Recommendation {
  id: number
  type: "focus" | "tip" | "warning" | "motivation"
  title: string
  description: string
  action?: string
  priority: "high" | "medium" | "low"
}

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 1, type: "focus", title: "Focus on Calculus Today", description: "Based on your recent performance, spending 45 minutes on derivatives and integrals will significantly improve your Math score.", action: "Start Practice", priority: "high" },
  { id: 2, type: "warning", title: "Chemistry Needs Attention", description: "Your Organic Chemistry accuracy dropped 15% this week. Review reaction mechanisms before your next test.", action: "Review Now", priority: "high" },
  { id: 3, type: "tip", title: "Optimal Study Time", description: "Your quiz performance is 23% better between 9-11 AM. Try scheduling difficult topics during this window.", priority: "medium" },
  { id: 4, type: "motivation", title: "Great Progress!", description: "You've completed 12 topics this week, 40% more than last week. Keep up the momentum!", priority: "low" },
  { id: 5, type: "focus", title: "Mock Test Recommended", description: "You haven't taken a full mock test in 5 days. Take one to assess your current preparation level.", action: "Take Mock Test", priority: "medium" },
  { id: 6, type: "tip", title: "Spaced Repetition", description: "Topics from 2 weeks ago are due for revision. Reviewing them now will boost long-term retention.", action: "Start Revision", priority: "medium" },
]

const TYPE_STYLES: Record<string, { bg: string; border: string; icon: typeof Sparkles; color: string }> = {
  focus: { bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)", icon: Target, color: "#60A5FA" },
  tip: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", icon: Lightbulb, color: "#F59E0B" },
  warning: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", icon: Zap, color: "#EF4444" },
  motivation: { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", icon: Sparkles, color: "#34D399" },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

export function PrepAIRecommendations({ tests, stream }: { tests: string[]; stream: string }) {
  const [data, setData] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => { setData(MOCK_RECOMMENDATIONS); setLoading(false) }, 900)
  }, [tests, stream])

  const highPriority = data.filter(r => r.priority === "high")

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl shimmer" />)}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", color: "#A78BFA" }}>
          AI Powered
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
          AI <span className="gold-text">Recommendations</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Personalized suggestions based on your learning patterns, quiz scores, and study habits.</p>
      </div>

      {/* Priority alert */}
      {highPriority.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 rounded-2xl mb-6"
          style={{ background: "linear-gradient(135deg,#1E3A8A,#0B1F3A)", border: "1px solid rgba(245,158,11,0.3)" }}>
          <Sparkles className="w-5 h-5" style={{ color: "#F59E0B" }} />
          <p className="text-sm text-white">
            <strong className="font-semibold">{highPriority.length} high-priority</strong> recommendations need your attention today.
          </p>
        </motion.div>
      )}

      {/* Recommendations list */}
      <div className="space-y-4">
        {data.map((rec, i) => {
          const style = TYPE_STYLES[rec.type]
          const Icon = style.icon
          return (
            <motion.div key={rec.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{ background: style.bg, border: `1px solid ${style.border}` }}>
              
              {rec.priority === "high" && (
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: style.color }} />
              )}

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: style.color + "20" }}>
                  <Icon className="w-5 h-5" style={{ color: style.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-foreground text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{rec.title}</p>
                    {rec.priority === "high" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
                        style={{ background: style.color + "20", color: style.color }}>
                        Priority
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rec.description}</p>
                  {rec.action && (
                    <button className="flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2"
                      style={{ color: style.color }}>
                      {rec.action} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
