'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, GraduationCap } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  pageKey: string
}

export default function AuthLayout({ children, pageKey }: AuthLayoutProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center shadow-md">
            <GraduationCap className="w-4 h-4 text-[#0B1F3A]" />
          </div>
          <span
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Uni<span className="text-[#F59E0B]">Path</span>
          </span>
        </Link>

        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              {resolvedTheme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        )}
      </div>

      {/* Centered form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-2xl shadow-xl shadow-black/5 px-8 py-8">
              {children}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className="text-center text-muted-foreground text-xs pb-3">
        &copy; {new Date().getFullYear()} UniPath. All rights reserved.
      </p>
    </div>
  )
}
