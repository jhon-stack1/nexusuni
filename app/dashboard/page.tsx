"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  GraduationCap, Award, BookOpen, TrendingUp,
  User, Settings, LogOut, ChevronRight, Star,
  LayoutDashboard
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

interface AuthUser {
  user_id: string
  full_name: string
  username: string
  email: string
  is_verified: boolean
  profile_picture: string | null
}

const quickLinks = [
  { icon: GraduationCap, label: "Find Universities", href: "/admissions", color: "#1E3A8A" },
  { icon: Award, label: "Scholarships", href: "/scholarships", color: "#F59E0B" },
  { icon: TrendingUp, label: "Merit Lists", href: "/merit-list", color: "#10B981" },
  { icon: BookOpen, label: "Admission Predictor", href: "/admission-predictor", color: "#8B5CF6" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [dark, setDark] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const s = localStorage.getItem("unipath-theme")
    if (s !== null) setDark(s === "dark")
  }, [])

  const toggleDark = () => {
    setDark(prev => {
      const next = !prev
      localStorage.setItem("unipath-theme", next ? "dark" : "light")
      return next
    })
  }

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (!data.user) {
          router.replace('/login?redirect=/dashboard')
        } else {
          setUser(data.user)
        }
      })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/')
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (loading) {
    return (
      <div className={dark ? "dark" : ""} style={{ minHeight: "100svh", background: "#060E1C" }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={dark ? "dark" : ""} style={{ minHeight: "100svh", background: dark ? "#060E1C" : "#F9FAFB" }}>
      <Navbar dark={dark} toggleDark={toggleDark} />

      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Welcome header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-5 mb-10 p-6 rounded-2xl"
            style={{ background: "rgba(13,30,53,0.7)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-bold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #1E3A8A, #0B1F3A)", fontFamily: "Poppins, sans-serif" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white truncate" style={{ fontFamily: "Poppins, sans-serif" }}>
                Khush Amdeed, {user.full_name.split(' ')[0]}!
              </h1>
              <p className="text-white/50 text-sm mt-0.5 truncate">@{user.username} · {user.email}</p>
              {!user.is_verified && (
                <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}>
                  Email verify pending
                </span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/profile">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Settings className="w-4 h-4" /> Settings
                </motion.button>
              </Link>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <LogOut className="w-4 h-4" /> Logout
              </motion.button>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Quick Access
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickLinks.map((item, i) => (
                <Link key={item.label} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                    className="group flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer transition-all"
                    style={{ background: "rgba(13,30,53,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
                    whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.3)" }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${item.color}22` }}>
                      <item.icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <span className="text-sm font-medium text-white/80 group-hover:text-white text-center transition-colors leading-snug">
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Account info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(13,30,53,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="px-6 py-4 border-b border-white/8 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Account Overview</h3>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { label: "Full Name", value: user.full_name, icon: User },
                { label: "Username", value: `@${user.username}`, icon: Star },
                { label: "Email", value: user.email, icon: BookOpen },
                { label: "Account Status", value: user.is_verified ? "Verified" : "Email Pending", icon: GraduationCap },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(245,158,11,0.12)" }}>
                    <row.icon className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/40 text-xs">{row.label}</p>
                    <p className="text-white text-sm font-medium truncate">{row.value}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
