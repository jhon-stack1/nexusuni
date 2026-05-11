"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus, User } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  streak: number
  trend: "up" | "down" | "stable"
  isCurrentUser?: boolean
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Ahmed Khan", score: 4850, streak: 21, trend: "stable" },
  { rank: 2, name: "Sara Ali", score: 4720, streak: 18, trend: "up" },
  { rank: 3, name: "Usman Tariq", score: 4680, streak: 15, trend: "up" },
  { rank: 4, name: "Fatima Zahra", score: 4520, streak: 12, trend: "down" },
  { rank: 5, name: "You", score: 4380, streak: 7, trend: "up", isCurrentUser: true },
  { rank: 6, name: "Ali Hassan", score: 4250, streak: 9, trend: "stable" },
  { rank: 7, name: "Zainab Malik", score: 4100, streak: 6, trend: "down" },
  { rank: 8, name: "Bilal Ahmed", score: 3950, streak: 4, trend: "up" },
]

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5" style={{ color: "#34D399" }} />
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />
  return <Minus className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5" style={{ color: "#F59E0B" }} />
  if (rank === 2) return <Medal className="w-5 h-5" style={{ color: "#94A3B8" }} />
  if (rank === 3) return <Medal className="w-5 h-5" style={{ color: "#CD7F32" }} />
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
}

export function PrepLeaderboard({ tests }: { tests: string[] }) {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => { setData(MOCK_LEADERBOARD); setLoading(false) }, 800)
  }, [tests])

  const currentUser = data.find(d => d.isCurrentUser)

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-2xl shimmer" />)}
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}>
          Competition
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
          Weekly <span className="gold-text">Leaderboard</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Compete with other students preparing for the same tests.</p>
      </div>

      {/* Your rank highlight */}
      {currentUser && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl mb-6 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#1E3A8A,#0B1F3A)", border: "1px solid #F59E0B" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#F59E0B" }}>
              <User className="w-5 h-5 text-[#0B1F3A]" />
            </div>
            <div>
              <p className="font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Your Rank: #{currentUser.rank}</p>
              <p className="text-xs text-white/60">{currentUser.score} points • {currentUser.streak} day streak</p>
            </div>
          </div>
          <Trophy className="w-6 h-6" style={{ color: "#F59E0B" }} />
        </motion.div>
      )}

      {/* Leaderboard list */}
      <div className="space-y-3">
        {data.map((entry, i) => (
          <motion.div key={entry.rank} custom={i} variants={fadeUp} initial="hidden" animate="visible"
            className="p-4 rounded-2xl flex items-center justify-between"
            style={{
              background: entry.isCurrentUser ? "rgba(245,158,11,0.08)" : "var(--card)",
              border: entry.isCurrentUser ? "1px solid rgba(245,158,11,0.3)" : "1px solid var(--border)",
            }}>
            <div className="flex items-center gap-4">
              <div className="w-8 flex justify-center">
                <RankBadge rank={entry.rank} />
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: entry.isCurrentUser ? "#F59E0B" : "linear-gradient(135deg,#1E3A8A,#0B1F3A)" }}>
                {entry.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {entry.name} {entry.isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
                </p>
                <p className="text-xs text-muted-foreground">{entry.streak} day streak</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendIcon trend={entry.trend} />
              <span className="font-bold text-sm" style={{ color: entry.rank <= 3 ? "#F59E0B" : "var(--foreground)", fontFamily: "Poppins, sans-serif" }}>
                {entry.score.toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
