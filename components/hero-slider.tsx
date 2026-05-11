"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const slides = [
  {
    id: 0,
    image: "/hero-1.jpg",
    badge: "AI-Powered Platform",
    heading: "Find Your Dream\nUniversity",
    subheading: "Discover the perfect university match with intelligent merit prediction and personalized recommendations.",
    cta: "Explore Universities",
    ctaHref: "/admissions",
    ctaSecondary: "Check Merit",
    ctaSecondaryHref: "/merit-list",
    accent: "#F59E0B",
  },
  {
    id: 1,
    image: "/hero-2.jpg",
    badge: "200+ Scholarships",
    heading: "Unlock Scholarship\nOpportunities",
    subheading: "Access thousands of scholarships tailored to your profile, grades, and financial needs.",
    cta: "Find Scholarships",
    ctaHref: "/scholarships",
    ctaSecondary: "Predict Chance",
    ctaSecondaryHref: "/admission-predictor",
    accent: "#60A5FA",
  },
  {
    id: 2,
    image: "/hero-3.jpg",
    badge: "Merit Calculator",
    heading: "Predict Your Merit\nInstantly",
    subheading: "Enter your marks and instantly know your chances at every top university in Pakistan.",
    cta: "Calculate Now",
    ctaHref: "/merit-calculator",
    ctaSecondary: "View Merit Lists",
    ctaSecondaryHref: "/merit-list",
    accent: "#34D399",
  },
  {
    id: 3,
    image: "/hero-4.jpg",
    badge: "AI Guidance",
    heading: "AI-Powered Admission\nGuidance",
    subheading: "Let our intelligent assistant guide your entire admission journey from application to acceptance.",
    cta: "Predict Admission",
    ctaHref: "/admission-predictor",
    ctaSecondary: "How It Works",
    ctaSecondaryHref: "/admissions",
    accent: "#A78BFA",
  },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
}

const statsData = [
  { value: "500+", label: "Universities" },
  { value: "200K+", label: "Students" },
  { value: "98%", label: "Success Rate" },
  { value: "5000+", label: "Scholarships" },
]

export function HeroSlider() {
  const [[current, direction], setSlide] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)

  const paginate = useCallback((dir: number) => {
    setSlide(([prev]) => {
      const next = (prev + dir + slides.length) % slides.length
      return [next, dir]
    })
  }, [])

  useEffect(() => {
    if (isPaused) return
    const id = setInterval(() => paginate(1), 5500)
    return () => clearInterval(id)
  }, [isPaused, paginate])

  const slide = slides[current]

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 600 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.75, ease: [0.77, 0, 0.175, 1] },
            opacity: { duration: 0.4 },
          }}
          className="absolute inset-0 will-change-transform"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.heading}
              fill
              className="object-cover"
              priority={current === 0}
              quality={90}
            />
            {/* Deep gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(6,14,28,0.92) 0%, rgba(11,31,58,0.75) 50%, rgba(11,31,58,0.35) 100%)",
              }}
            />
            {/* Bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-40"
              style={{
                background: "linear-gradient(to top, rgba(6,14,28,1) 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wider uppercase"
                  style={{
                    background: "rgba(245,158,11,0.15)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    color: "#F59E0B",
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  {slide.badge}
                </motion.div>

                {/* Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight text-white mb-5"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {slide.heading.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {i === 1 ? <span className="gold-text">{line}</span> : line}
                    </span>
                  ))}
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-lg"
                >
                  {slide.subheading}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.34, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-wrap gap-3"
                >
                  <Link href={slide.ctaHref}>
                    <motion.span
                      className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #F59E0B, #D97706)",
                        color: "#0B1F3A",
                        fontFamily: "Poppins, sans-serif",
                      }}
                      whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(245,158,11,0.35)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {slide.cta}
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </Link>

                  <Link href={slide.ctaSecondaryHref}>
                    <motion.span
                      className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all duration-200 cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        fontFamily: "Poppins, sans-serif",
                      }}
                      whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.14)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {slide.ctaSecondary}
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-px rounded-t-2xl overflow-hidden mb-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "none",
            }}
          >
            {statsData.map((stat, i) => (
              <div
                key={stat.label}
                className="flex-1 min-w-[80px] flex flex-col items-center justify-center py-4 px-2"
                style={{
                  borderRight: i < statsData.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  background: "rgba(11,31,58,0.5)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span className="text-xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {stat.value}
                </span>
                <span className="text-xs text-white/45 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-2">
        <motion.button
          onClick={() => paginate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={() => paginate(1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Slide Dots */}
      <div className="absolute bottom-24 right-6 z-20 flex flex-col gap-2 sm:flex-row sm:bottom-32 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setSlide([i, i > current ? 1 : -1])}
            className="relative overflow-hidden rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 6,
              height: 6,
              background: i === current ? "#F59E0B" : "rgba(255,255,255,0.25)",
            }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </section>
  )
}
