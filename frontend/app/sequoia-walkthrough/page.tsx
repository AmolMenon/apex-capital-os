"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Presentation, ArrowRight, ArrowLeft, Copy, CheckCircle, PlayCircle } from "lucide-react"

const slides = [
  {
    title: "1. What is Apex?",
    talkingPoint: "Apex Capital is an AI-native VC analyst operating system. The goal is not to replace investment judgment, but to structure the path from first look to IC readiness with source-backed evidence, diligence gaps, partner objections, fund math, and decision gates.",
    actionLink: "/command-center",
    actionText: "Open VC Analyst Home"
  },
  {
    title: "2. Why This Exists",
    talkingPoint: "Venture capital is still running on scattered notes, disconnected CRMs, and ad-hoc gut checks. Analysts spend 80% of their time aggregating public signals and formatting IC memos instead of actually thinking about the risks.",
    actionLink: null,
    actionText: null
  },
  {
    title: "3. Why Current AI Tools Aren't Enough",
    talkingPoint: "Generic AI wrappers just summarize pitch decks or hallucinate metrics based on marketing copy. They don't understand the difference between a public signal, a founder's claim, and an actual verified diligence fact.",
    actionLink: null,
    actionText: null
  },
  {
    title: "4. What Apex Does Differently",
    talkingPoint: "Apex enforces a strict workflow. It separates hype from evidence, forces a Red Team critique, simulates partner debate, runs actual fund math, and caps recommendations if private metrics are missing.",
    actionLink: null,
    actionText: null
  },
  {
    title: "5. Real Startup Benchmarks",
    talkingPoint: "To prove this isn't just theoretical, we loaded real companies like Sarvam AI and Zepto. Apex analyzes their public footprint to establish a benchmark of what we know and what we don't know.",
    actionLink: "/real-benchmarks",
    actionText: "Open Real Benchmarks"
  },
  {
    title: "6. Source-Backed Web Research",
    talkingPoint: "Instead of asking ChatGPT 'Is Sarvam AI good?', Apex runs a targeted scraping workflow to extract specific claims, identify source conflicts, and grade the quality of the public footprint.",
    actionLink: "/deals/active/web-research",
    actionText: "Open Web Research"
  },
  {
    title: "7. Agentic Research Workflow",
    talkingPoint: "We deploy 12 specialized agents—Market Analyst, Tech Evaluator, Financial Modeler—that work in parallel to build a comprehensive profile, mimicking how a deal team divides work.",
    actionLink: "/deals/active/agent-workflow",
    actionText: "Open Agent Workflow"
  },
  {
    title: "8. The Evidence Center",
    talkingPoint: "This is the core of defensibility. Apex maps every claim to its source. Crucially, it highlights 'Unknown Private Metrics'—things like churn or gross margins that we must ask the founder about.",
    actionLink: "/deals/active/evidence-center",
    actionText: "Open Evidence Center"
  },
  {
    title: "9. Red Team Critique",
    talkingPoint: "We intentionally prompt an AI agent to destroy the thesis. It identifies the strongest case against the deal so we aren't blindsided in the partner meeting.",
    actionLink: "/deals/active/red-team",
    actionText: "Open Red Team Room"
  },
  {
    title: "10. The Deal Deal Sync",
    talkingPoint: "This is where all research synthesizes. It calculates a conviction score, maps what must be true for this to be a fund returner, and sets clear 'change our mind' conditions.",
    actionLink: "/deals/active/deal-sync",
    actionText: "Open Deal Deal Sync"
  },
  {
    title: "11. Partner Personas",
    talkingPoint: "Before the IC meeting, Apex simulates the specific questions different types of partners (the financial modeler, the skeptic, the technical expert) will ask so the analyst can prepare.",
    actionLink: "/deals/active/partner-review",
    actionText: "Open Partner Personas"
  },
  {
    title: "12. IC Simulation",
    talkingPoint: "We simulate the actual debate. The engine generates a bull case, a bear case, and a simulated vote based on the strength of the evidence.",
    actionLink: "/deals/active/ic",
    actionText: "Open IC Simulation"
  },
  {
    title: "13. Fund Math & Ownership",
    talkingPoint: "A great company isn't always a great investment. We run sensitivity on entry valuation, dilution, and check size to see if the math supports returning the fund.",
    actionLink: "/deals/active/fund-fit",
    actionText: "Open Fund Math"
  },
  {
    title: "14. Deterministic Decision Engine",
    talkingPoint: "The final decision is gated. For public benchmarks like Sarvam, the engine is hardcoded to NEVER recommend 'Invest'. It will only recommend 'Deeper Diligence Required' until private data is provided.",
    actionLink: "/deals/active/decision",
    actionText: "Open Decision Engine"
  },
  {
    title: "15. The IC Packet",
    talkingPoint: "Finally, everything compiles into a polished, printable IC Packet that an analyst could theoretically hand to a partner tomorrow.",
    actionLink: "/deals/active/ic-packet",
    actionText: "Open IC Packet"
  },
  {
    title: "16. The Analyst Assistant",
    talkingPoint: "This is the flagship feature. Partners, founders, or analysts can ask natural language questions about any deal, and the Assistant answers using only grounded evidence from the Deal Sync and Data Center. No hallucinated metrics.",
    actionLink: "/deals/active/assistant",
    actionText: "Open Deal Assistant"
  },
  {
    title: "17. Mock vs Real Mode",
    talkingPoint: "For this demo, we're using deterministic mock fixtures to guarantee stability. But with an API key, this entire engine runs live against Gemini or Claude.",
    actionLink: "/demo-control-center",
    actionText: "Open Demo Control Center"
  },
  {
    title: "18. What I Would Build Next",
    talkingPoint: "If I were building this inside a fund, I'd integrate it directly with the email inbox, add automated data room parsing, and fine-tune the IC simulation on past deal memos.",
    actionLink: null,
    actionText: null
  },
  {
    title: "19. Feedback",
    talkingPoint: "What would make this useful inside a real fund?",
    actionLink: null,
    actionText: null
  }
]

export default function SequoiaWalkthroughPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [copied, setCopied] = useState(false)

  const slide = slides[currentSlide]

  const copyText = () => {
    navigator.clipboard.writeText(slide.talkingPoint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const next = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1)
  }

  const prev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 pt-8">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">CONFIDENTIAL WALKTHROUGH</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight">Partner Presentation</h1>
        <p className="text-muted-foreground">Guided narrative for demonstrating the Apex OS.</p>
      </div>

      <Card className="border-2 border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{slide.title}</h2>
          <div className="text-slate-400 font-mono text-sm">{currentSlide + 1} / {slides.length}</div>
        </div>
        <CardContent className="p-8 space-y-8">
          
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-lg relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-lg"></div>
            <p className="text-xl leading-relaxed text-indigo-950 font-medium">"{slide.talkingPoint}"</p>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={copyText} className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100">
                {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Talking Point"}
              </Button>
            </div>
          </div>

          <div className="flex justify-center py-4">
            {slide.actionLink ? (
              <Link href={slide.actionLink} target="_blank">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                  <PlayCircle className="w-5 h-5 mr-2" /> {slide.actionText}
                </Button>
              </Link>
            ) : (
              <div className="h-11"></div> // placeholder
            )}
          </div>

        </CardContent>
        <div className="bg-slate-50 p-4 border-t flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={currentSlide === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-6 bg-indigo-600" : "w-2 bg-slate-200"}`} />
            ))}
          </div>
          <Button onClick={next} disabled={currentSlide === slides.length - 1} className="bg-indigo-600 hover:bg-indigo-700">
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
