"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlayCircle, X, ChevronRight } from "lucide-react"

export function DemoNarrative() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  let title = "Apex Capital Overview"
  let say = "Apex Capital is an agentic VC analyst OS that turns raw startup inputs into a structured investment workflow. It evaluates the company, creates a VC scorecard, separates thesis quality from evidence quality, reviews pitch deck claims, builds a diligence plan, tracks IC readiness, and produces an investment memo and IC one-pager."
  let pointOut = ["The modular architecture", "The separation of thesis vs evidence"]
  let matters = "It shows that AI in VC isn't just a chatbot; it's a structured, deterministic operating system."

  if (pathname === '/' || pathname === '/dashboard') {
    title = "Dashboard"
    say = "This is the fund-level command center. It shows deal flow, evidence quality, IC readiness, risks, and portfolio-level signals."
    pointOut = ["The Active Pipeline", "The global metrics"]
    matters = "Proves this is a portfolio orchestration tool, not just a single-deal analyzer."
  } else if (pathname.includes('')) {
    title = "Deal Room"
    say = "This is the command center for one startup. It brings together thesis, scorecard, research, deck evidence, diligence, fund fit, memo, and IC readiness."
    pointOut = ["The Deal Health Summary", "The Next Best Action routing", "The Investor Judgment card"]
    matters = "It provides a centralized source of truth for an analyst looking at a specific company."
  } else if (pathname.includes('/research')) {
    title = "Research Intelligence"
    say = "This layer separates thesis quality from evidence quality. It checks market attractiveness, customer personas, TAM/SAM/SOM, competition, pricing, GTM, and source confidence."
    pointOut = ["The Evidence Grader", "The TAM/SAM/SOM model"]
    matters = "It shows we don't blindly trust the founder's deck. We grade the evidence independently."
  } else if (pathname.includes('/deck')) {
    title = "Deck Intelligence"
    say = "This layer does not accept the pitch deck at face value. It extracts claims, unsupported statements, missing sections, and deck quality."
    pointOut = ["Unsupported Claims", "Missing Diligence areas"]
    matters = "Demonstrates the AI acting as an adversarial thinker, finding the holes in the narrative."
  } else if (pathname.includes('/diligence')) {
    title = "Diligence Command Center"
    say = "This converts risks and unsupported claims into tasks, founder follow-ups, customer reference questions, and data room requests."
    pointOut = ["Founder Follow-ups tied to specific risks"]
    matters = "Automates the most tedious and high-leverage part of an analyst's job—preparing for the founder meeting."
  } else if (pathname.includes('/fund-fit')) {
    title = "Fund Fit"
    say = "This checks whether the deal can actually matter for the fund based on ownership, exit valuation, reserve strategy, and thesis fit."
    pointOut = ["The Power Law simulation", "Required ownership percentages"]
    matters = "Elevates the app from a simple deal analysis tool to a true fund portfolio construction engine."
  } else if (pathname.includes('/memo')) {
    title = "Investment Memo"
    say = "This is the structured investment memo generated only after analysis, research, deck review, diligence, and fund fit are processed."
    pointOut = ["The exhaustive, structured layout", "The Investor Judgment summary"]
    matters = "Proves the memo is evidence-backed and synthesize, not just a hallucinated LLM summary."
  } else if (pathname.includes('/ic-one-pager')) {
    title = "IC One-Pager"
    say = "This is the partner-ready one-pager for investment committee discussion."
    pointOut = ["The crisp recommendation", "The tight layout"]
    matters = "Shows an understanding of how VC partners actually consume information—fast and highly structured."
  }

  const copyPitch = () => {
    navigator.clipboard.writeText("Apex Capital is an agentic VC analyst OS that turns raw startup inputs into a structured investment workflow. It evaluates the company, creates a VC scorecard, separates thesis quality from evidence quality, reviews pitch deck claims, builds a diligence plan, tracks IC readiness, and produces an investment memo and IC one-pager.")
    alert("30-Second Pitch copied to clipboard!")
  }

  return (
    <>
      <Button variant="outline" size="sm" className="hidden md:flex items-center text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" onClick={() => setOpen(true)}>
        <PlayCircle className="mr-2 h-4 w-4" /> Show Demo Notes
      </Button>
      
      {open && (
        <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-background border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold">Interview Demo Notes</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div>
              <div className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold uppercase mb-2">
                Current View: {title}
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">What to say</h3>
              <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
                <p className="italic text-foreground text-sm">"{say}"</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">What to point out</h3>
              <ul className="space-y-2">
                {pointOut.map((pt, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5 mr-1" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Why it matters</h3>
              <p className="text-sm text-foreground/90">{matters}</p>
            </div>
            
            <div className="pt-6 border-t">
              <Button onClick={copyPitch} variant="secondary" className="w-full">
                Copy 30-Second Pitch
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
