"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Calculator,
  BookMarked,
  GitCompare,
  BrainCircuit,
  ClipboardList,
  PenTool,
} from "lucide-react"

const features = [
  {
    icon: Calculator,
    title: "Merit Calculator",
    description:
      "Instantly calculate your aggregate merit for any university using FSc, matric, and entry test marks.",
    gradient: "from-[#F59E0B]/20 to-[#F59E0B]/5",
    iconColor: "#F59E0B",
  },
  {
    icon: BookMarked,
    title: "Scholarship Finder",
    description:
      "Discover scholarships matched to your profile — HEC, need-based, merit, and international awards.",
    gradient: "from-[#60A5FA]/20 to-[#60A5FA]/5",
    iconColor: "#60A5FA",
  },
  {
    icon: GitCompare,
    title: "University Comparison",
    description:
      "Compare universities side-by-side on fees, merit, ranking, programs, and scholarship availability.",
    gradient: "from-[#34D399]/20 to-[#34D399]/5",
    iconColor: "#34D399",
  },
  {
    icon: BrainCircuit,
    title: "AI Career Guidance",
    description:
      "AI-powered career path recommendations based on your aptitude, interests, and market demand.",
    gradient: "from-[#A78BFA]/20 to-[#A78BFA]/5",
    iconColor: "#A78BFA",
  },
  {
    icon: ClipboardList,
    title: "Admission Tracking",
    description:
      "Track all your applications, deadlines, documents, and status updates in one premium dashboard.",
    gradient: "from-[#F472B6]/20 to-[#F472B6]/5",
    iconColor: "#F472B6",
  },
  {
    icon: PenTool,
    title: "Entry Test Prep",
    description:
      "MDCAT, ECAT, and NET preparation with AI-curated practice tests, past papers, and analytics.",
    gradient: "from-[#FB923C]/20 to-[#FB923C]/5",
    iconColor: "#FB923C",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="features"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Subtle background decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #1E3A8A 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#F59E0B",
            }}
          >
            Everything You Need
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Powerful Tools for Your
            <br />
            <span className="gold-text">Admission Journey</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            From calculating your merit to tracking applications — UniPath gives you every tool to navigate university admissions with confidence.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="group relative p-6 rounded-2xl cursor-pointer"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${feat.iconColor}10, transparent 60%)`,
                }}
              />

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feat.gradient}`}
              >
                <feat.icon className="w-6 h-6" style={{ color: feat.iconColor }} />
              </div>

              {/* Text */}
              <h3
                className="text-lg font-semibold text-foreground mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {feat.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right, transparent, ${feat.iconColor}40, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
