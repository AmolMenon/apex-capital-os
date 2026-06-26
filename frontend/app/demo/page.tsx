"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Presentation, 
  LayoutDashboard, 
  Briefcase, 
  FileSearch, 
  Files, 
  ClipboardCheck, 
  FileText, 
  FileSignature, 
  Network,
  Activity,
  Database,
  CheckCircle,
  RefreshCw,
  Play
} from "lucide-react"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"

export default function DemoPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isClient, setIsClient] = useState(false)
  const demoDealId = 1

  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem("apex_demo_progress")
    if (stored) {
      try {
        setCompletedSteps(JSON.parse(stored))
      } catch (e) { }
    }
  }, [])

  const markCompleted = (index: number) => {
    const next = [...new Set([...completedSteps, index])]
    setCompletedSteps(next)
    localStorage.setItem("apex_demo_progress", JSON.stringify(next))
  }

  const resetDemo = () => {
    setCompletedSteps([])
    localStorage.removeItem("apex_demo_progress")
  }

  const steps = [
    {
      icon: <LayoutDashboard className="w-5 h-5 text-primary" />,
      title: "1. Dashboard",
      say: "This is the command center. It gives us a fund-level view of our deal pipeline, active diligence risks, and power-law potential.",
      pointOut: "The 'Active Pipeline' table showing deals with their Apex Score and status.",
      matters: "It shows that Apex isn't just a memo writer, it's a pipeline orchestration tool.",
      actionLabel: "Open Dashboard",
      actionHref: "/"
    },
    {
      icon: <Database className="w-5 h-5 text-primary" />,
      title: "2. Pipeline",
      say: "Here we can see all structured data across our CRM. We're going to dive into NeuralDesk, our flagship Series A deal.",
      pointOut: "The list of seed data companies and the new Completion Score tracking.",
      matters: "Proves that the system stores structured data and knows exactly what needs to be done next.",
      actionLabel: "Open Pipeline",
      actionHref: "/pipeline"
    },
    {
      icon: <Briefcase className="w-5 h-5 text-primary" />,
      title: "3. Deal Room",
      say: "This is the command center for a single startup. The 'Next Best Action' and 'Deal Health Summary' tell me exactly what state the deal is in.",
      pointOut: "The 'Next Best Action' card guiding the analyst, and the 'Pre-IC Checklist'.",
      matters: "It forces the user to check evidence before making an investment decision, providing deterministic guardrails alongside AI.",
      actionLabel: "Open Deal Room",
      actionHref: `/deal/${demoDealId}/deal-room`
    },
    {
      icon: <FileSearch className="w-5 h-5 text-primary" />,
      title: "4. Research Intelligence",
      say: "Before writing the memo, Apex automatically conducts market research. It models TAM/SAM/SOM, builds customer personas, and analyzes competitor intensity.",
      pointOut: "The Evidence Grader and the separation between 'Thesis' and 'Evidence'.",
      matters: "It shows we don't blindly trust the founder's deck. We grade the evidence independently.",
      actionLabel: "Open Research Brief",
      actionHref: `/deal/${demoDealId}/research`
    },
    {
      icon: <Files className="w-5 h-5 text-primary" />,
      title: "5. Deck Intelligence",
      say: "Next, we run the founder's pitch deck through our extraction engine. It pulls out key claims, financials, and explicitly flags what is missing.",
      pointOut: "The 'Unsupported Claims' section needing verification.",
      matters: "It shows the AI acting as an adversarial thinker, not just a summarizer.",
      actionLabel: "Open Deck Intelligence",
      actionHref: `/deal/${demoDealId}/deck`
    },
    {
      icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
      title: "6. Diligence Command Center",
      say: "Apex converts all the open risks and unsupported claims into an actionable diligence plan. It prepares the data room requests, founder questions, and customer reference questions for us.",
      pointOut: "The specific 'Founder Follow-ups' mapped directly to risks identified earlier.",
      matters: "It automates the most tedious part of VC analyst work—preparing for diligence calls.",
      actionLabel: "Open Diligence Command Center",
      actionHref: `/deal/${demoDealId}/diligence`
    },
    {
      icon: <Activity className="w-5 h-5 text-primary" />,
      title: "7. Fund Strategy & Fit",
      say: "A good deal isn't enough; it has to fit the fund. The fund strategy engine simulates power-law outcomes, calculates our required target ownership, and checks our reserves.",
      pointOut: "The Power Law Simulation chart and the Thesis Fit verdict.",
      matters: "It elevates the app from a 'deal tool' to a true 'portfolio management OS'.",
      actionLabel: "Open Fund Fit",
      actionHref: `/deal/${demoDealId}/fund-fit`
    },
    {
      icon: <FileText className="w-5 h-5 text-primary" />,
      title: "8. Investment Memo",
      say: "Only after analysis, research, deck review, diligence, and fund fit are complete does Apex generate the final investment memo.",
      pointOut: "The structured layout covering market opportunity, differentiation, and risks.",
      matters: "It proves the memo is evidence-backed, not just an LLM hallucinating a good story.",
      actionLabel: "Open Memo",
      actionHref: `/deal/${demoDealId}/memo`
    },
    {
      icon: <FileSignature className="w-5 h-5 text-primary" />,
      title: "9. IC One-Pager",
      say: "Finally, it synthesizes the entire deal into a one-page tear sheet for the Monday partner meeting.",
      pointOut: "The 'Final Call' and the 'Diligence Required' sections.",
      matters: "It shows an understanding of how VC firms actually consume information.",
      actionLabel: "Open IC One-Pager",
      actionHref: `/deal/${demoDealId}/ic-one-pager`
    },
    {
      icon: <Network className="w-5 h-5 text-primary" />,
      title: "10. Settings & Architecture",
      say: "Behind the scenes, Apex is completely model-agnostic. It routes different tasks to Gemini, Claude, or OpenAI based on cost and capability, with a deterministic Mock Mode fallback.",
      pointOut: "The 'AI Provider Router' configuration.",
      matters: "It demonstrates senior engineering architecture and future-proofing against model churn.",
      actionLabel: "View Settings",
      actionHref: "/settings"
    }
  ]

  if (!isClient) return null

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <Presentation className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Live Walkthrough Demo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Follow this guided path during your portfolio interview. Read the script, show the features, and explain why it matters.
        </p>
        
        <div className="pt-4 flex items-center justify-center gap-4">
          <div className="text-sm font-bold bg-muted px-4 py-2 rounded-full border">
            Progress: {completedSteps.length} of {steps.length} Steps
          </div>
          <Button variant="outline" size="sm" onClick={resetDemo}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Progress
          </Button>
        </div>
      </div>

      <PageHelpBanner 
        title="Interview Demo Mode" 
        explanation="This page tracks your demo progress. Check off steps as you present them to the interviewer."
        dismissible={false}
      />

      <div className="space-y-10 relative mt-8">
        {steps.map((step, index) => {
          const isDone = completedSteps.includes(index)
          return (
            <div key={index} className={`relative bg-card rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${isDone ? 'opacity-60 grayscale-[50%]' : 'ring-1 ring-primary/20'}`}>
              <div className={`border-b p-4 flex items-center justify-between ${isDone ? 'bg-muted' : 'bg-primary/5'}`}>
                <div className="flex items-center gap-3">
                  <div className="bg-background border rounded-md p-1.5 shadow-sm">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-xl">{step.title}</h3>
                </div>
                {isDone && <CheckCircle className="text-emerald-500 h-6 w-6" />}
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">What to say</h4>
                    <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                      <p className="italic text-foreground">"{step.say}"</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mt-4">
                    <Link href={step.actionHref} target="_blank">
                      <Button className="w-full shadow-sm" variant="default">
                        {step.actionLabel} <Play className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    {!isDone ? (
                      <Button onClick={() => markCompleted(index)} variant="outline" className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                        Mark as Completed <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button disabled variant="secondary" className="w-full">
                        Completed
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-6 border-t pt-6 md:border-t-0 md:pt-0 md:border-l md:pl-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">What to point out</h4>
                    <ul className="list-disc pl-4 text-sm text-foreground space-y-1 font-medium">
                      <li>{step.pointOut}</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Why it matters</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.matters}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
