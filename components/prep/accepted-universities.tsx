"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Building2, Clock, CalendarDays, AlertCircle, ChevronDown, ChevronUp, BookOpen } from "lucide-react"

interface UniversityData {
  id: number
  university_name: string
  department: string
  eligibility: string
  test_name: string
  apply_deadline: string
  test_date: string
  duration: number
  total_mcqs: number
  negative_marking: boolean
  subjects: { name: string; weightage: number }[]
}

const MOCK_DATA: UniversityData[] = [
  { id: 1, university_name: "NUST", department: "SEECS — CS & Engineering", eligibility: "Min 60% Marks in FSc", test_name: "NET", apply_deadline: "2025-07-15", test_date: "2025-08-10", duration: 120, total_mcqs: 100, negative_marking: true, subjects: [{ name: "Math", weightage: 40 }, { name: "Physics", weightage: 30 }, { name: "English", weightage: 20 }, { name: "IQ", weightage: 10 }] },
  { id: 2, university_name: "PIEAS", department: "Nuclear Engineering", eligibility: "Min 70% Marks in FSc Pre-Eng", test_name: "NET", apply_deadline: "2025-06-30", test_date: "2025-07-28", duration: 90, total_mcqs: 80, negative_marking: false, subjects: [{ name: "Math", weightage: 45 }, { name: "Physics", weightage: 45 }, { name: "English", weightage: 10 }] },
  { id: 3, university_name: "FAST-NU", department: "CS / AI / Software Engineering", eligibility: "Min 50% in FSc", test_name: "FAST Entry Test", apply_deadline: "2025-07-01", test_date: "2025-07-20", duration: 75, total_mcqs: 60, negative_marking: false, subjects: [{ name: "Math", weightage: 50 }, { name: "English", weightage: 30 }, { name: "IQ", weightage: 20 }] },
  { id: 4, university_name: "GIKI", department: "Computer Science / Electrical Eng.", eligibility: "Min 60% FSc Pre-Eng", test_name: "GIKI Test", apply_deadline: "2025-06-20", test_date: "2025-07-15", duration: 90, total_mcqs: 90, negative_marking: true, subjects: [{ name: "Math", weightage: 40 }, { name: "Physics", weightage: 35 }, { name: "Chemistry", weightage: 15 }, { name: "English", weightage: 10 }] },
  { id: 5, university_name: "UET Lahore", department: "All Engineering Departments", eligibility: "Min 60% FSc Pre-Eng", test_name: "ECAT", apply_deadline: "2025-07-10", test_date: "2025-08-05", duration: 120, total_mcqs: 100, negative_marking: false, subjects: [{ name: "Math", weightage: 40 }, { name: "Physics", weightage: 30 }, { name: "Chemistry", weightage: 20 }, { name: "English", weightage: 10 }] },
]

const SUBJECT_COLORS: Record<string, string> = {
  Math: "#F59E0B", Physics: "#60A5FA", Chemistry: "#34D399", English: "#A78BFA", IQ: "#FB923C",
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

function daysLeft(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  return diff
}

export function PrepAcceptedUniversities({ tests }: { tests: string[] }) {
  const [data, setData] = useState<UniversityData[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(1)

  useEffect(() => {
    setLoading(true)
    // Replace with: fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accepted-universities?tests=${tests.join(",")}`)
    setTimeout(() => { setData(MOCK_DATA); setLoading(false) }, 900)
  }, [tests])

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => (
        <div key={i} className="h-28 rounded-2xl shimmer" />
      ))}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
          {tests.join(" · ")}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
          Accepted <span className="gold-text">Universities</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Universities that accept your selected entry tests — with full details, deadlines, and weightage.</p>
      </div>

      <div className="space-y-4">
        {data.map((uni, i) => {
          const isOpen = expanded === uni.id
          const deadline = daysLeft(uni.apply_deadline)
          const urgent = deadline <= 14

          return (
            <motion.div key={uni.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              {/* Header row */}
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-150 hover:bg-white/2 cursor-pointer"
                style={{ background: "transparent", border: "none" }}
                onClick={() => setExpanded(isOpen ? null : uni.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#1E3A8A,#0B1F3A)", fontFamily: "Poppins, sans-serif" }}>
                    {uni.university_name.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>{uni.university_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{uni.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {urgent && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <AlertCircle className="w-3 h-3" />
                      {deadline > 0 ? `${deadline}d left` : "Deadline passed"}
                    </div>
                  )}
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.2)" }}>
                    {uni.test_name}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded detail */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-6 pb-6 pt-0">
                  <div className="h-px mb-5" style={{ background: "var(--border)" }} />

                  {/* Info grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { icon: CalendarDays, label: "Apply Deadline", value: new Date(uni.apply_deadline).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }), warn: urgent },
                      { icon: Clock, label: "Test Date", value: new Date(uni.test_date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }), warn: false },
                      { icon: BookOpen, label: "Total MCQs", value: `${uni.total_mcqs} MCQs`, warn: false },
                      { icon: AlertCircle, label: "Negative Marking", value: uni.negative_marking ? "Yes (−0.25)" : "No", warn: uni.negative_marking },
                    ].map(item => (
                      <div key={item.label} className="p-4 rounded-xl" style={{ background: "var(--muted)" }}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                        </div>
                        <p className="font-bold text-sm" style={{ color: item.warn ? "#EF4444" : "var(--foreground)", fontFamily: "Poppins, sans-serif" }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Eligibility */}
                  <div className="flex items-center gap-2 mb-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span><strong className="text-foreground">Eligibility:</strong> {uni.eligibility}</span>
                  </div>

                  {/* Subject weightage bars */}
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-muted-foreground">Subject Weightage</p>
                  <div className="space-y-3">
                    {uni.subjects.map(sub => (
                      <div key={sub.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-foreground">{sub.name}</span>
                          <span className="font-bold" style={{ color: SUBJECT_COLORS[sub.name] || "#F59E0B" }}>{sub.weightage}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sub.weightage}%` }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(to right, #1E3A8A, ${SUBJECT_COLORS[sub.name] || "#F59E0B"})` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
