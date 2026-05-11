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
  User,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react'

type FieldError = string | null

function validateName(v: string): FieldError {
  if (!v.trim()) return 'Full name is required'
  if (v.trim().length < 2) return 'Name must be at least 2 characters'
  return null
}

function validateUsername(v: string): FieldError {
  if (!v.trim()) return 'Username is required'
  if (v.trim().length < 3) return 'Username must be at least 3 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Only letters, numbers, and underscores are allowed'
  return null
}

function validateEmail(v: string): FieldError {
  if (!v) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address'
  return null
}

function validatePassword(v: string): FieldError {
  if (!v) return 'Password is required'
  if (v.length < 8) return 'Password must be at least 8 characters'
  return null
}

function validateConfirm(v: string, pw: string): FieldError {
  if (!v) return 'Please confirm your password'
  if (v !== pw) return 'Passwords do not match'
  return null
}

interface StrengthResult {
  score: number
  label: string
  color: string
}

function getStrength(pw: string): StrengthResult {
  if (!pw) return { score: 0, label: '', color: '' }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#22C55E']
  return { score: s, label: labels[s - 1] ?? 'Weak', color: colors[s - 1] ?? '#EF4444' }
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
  onChange: (v: string) => void
  onBlur: () => void
}

function InputField({
  id, label, type, value, error, icon, rightElement, placeholder, onChange, onBlur,
}: InputFieldProps) {
  const isValid = value && !error
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={id}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`
            w-full pl-10 pr-10 py-2.5 rounded-xl border bg-card text-foreground text-sm
            placeholder:text-muted-foreground outline-none transition-all duration-200
            focus:ring-2 focus:ring-ring focus:border-ring
            ${error ? 'border-destructive focus:ring-destructive/40' : isValid ? 'border-green-500 focus:ring-green-500/30' : 'border-border'}
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

interface Province {
  province_id: number
  province_name: string
}

interface Location {
  location_id: number
  city_name: string
  province_id: number
}

export default function SignupForm() {
  const router = useRouter()

  // Form fields
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [agreedError, setAgreedError] = useState(false)

  // Data from DB
  const [provinces, setProvinces] = useState<Province[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([])

  // Errors
  const [nameError, setNameError] = useState<FieldError>(null)
  const [usernameError, setUsernameError] = useState<FieldError>(null)
  const [emailError, setEmailError] = useState<FieldError>(null)
  const [passwordError, setPasswordError] = useState<FieldError>(null)
  const [confirmError, setConfirmError] = useState<FieldError>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const strength = getStrength(password)

  // Fetch provinces and locations
  useEffect(() => {
    fetch('/api/data/provinces')
      .then((r) => r.json())
      .then((d) => setProvinces(d.provinces ?? []))
      .catch(() => {})

    fetch('/api/data/locations')
      .then((r) => r.json())
      .then((d) => setLocations(d.locations ?? []))
      .catch(() => {})
  }, [])

  // Filter cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      setFilteredLocations(locations.filter((l) => l.province_id === selectedProvince))
      setSelectedLocation(null)
    } else {
      setFilteredLocations([])
    }
  }, [selectedProvince, locations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nE = validateName(name)
    const unE = validateUsername(username)
    const eE = validateEmail(email)
    const pE = validatePassword(password)
    const cE = validateConfirm(confirm, password)
    setNameError(nE)
    setUsernameError(unE)
    setEmailError(eE)
    setPasswordError(pE)
    setConfirmError(cE)
    setAgreedError(!agreed)
    setAuthError(null)
    if (nE || unE || eE || pE || cE || !agreed) return

    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          password,
          phone_number: phone.trim() || null,
          province_id: selectedProvince,
          location_id: selectedLocation,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAuthError(data.error ?? 'Failed to create account. Please try again.')
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
      // Redirect to login page
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setAuthError('Network error. Please check your internet connection.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Heading */}
      <div className="mb-4">
        <h2
          className="text-2xl font-bold text-foreground mb-1 text-balance"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Create Your Account
        </h2>
        <p className="text-muted-foreground text-sm">
          Join thousands of students and find your perfect university.
        </p>
      </div>

      {/* Success */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-800 dark:text-green-300 text-sm font-medium">
              Account created! Redirecting to login page...
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
            className="mb-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3"
          >
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-destructive text-sm font-medium">{authError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        {/* Name + Username row */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            id="name"
            label="Full Name"
            type="text"
            value={name}
            error={nameError}
            icon={<User className="w-4 h-4" />}
            placeholder="Ali Ahmed"
            onChange={(v) => { setName(v); if (nameError) setNameError(validateName(v)); if (authError) setAuthError(null) }}
            onBlur={() => setNameError(validateName(name))}
          />
          <InputField
            id="username"
            label="Username"
            type="text"
            value={username}
            error={usernameError}
            icon={<User className="w-4 h-4" />}
            placeholder="ali_ahmed"
            onChange={(v) => { setUsername(v); if (usernameError) setUsernameError(validateUsername(v)); if (authError) setAuthError(null) }}
            onBlur={() => setUsernameError(validateUsername(username))}
          />
        </div>

        <InputField
          id="email"
          label="Email Address"
          type="email"
          value={email}
          error={emailError}
          icon={<Mail className="w-4 h-4" />}
          placeholder="you@example.com"
          onChange={(v) => { setEmail(v); if (emailError) setEmailError(validateEmail(v)); if (authError) setAuthError(null) }}
          onBlur={() => setEmailError(validateEmail(email))}
        />

        <InputField
          id="phone"
          label="Phone Number (Optional)"
          type="tel"
          value={phone}
          error={null}
          icon={<Phone className="w-4 h-4" />}
          placeholder="03XX-XXXXXXX"
          onChange={setPhone}
          onBlur={() => {}}
        />

        {/* Province + City */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Province
            </label>
            <select
              value={selectedProvince ?? ''}
              onChange={(e) => setSelectedProvince(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
            >
              <option value="">-- Select --</option>
              {provinces.map((p) => (
                <option key={p.province_id} value={p.province_id}>
                  {p.province_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">City</label>
            <select
              value={selectedLocation ?? ''}
              onChange={(e) => setSelectedLocation(e.target.value ? Number(e.target.value) : null)}
              disabled={!selectedProvince || filteredLocations.length === 0}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Select --</option>
              {filteredLocations.map((l) => (
                <option key={l.location_id} value={l.location_id}>
                  {l.city_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <InputField
            id="new-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            error={passwordError}
            icon={<Lock className="w-4 h-4" />}
            placeholder="Create a strong password"
            onChange={(v) => {
              setPassword(v)
              if (passwordError) setPasswordError(validatePassword(v))
              if (confirmError && confirm) setConfirmError(validateConfirm(confirm, v))
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
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3"
            >
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{ backgroundColor: i <= strength.score ? strength.color : 'var(--border)' }}
                  />
                ))}
              </div>
              <p className="text-xs font-medium flex-shrink-0" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </motion.div>
          )}
        </div>

        <InputField
          id="confirm-password"
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          value={confirm}
          error={confirmError}
          icon={<Lock className="w-4 h-4" />}
          placeholder="Re-enter your password"
          onChange={(v) => { setConfirm(v); if (confirmError) setConfirmError(validateConfirm(v, password)) }}
          onBlur={() => setConfirmError(validateConfirm(confirm, password))}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Terms */}
        <div>
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setAgreedError(false) }}
                className="sr-only peer"
                id="terms"
              />
              <div className={`w-4 h-4 rounded border bg-card transition-colors duration-150 flex items-center justify-center ${agreedError ? 'border-destructive' : 'border-border'} peer-checked:bg-primary peer-checked:border-primary`}>
                {agreed && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5 8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-muted-foreground leading-snug">
              I agree to UniPath&apos;s{' '}
              <Link href="#" className="text-primary hover:underline font-medium">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" className="text-primary hover:underline font-medium">Privacy Policy</Link>
            </span>
          </label>
          <AnimatePresence>
            {agreedError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1.5 text-xs text-destructive flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                You must agree to the terms to continue
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || success}
          whileTap={{ scale: 0.985 }}
          className="w-full py-2.5 rounded-xl bg-[#F59E0B] text-[#0B1F3A] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#D97706] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#F59E0B]/20"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </motion.button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm text-muted-foreground mt-3">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
          Log In
        </Link>
      </p>
    </div>
  )
}