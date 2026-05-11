"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, BrainCircuit, Sparkles, ChevronRight } from "lucide-react"

/* ---------- Knowledge Base ---------- */
interface BotEntry {
  response: string
  related: string[]
}

const knowledgeBase: Record<string, BotEntry> = {
  "Best CS universities": {
    response:
      "Top CS universities in Pakistan: NUST (#1), LUMS (#2), FAST-NU (#3), COMSATS, ITU Lahore. NUST offers 4-yr BE CS with entry test. LUMS has BSc CS without entry test. Want merit details for any specific one?",
    related: ["NUST merit details", "LUMS admission process", "FAST-NU fee structure", "Compare NUST vs LUMS"],
  },
  "Check my merit": {
    response:
      "To calculate your merit I need three things: your Matric %, FSc %, and Entry Test score. Each university uses a different formula. Share your marks and I'll calculate instantly!",
    related: ["NUST merit formula", "MDCAT merit formula", "What is aggregate formula?", "Merit calculator tool"],
  },
  "Find scholarships": {
    response:
      "Based on your profile, top scholarships: HEC Need-Based (full tuition, deadline Jun 15), Ihsan Trust Merit Award (PKR 3L/yr), Punjab Educational Endowment (PKR 1.5L). Want eligibility criteria?",
    related: ["HEC scholarship eligibility", "Need-based vs merit scholarship", "International scholarships", "Scholarship deadlines 2026"],
  },
  "MDCAT prep tips": {
    response:
      "Top MDCAT tips: Biology 40%, Chemistry 30%, Physics 20%, English 10%. Practice 3+ past papers daily. Focus on PMC syllabus. Mock tests weekly. Want a personalized study plan?",
    related: ["MDCAT syllabus 2026", "Best MDCAT books", "ECAT preparation tips", "Entry test dates 2026"],
  },
  "NUST merit details": {
    response:
      "NUST Merit Formula: NET 75% + FSc 15% + Matric 10%. Minimum merit for CS: ~900/1200. NET is held 3 times per year. Registration opens March. Want to calculate your NUST merit?",
    related: ["NUST NET registration", "NUST programs list", "NUST fee structure", "Check my merit"],
  },
  "LUMS admission process": {
    response:
      "LUMS does NOT require entry test for most programs. Selection based on: SAT/ACT score, A-levels/FSc marks, interview, and essay. Applications open October. LUMS National Outreach Program for financial aid.",
    related: ["LUMS fee structure", "LUMS scholarships", "SAT preparation tips", "Best CS universities"],
  },
  "Merit calculator tool": {
    response:
      "You can use our built-in Merit Calculator on the Merit Calculator page. Enter your Matric %, FSc %, and entry test score to get your aggregate for any university instantly!",
    related: ["Check my merit", "NUST merit details", "MDCAT merit formula", "Admission predictor"],
  },
  "Admission predictor": {
    response:
      "Our AI Admission Predictor analyzes your marks, entry test score, and location to predict your chances at multiple universities. Head to the Admission Predictor page for a full analysis!",
    related: ["Check my merit", "Best CS universities", "Merit calculator tool", "Find scholarships"],
  },
}

const defaultRelated = ["Best CS universities", "Check my merit", "Find scholarships", "Admission predictor"]

interface Message {
  id: number
  text: string
  from: "bot" | "user"
  related?: string[]
}

export function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi! I'm your UniPath AI Assistant. Ask me anything about admissions, scholarships, or merit calculations.",
      from: "bot",
      related: defaultRelated,
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }
  }, [messages, open])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { id: Date.now(), text, from: "user" }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setTyping(true)

    setTimeout(() => {
      const entry = knowledgeBase[text]
      const response = entry?.response
        ?? "Great question! I'm connecting you to our knowledge base. For detailed guidance, our counselors are available Mon–Sat 9AM–6PM. Try one of the suggested questions below."
      const related = entry?.related ?? defaultRelated

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: response, from: "bot", related },
      ])
      setTyping(false)
    }, 1100)
  }

  // Get last bot message's related suggestions
  const lastBotMsg = [...messages].reverse().find((m) => m.from === "bot")
  const suggestions = lastBotMsg?.related ?? defaultRelated

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #1E3A8A, #0B1F3A)",
          boxShadow: "0 8px 32px rgba(30,58,138,0.45)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <BrainCircuit className="w-6 h-6 text-[#F59E0B]" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid rgba(245,158,11,0.4)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[390px] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              background: "rgba(6,14,28,0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              height: 560,
              maxHeight: "82svh",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1E3A8A, #0B1F3A)" }}
              >
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
                  UniPath AI
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-white/40 text-xs">Online — Always here to help</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={
                      msg.from === "user"
                        ? {
                            background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
                            color: "#fff",
                            borderBottomRightRadius: 4,
                          }
                        : {
                            background: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.85)",
                            borderBottomLeftRadius: 4,
                          }
                    }
                  >
                    {msg.text}
                  </div>

                  {/* Related questions shown under bot messages */}
                  {msg.from === "bot" && msg.related && msg.id === (lastBotMsg?.id ?? -1) && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      className="mt-2 flex flex-col gap-1.5 w-full max-w-[85%]"
                    >
                      <p className="text-white/30 text-[10px] uppercase tracking-widest px-1 mb-0.5">Related Questions</p>
                      {msg.related.map((q) => (
                        <motion.button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="flex items-center gap-2 text-left text-xs px-3 py-2 rounded-xl transition-colors duration-150 w-full"
                          style={{
                            background: "rgba(245,158,11,0.06)",
                            border: "1px solid rgba(245,158,11,0.15)",
                            color: "rgba(245,158,11,0.85)",
                          }}
                          whileHover={{ background: "rgba(245,158,11,0.12)", x: 2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ChevronRight className="w-3 h-3 flex-shrink-0" />
                          {q}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex justify-start"
                  >
                    <div
                      className="flex items-center gap-1 px-4 py-3 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.07)", borderBottomLeftRadius: 4 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask about admissions, merit, scholarships..."
                className="flex-1 px-4 py-2.5 rounded-full text-sm text-white/85 placeholder:text-white/30 outline-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <motion.button
                onClick={() => sendMessage(input)}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-[#0B1F3A]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
