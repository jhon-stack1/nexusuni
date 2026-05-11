"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Calculator,
  Trophy,
  Star,
  LayoutDashboard,
  LogOut,
  User,
  LogIn,
  UserPlus,
} from "lucide-react"

const navLinks = [
  { label: "Admissions", href: "/admissions" },
  { label: "Scholarships", href: "/scholarships" },
]

const universitiesMenu = [
  { icon: Trophy, label: "Admission Predictor", href: "/admission-predictor" },
  { icon: Star, label: "Merit Lists", href: "/merit-list" },
  { icon: GraduationCap, label: "Scholarship Chance", href: "/scholarships" },
  { icon: Calculator, label: "Merit Calculator", href: "/merit-calculator" },
  { icon: BookOpen, label: "Find Best University", href: "/admissions" },
]

interface AuthUser {
  user_id: string
  full_name: string
  username: string
  email: string
}

export function Navbar({ dark: darkProp, toggleDark: toggleDarkProp }: { dark?: boolean; toggleDark?: () => void } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const [darkInternal, setDarkInternal] = useState(true)
  const dark = darkProp !== undefined ? darkProp : darkInternal
  const toggleDark = toggleDarkProp ?? (() => setDarkInternal(d => !d))
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [uniDropdown, setUniDropdown] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Check auth state on mount and on route change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user ?? null)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      } finally {
        setAuthChecked(true)
      }
    }
    checkAuth()
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setUniDropdown(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {/* ignore */}
    setUser(null)
    setProfileOpen(false)
    router.push('/')
    router.refresh()
  }

  // Get initials for avatar
  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-lg shadow-[#0B1F3A]/20" : "bg-transparent"
        }`}
        style={{ borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/">
              <motion.span
                className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1E3A8A, #0B1F3A)" }}>
                  <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Uni<span className="gold-text">Path</span>
                </span>
              </motion.span>
            </Link>

            {/* Center: Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#F59E0B] transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search universities, scholarships, merit lists..."
                  className="w-full pl-12 pr-5 py-3 rounded-full text-sm text-white/90 placeholder:text-white/40 outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.13)"
                    e.currentTarget.style.borderColor = "rgba(245,158,11,0.5)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"
                  }}
                />
              </div>
            </div>

            {/* Right: Nav Links + Actions */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link key={link.label} href={link.href}>
                    <motion.span
                      className="relative px-3 py-1.5 text-sm font-medium text-white/75 hover:text-white transition-colors duration-200 rounded-lg cursor-pointer block"
                      whileHover={{ color: "#fff" }}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                          style={{ background: "#F59E0B" }}
                        />
                      )}
                    </motion.span>
                  </Link>
                )
              })}

              {/* Universities Dropdown */}
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setUniDropdown(!uniDropdown)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white/75 hover:text-white transition-colors duration-200 rounded-lg"
                >
                  Universities
                  <motion.div animate={{ rotate: uniDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {uniDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden shadow-2xl z-50"
                      style={{ background: "rgba(11,31,58,0.95)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
                    >
                      <div className="p-2">
                        {universitiesMenu.map((item) => (
                          <Link key={item.label} href={item.href} onClick={() => setUniDropdown(false)}>
                            <motion.span
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/75 hover:text-white hover:bg-white/8 transition-all duration-150 cursor-pointer"
                              whileHover={{ x: 3 }}
                            >
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: "rgba(245,158,11,0.15)" }}>
                                <item.icon className="w-3.5 h-3.5 text-[#F59E0B]" />
                              </div>
                              {item.label}
                            </motion.span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-white/15 mx-1" />

              {/* Dark mode toggle */}
              <motion.button
                onClick={toggleDark}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.06)" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {dark ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Auth: show skeleton while checking, then login/signup or avatar */}
              {!authChecked ? (
                <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
              ) : user ? (
                <>
                  {/* Notifications */}
                  <motion.button
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B] ring-2 ring-[#0B1F3A]" />
                  </motion.button>

                  {/* Profile dropdown */}
                  <div className="relative" ref={profileRef}>
                    <motion.button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#F59E0B]/30 hover:ring-[#F59E0B]/70 transition-all duration-200 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1E3A8A, #0B1F3A)" }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-white text-xs font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>{initials}</span>
                    </motion.button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.18 }}
                          className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl z-50"
                          style={{ background: "rgba(11,31,58,0.95)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
                        >
                          <div className="px-4 py-3 border-b border-white/8">
                            <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{user.full_name}</p>
                            <p className="text-white/50 text-xs truncate">{user.email}</p>
                          </div>
                          <div className="p-2">
                            <Link href="/dashboard" onClick={() => setProfileOpen(false)}>
                              <motion.span className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/75 hover:text-white hover:bg-white/8 transition-all duration-150 cursor-pointer" whileHover={{ x: 3 }}>
                                <LayoutDashboard className="w-4 h-4 text-[#F59E0B]" /> Dashboard
                              </motion.span>
                            </Link>
                            <Link href="/profile" onClick={() => setProfileOpen(false)}>
                              <motion.span className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/75 hover:text-white hover:bg-white/8 transition-all duration-150 cursor-pointer" whileHover={{ x: 3 }}>
                                <User className="w-4 h-4 text-[#F59E0B]" /> Profile
                              </motion.span>
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/75 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150">
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* Not logged in: Login + Signup buttons */
                <div className="flex items-center gap-2 ml-1">
                  <Link href="/login">
                    <motion.span
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <LogIn className="w-3.5 h-3.5" /> Login
                    </motion.span>
                  </Link>
                  <Link href="/signup">
                    <motion.span
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
                      style={{ background: "#F59E0B", color: "#0B1F3A" }}
                      whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(245,158,11,0.35)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Sign Up
                    </motion.span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <motion.button onClick={toggleDark} className="w-9 h-9 flex items-center justify-center text-white/70" whileTap={{ scale: 0.9 }}>
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 flex items-center justify-center text-white"
                whileTap={{ scale: 0.9 }}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-40 w-80 shadow-2xl md:hidden"
            style={{ background: "rgba(6,14,28,0.98)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex flex-col h-full pt-20 pb-8 px-6 overflow-y-auto">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white/80 placeholder:text-white/30 outline-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>

              <nav className="flex flex-col gap-1">
                {[...navLinks, { label: "Universities", href: "/admissions" }].map((link, i) => (
                  <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}>
                    <motion.span
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center px-4 py-3 rounded-xl text-white/75 hover:text-white hover:bg-white/8 transition-all duration-150 font-medium cursor-pointer"
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t border-white/8">
                <p className="text-white/40 text-xs uppercase tracking-widest px-4 mb-2">Quick Links</p>
                {universitiesMenu.map((item, i) => (
                  <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}>
                    <motion.span
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150 cursor-pointer"
                    >
                      <item.icon className="w-4 h-4 text-[#F59E0B]" />
                      {item.label}
                    </motion.span>
                  </Link>
                ))}
              </div>

              {/* Mobile auth */}
              <div className="mt-auto pt-4 border-t border-white/8 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #1E3A8A, #0B1F3A)" }}>
                        <span className="text-white text-xs font-bold">{initials}</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{user.full_name}</p>
                        <p className="text-white/50 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/75 hover:text-white hover:bg-white/8 transition-all cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 text-[#F59E0B]" /> Dashboard
                      </span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <span className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white border border-white/15 hover:bg-white/8 transition-all cursor-pointer">
                        <LogIn className="w-4 h-4" /> Login
                      </span>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      <span className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold cursor-pointer"
                        style={{ background: "#F59E0B", color: "#0B1F3A" }}>
                        <UserPlus className="w-4 h-4" /> Create Account
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
