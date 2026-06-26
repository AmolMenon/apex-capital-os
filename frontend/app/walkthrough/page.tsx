"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Presentation, ArrowRight, ArrowLeft, Copy, Check } from "lucide-react"

export default function WalkthroughPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [copied, setCopied] = useState(false)

  const steps = [
    {
      title: "1. The VC OS Vision",
      script: "This is Apex Capital, an agentic VC analyst OS. The goal is not to replace investment judgment, but to structure the analyst workflow from first look to IC readiness. It brings data aggregation, diligence processing, and recommendation drafting into a single pane of glass.",
      action: "/command-center",
      actionText: "Open Command Center"
    },
    {
      title: "2. Real Startup Benchmarks",
      script: "To test the system without uploading confidential data, I seeded the database with real, recently funded startups like Sarvam AI, Zepto, and Mistral AI. This allows us to run live evaluations using public web research.",
      action: "/real-benchmarks",
      actionText: "Open Benchmarks"
    },
    {
      title: "3. Agentic Workflow Engine",
      script: "When we evaluate a deal like Sarvam AI, we trigger an Agentic Workflow. This isn't a single prompt. It's a sequential 12-agent loop. The 'Market Sizer' finds the TAM, the 'Financial Auditor' extracts metrics, and the 'Red Team' actively tries to kill the deal.",
      action: "/deals/1000/agent-workflow",
      actionText: "View Agent Timeline"
    },
    {
      title: "4. The Skeptical Red Team",
      script: "A key part of the workflow is the Red Team Room. This agent takes all the positive evidence and attacks it, generating skeptical partner pushback and highlighting hype risks or missing private data.",
      action: "/deals/1000/red-team",
      actionText: "Open Red Team Room"
    },
    {
      title: "5. Decision Engine & Fund Fit",
      script: "The Decision Engine synthesizes the findings and caps recommendations. If evidence is missing, it won't allow a 'Strong Yes'. The Fund Fit engine then calculates if the deal matches our mandate and power-law return models.",
      action: "/deals/1000/decision",
      actionText: "View Decision Engine"
    },
    {
      title: "6. Deal War Room",
      script: "Now we enter the Autonomous Deal War Room. Here the system calculates conviction, simulates the IC debate with partner personas, and determines exactly what evidence is still required to get to a Yes.",
      action: "/deals/1000/war-room",
      actionText: "Enter War Room"
    },
    {
      title: "7. Compiled IC Packet",
      script: "Finally, all of this is compiled into an Investment Committee (IC) Packet. Instead of starting from a blank page, the analyst starts with a heavily structured, source-backed first draft of the deal memo.",
      action: "/deals/1000/ic-packet",
      actionText: "View IC Packet"
    },
    {
      title: "8. Mock vs. Real Mode",
      script: "The system is built to never break. If an API key is missing or an LLM call fails, it automatically degrades to a deterministic mock fallback, ensuring the user can always complete a demo.",
      action: "/system-status",
      actionText: "Check System Status"
    }
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 pt-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Presentation className="w-8 h-8 text-indigo-600" /> Investor Walkthrough
        </h1>
        <p className="text-muted-foreground mt-2">A guided narrative for demonstrating Apex Capital.</p>
      </div>

      <Card className="border-indigo-200 shadow-md">
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-800">{steps[currentStep].title}</h2>
            <div className="text-sm font-semibold text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border text-lg leading-relaxed text-slate-700 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
              onClick={() => handleCopy(steps[currentStep].script)}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            "{steps[currentStep].script}"
          </div>

          <div className="flex justify-center py-4">
            <Link href={steps[currentStep].action}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg">
                {steps[currentStep].actionText}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-4">
        <Button 
          variant="outline" 
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(prev => prev - 1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous Step
        </Button>

        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full ${i === currentStep ? 'bg-indigo-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <Button 
          variant="outline" 
          disabled={currentStep === steps.length - 1}
          onClick={() => setCurrentStep(prev => prev + 1)}
        >
          Next Step <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
