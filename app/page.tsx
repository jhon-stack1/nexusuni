"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSlider } from "@/components/hero-slider"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorks } from "@/components/how-it-works"
import { AIChatbot } from "@/components/ai-chatbot"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("unipath-theme")
    if (stored !== null) setDark(stored === "dark")
  }, [])

  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev
      localStorage.setItem("unipath-theme", next ? "dark" : "light")
      return next
    })
  }

  return (
    <div className={dark ? "dark" : ""} style={{ minHeight: "100svh" }}>
      <div
        className="relative"
        style={{
          background: dark ? "#060E1C" : "#F9FAFB",
          minHeight: "100svh",
        }}
      >
        <Navbar dark={dark} toggleDark={toggleDark} />

        {/* Hero: full dark navy */}
        <div style={{ background: "#060E1C" }}>
          <HeroSlider />
        </div>

        {/* Features */}
        <FeaturesSection />

        {/* How It Works + Trusted By */}
        <HowItWorks />

        <SiteFooter />

        {/* Floating AI chatbot */}
        <AIChatbot />
      </div>
    </div>
  )
}
