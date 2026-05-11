"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MapPin, TrendingUp, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

const recommendations = [
  { uni: "COMSATS", match: 94, program: "BSCS", location: "Islamabad", tag: "Best Match", color: "#F59E0B" },
  { uni: "ITU", match: 89, program: "BSc AI", location: "Lahore", tag: "Rising Star", color: "#60A5FA" },
  { uni: "UCP", match: 83, program: "BSCS", location: "Lahore", tag: "Great Value", color: "#34D399" },
  { uni: "NUST", match: 91, program: "BSCE", location: "Islamabad", tag: "Top Ranked", color: "#A78BFA" },
  { uni: "LUMS", match: 87, program: "BSc CS", location: "Lahore", tag: "Elite", color: "#F472B6" },
  { uni: "FAST-NU", match: 85, program: "BSCS", location: "Karachi", tag: "Popular", color: "#FB923C" },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function DashboardSections() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}>
      <section className="py-24 md:py-28" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="mb-12"
          >
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B" }}
            >
              For You
            </span>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>
                Personalized <span className="gold-text">Recommendations</span>
              </h2>
              <Link href="/admissions">
                <motion.span
                  className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                  style={{ color: "#F59E0B" }}
                  whileHover={{ x: 3 }}
                >
                  View All Universities
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </div>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((r, i) => (
              <motion.div
                key={r.uni}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group p-6 rounded-2xl cursor-pointer relative overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: `1px solid var(--border)`,
                  boxShadow: i === 0 ? "0 0 0 2px rgba(245,158,11,0.18)" : "none",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${r.color}12, transparent 65%)` }}
                />

                {/* Top badge */}
                {i === 0 && (
                  <div
                    className="absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}
                  >
                    Top Pick
                  </div>
                )}

                {/* University avatar + name */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${r.color}80, ${r.color}30)`,
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "15px",
                    }}
                  >
                    {r.uni.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>{r.uni}</p>
                    <p className="text-xs text-muted-foreground">{r.program}</p>
                  </div>
                </div>

                {/* Match score bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground font-medium">Match Score</span>
                    <span className="font-bold" style={{ color: r.color }}>{r.match}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${r.match}%` } : {}}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(to right, #1E3A8A, ${r.color})` }}
                    />
                  </div>
                </div>

                {/* Location + tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {r.location}
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}25` }}
                  >
                    {r.tag}
                  </span>
                </div>

                {/* Bottom hover line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to right, transparent, ${r.color}, transparent)` }}
                />
              </motion.div>
            ))}
          </div>

          {/* CTA Row */}
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            custom={7}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/admission-predictor">
              <motion.span
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #F59E0B, #D97706)",
                  color: "#0B1F3A",
                  fontFamily: "Poppins, sans-serif",
                }}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(245,158,11,0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                <TrendingUp className="w-4 h-4" />
                Predict My Admission Chances
              </motion.span>
            </Link>
            <Link href="/merit-calculator">
              <motion.span
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm cursor-pointer text-foreground"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  fontFamily: "Poppins, sans-serif",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Star className="w-4 h-4 text-[#F59E0B]" />
                Calculate My Merit
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
