"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Map, CheckCircle2, Circle, Clock, Calendar, BookOpen, ArrowRight } from "lucide-react"

interface RoadmapWeek {
  week: number
  title: string
  topics: { name: string; subject: string; completed: boolean; hours: number }[]
  isCurrentWeek: boolean
}

const MOCK_ROADMAP: RoadmapWeek[] = [
  {
    week: 1,
    title: "Foundation Building",
    isCurrentWeek: false,
    topics: [
      { name: "Algebra Basics", subject: "Mathematics", completed: true, hours: 4 },
      { name: "Motion & Kinematics", subject: "Physics", completed: true, hours: 3 },
      { name: "Atomic Structure", subject: "Chemistry", completed: true, hours: 2 },
    ],
  },
  {
    week: 2,
    title: "Core Concepts",
    isCurrentWeek: true,
    topics: [
      { name: "Trigonometry", subject: "Mathematics", completed: true, hours: 5 },
      { name: "Laws of Motion", subject: "Physics", completed: true, hours: 4 },
      { name: "Chemical Bonding", subject: "Chemistry", completed: false, hours: 3 },
      { name: "Vocabulary Building", subject: "English", completed: false, hours: 2 },
    ],
  },
  {
    week: 3,
    title: "Advanced Topics",
    isCurrentWeek: false,
    topics: [
      { name: "Calculus Introduction", subject: "Mathematics", completed: false, hours: 6 },
      { name: "Electricity", subject: "Physics", completed: false, hours: 4 },
      { name: "Organic Chemistry Basics", subject: "Chemistry", completed: false, hours: 4 },
    ],
  },
  {
    week: 4,
    title: "Practice & Revision",
    isCurrentWeek: false,
    topics: [
      { name: "Full Mock Test #1", subject: "All", completed: false, hours: 3 },
      { name: "Weak Area Revision", subject: "All", completed: false, hours: 5 },
      { name: "Full Mock Test #2", subject: "All", completed: false, hours: 3 },
    ],
  },
]

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#F59E0B",
  Physics: "#60A5FA",
  Chemistry: "#34D399",
  English: "#A78BFA",
  All: "#94A3B8",
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

export function PrepStudyRoadmap({ tests, universities }: { tests: string[]; universities: string[] }) {
  const [data, setData] = useState<RoadmapWeek[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => { setData(MOCK_ROADMAP); setLoading(false) }, 800)
  }, [tests, universities])

  const totalTopics = data.reduce((s, w) => s + w.topics.length, 0)
  const completedTopics = data.reduce((s, w) => s + w.topics.filter(t => t.completed).length, 0)
  const totalHours = data.reduce((s, w) => s + w.topics.reduce((h, t) => h + t.hours, 0), 0)

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl shimmer" />)}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
          Personalized
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
          Study <span className="gold-text">Roadmap</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Your personalized {data.length}-week study plan for {tests.join(" & ")}.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Calendar, label: "Total Weeks", value: `${data.length}`, color: "#60A5FA" },
          { icon: BookOpen, label: "Topics", value: `${completedTopics}/${totalTopics}`, color: "#34D399" },
          { icon: Clock, label: "Est. Hours", value: `${totalHours}h`, color: "#F59E0B" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
            className="p-4 rounded-2xl text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
            <p className="text-lg font-bold mb-0.5" style={{ color: stat.color, fontFamily: "Poppins, sans-serif" }}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Roadmap timeline */}
      <div className="space-y-6">
        {data.map((week, i) => {
          const weekProgress = week.topics.length ? Math.round((week.topics.filter(t => t.completed).length / week.topics.length) * 100) : 0
          return (
            <motion.div key={week.week} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="relative pl-8">
              
              {/* Timeline line */}
              {i < data.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-0 w-0.5"
                  style={{ background: week.isCurrentWeek ? "#F59E0B" : "var(--border)" }} />
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: week.isCurrentWeek ? "#F59E0B" : weekProgress === 100 ? "#34D399" : "var(--muted)",
                  border: week.isCurrentWeek ? "2px solid rgba(245,158,11,0.3)" : "none"
                }}>
                {weekProgress === 100 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <span className="text-[10px] font-bold" style={{ color: week.isCurrentWeek ? "#0B1F3A" : "var(--muted-foreground)" }}>
                    {week.week}
                  </span>
                )}
              </div>

              <div className="p-5 rounded-2xl"
                style={{
                  background: week.isCurrentWeek ? "rgba(245,158,11,0.05)" : "var(--card)",
                  border: week.isCurrentWeek ? "1px solid rgba(245,158,11,0.2)" : "1px solid var(--border)"
                }}>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
                        Week {week.week}: {week.title}
                      </p>
                      {week.isCurrentWeek && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{week.topics.length} topics • {week.topics.reduce((h, t) => h + t.hours, 0)}h</p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: weekProgress === 100 ? "#34D399" : "#F59E0B", fontFamily: "Poppins, sans-serif" }}>
                    {weekProgress}%
                  </span>
                </div>

                <div className="space-y-2">
                  {week.topics.map((topic, j) => {
                    const color = SUBJECT_COLORS[topic.subject] || "#F59E0B"
                    return (
                      <div key={j} className="flex items-center gap-3 p-2 rounded-xl"
                        style={{ background: "var(--muted)" }}>
                        {topic.completed ? (
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#34D399" }} />
                        ) : (
                          <Circle className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{topic.name}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={{ background: color + "18", color }}>
                          {topic.subject}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{topic.hours}h</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
