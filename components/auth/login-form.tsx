'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

type FieldError = string | null

function validateEmail(v: string): FieldError {
  if (!v) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address'
  return null
}

function validatePassword(v: string): FieldError {
  if (!v) return 'Password is required'
  return null
}

interface InputFieldProps {
  id: string
  label: string
  type: string
  value: string
  error: FieldError
  icon: React.ReactNode
  rightElement?: React.ReactNode
  placeholder: string
  autoComplete?: string
  onChange: (v: string) => void
  onBlur: () => void
}

function InputField({
  id,
  label,
  type,
  value,
  error,
  icon,
  rightElement,
  placeholder,
  autoComplete,
  onChange,
  onBlur,
}: InputFieldProps) {
  const isValid = value && !error
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete ?? id}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`
            w-full pl-10 pr-10 py-3 rounded-xl border bg-card text-foreground text-sm
            placeholder:text-muted-foreground
            outline-none transition-all duration-200
            focus:ring-2 focus:ring-ring focus:border-ring
            ${error
              ? 'border-destructive focus:ring-destructive/40'
              : isValid
              ? 'border-green-500 focus:ring-green-500/30'
              : 'border-border'}
          `}
        />
        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
        )}
        {!rightElement && isValid && (
          <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 text-xs text-destructive"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState<FieldError>(null)
  const [passwordError, setPasswordError] = useState<FieldError>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem('unipath-remembered-email')
    if (remembered) {
      setEmail(remembered)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr)
    setPasswordError(pErr)
    setAuthError(null)
    if (eErr || pErr) return

    setLoading(true)

    // Save or clear remembered email
    if (rememberMe) {
      localStorage.setItem('unipath-remembered-email', email.trim())
    } else {
      localStorage.removeItem('unipath-remembered-email')
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAuthError(data.error ?? 'Login failed. Please try again.')
        setLoading(false)
        return
      }

      setSuccess(true)
      // Redirect to dashboard
      setTimeout(() => router.push('/dashboard'), 800)
    } catch {
      setAuthError('Network error. Please check your internet connection.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h2
          className="text-3xl font-bold text-foreground mb-2 text-balance"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Welcome Back!
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Log in and continue your university journey.
        </p>
      </div>

      {/* Success state */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-800 dark:text-green-300 text-sm font-medium">
              Login successful! Redirecting to dashboard...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Error */}
      <AnimatePresence>
        {authError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-destructive text-sm font-medium">{authError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <InputField
          id="email"
          label="Email Address"
          type="email"
          value={email}
          error={emailError}
          icon={<Mail className="w-4 h-4" />}
          placeholder="you@example.com"
          autoComplete="email"
          onChange={(v) => {
            setEmail(v)
            if (emailError) setEmailError(validateEmail(v))
            if (authError) setAuthError(null)
          }}
          onBlur={() => setEmailError(validateEmail(email))}
        />

        <InputField
          id="current-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          error={passwordError}
          icon={<Lock className="w-4 h-4" />}
          placeholder="Enter your password"
          autoComplete="current-password"
          onChange={(v) => {
            setPassword(v)
            if (passwordError) setPasswordError(validatePassword(v))
            if (authError) setAuthError(null)
          }}
          onBlur={() => setPasswordError(validatePassword(password))}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Remember me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
                id="remember"
              />
              <div className="w-4 h-4 rounded border border-border bg-card peer-checked:bg-primary peer-checked:border-primary transition-colors duration-150 flex items-center justify-center">
                {rememberMe && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1.5 5L4 7.5 8.5 2.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>
          <Link
            href="/auth/reset-password"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || success}
          whileTap={{ scale: 0.985 }}
          className="w-full py-3 rounded-xl bg-[#F59E0B] text-[#0B1F3A] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#D97706] hover:shadow-lg hover:shadow-[#F59E0B]/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#F59E0B]/20"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Log In'
          )}
        </motion.button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-primary font-semibold hover:text-primary/80 transition-colors"
        >
          Sign up now — it&apos;s free
        </Link>
      </p>
    </div>
  )
}
