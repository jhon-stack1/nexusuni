"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ClipboardList, Calculator, TrendingUp, Award } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Enter Your Marks",
    description:
      "Input your Matric, FSc, and entry test scores into our smart form. Takes less than 60 seconds.",
    color: "#F59E0B",
    href: "/merit-calculator",
  },
  {
    step: "02",
    icon: Calculator,
    title: "Calculate Merit",
    description:
      "Our AI instantly computes your aggregate using each university's official formula with 100% accuracy.",
    color: "#60A5FA",
    href: "/merit-calculator",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Predict Admission Chances",
    description:
      "See your probability of admission at every target university — High, Moderate, or Low — at a glance.",
    color: "#34D399",
    href: "/admission-predictor",
  },
  {
    step: "04",
    icon: Award,
    title: "Find Scholarships",
    description:
      "Discover scholarships you qualify for based on your marks, location, and financial profile.",
    color: "#A78BFA",
    href: "/scholarships",
  },
]

const trustedBy = [
  "NUST", "LUMS", "FAST-NU", "COMSATS", "UET", "ITU", "UCP", "Bahria University",
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function HowItWorks() {
  const ref = useRef(null)
  const trustRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const trustInView = useInView(trustRef, { once: true, margin: "-60px" })

  return (
    <>
      {/* How It Works */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{ background: "var(--muted)", borderTop: "1px solid var(--border)" }}
        ref={ref}
      >
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] opacity-[0.035] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #F59E0B 0%, transparent 65%)", filter: "blur(80px)" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}
            >
              Simple Process
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Get Started in <span className="gold-text">4 Easy Steps</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              From your marks to your university shortlist — the entire journey takes under 5 minutes.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div
              className="absolute top-10 left-[12.5%] right-[12.5%] h-px hidden lg:block"
              style={{ background: "linear-gradient(to right, transparent, rgba(245,158,11,0.2), rgba(245,158,11,0.2), transparent)" }}
            />

            {steps.map((s, i) => (
              <Link href={s.href} key={s.title}>
                <motion.div
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-6 rounded-2xl cursor-pointer text-center"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top, ${s.color}10, transparent 65%)` }}
                  />

                  {/* Step number */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}
                  >
                    {s.step}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2"
                    style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}
                  >
                    <s.icon className="w-7 h-7" style={{ color: s.color }} />
                  </div>

                  <h3 className="font-bold text-foreground mb-2 text-base" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>

                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(to right, transparent, ${s.color}50, transparent)` }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section
        className="py-14"
        style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
        ref={trustRef}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={trustInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8"
          >
            Data from Pakistan&apos;s top universities
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {trustedBy.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                animate={trustInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
