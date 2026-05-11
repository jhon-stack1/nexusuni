"use client"

import { GraduationCap, Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"

const footerLinks = {
  Platform: ["Merit Calculator", "Scholarship Finder", "University Comparison", "Admission Tracking"],
  Resources: ["Entry Test Prep", "Career Guidance", "Merit Lists 2026", "Past Papers"],
  Universities: ["NUST", "LUMS", "FAST-NU", "COMSATS", "UET", "UCP"],
  Company: ["About UniPath", "Contact Us", "Privacy Policy", "Terms of Service"],
}

export function SiteFooter() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #060E1C 0%, #0B1F3A 100%)",
        borderTop: "1px solid rgba(30,58,138,0.3)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1E3A8A, #0B1F3A)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <GraduationCap className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                Uni<span className="gold-text">Path</span>
              </span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              Pakistan&apos;s most intelligent university admission platform. Find your path to success.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-white/40">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
                hello@unipath.pk
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F59E0B]" />
                +92-300-UNIPATH
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                Lahore, Pakistan
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                className="text-white text-sm font-semibold mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-white/45 text-sm hover:text-white transition-colors duration-200"
                      whileHover={{ x: 3 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-white/30 text-xs">
            &copy; 2026 UniPath. All rights reserved. Built for Pakistan&apos;s future leaders.
          </p>
          <div className="flex items-center gap-1 text-white/25 text-xs">
            <span>Backend powered by</span>
            <span className="font-semibold text-white/40">Flask + Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
