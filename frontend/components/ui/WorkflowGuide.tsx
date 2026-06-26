"use client"

import { Deal } from "@/types"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WorkflowGuideProps {
  deal?: Deal
  hasFundFit?: boolean
}

export function WorkflowGuide({ deal, hasFundFit = false }: WorkflowGuideProps) {
  const steps = [
    {
      id: 1,
      title: "Deal Intake",
      explanation: "Add the startup’s basic company, founder, market, traction, and fundraising details.",
      status: deal ? "Completed" : "Not Started",
      actionLabel: "New Deal",
      actionHref: "/new"
    },
    {
      id: 2,
      title: "Deal Analysis",
      explanation: "Generate the first structured investment view: scorecard, thesis, risks, and recommendation.",
      status: deal?.analysis ? "Completed" : (deal ? "Ready" : "Not Started"),
      actionLabel: "Generate Analysis",
      actionHref: deal ? `/deal/${deal.id}/deal-room` : "#"
    },
    {
      id: 3,
      title: "Deal Room",
      explanation: "Use this as the central command center for the startup.",
      status: deal?.analysis ? "Completed" : "Not Started",
      actionLabel: "Open Deal Room",
      actionHref: deal ? `/deal/${deal.id}/deal-room` : "#"
    },
    {
      id: 4,
      title: "Research Intelligence",
      explanation: "Validate market, customer, competitor, pricing, GTM, and evidence quality.",
      status: deal?.analysis ? "Completed" : (deal?.analysis ? "Ready" : "Not Started"),
      actionLabel: "Generate Research Brief",
      actionHref: deal ? `/deal/${deal.id}/research` : "#"
    },
    {
      id: 5,
      title: "Deck Intelligence",
      explanation: "Upload or paste the pitch deck to extract claims and missing information.",
      status: deal?.analysis ? "Completed" : (deal?.analysis ? "Ready" : "Not Started"),
      actionLabel: "Analyze Deck",
      actionHref: deal ? `/deal/${deal.id}/deck` : "#"
    },
    {
      id: 6,
      title: "Diligence",
      explanation: "Convert risks and unsupported claims into diligence tasks, founder questions, customer references, and data room requests.",
      status: deal?.analysis ? "Completed" : (deal?.analysis ? "Ready" : "Not Started"),
      actionLabel: "Generate Diligence Plan",
      actionHref: deal ? `/deal/${deal.id}/diligence` : "#"
    },
    {
      id: 7,
      title: "Fund Fit",
      explanation: "Check whether this deal fits the fund strategy and can return meaningful capital.",
      status: hasFundFit ? "Completed" : (deal?.analysis ? "Ready" : "Not Started"),
      actionLabel: "Open Fund Fit",
      actionHref: deal ? `/deal/${deal.id}/fund-fit` : "#"
    },
    {
      id: 8,
      title: "Memo",
      explanation: "Review the full investment memo.",
      status: deal?.analysis?.memo ? "Completed" : (hasFundFit ? "Ready" : "Not Started"),
      actionLabel: "Open Memo",
      actionHref: deal ? `/deal/${deal.id}/memo` : "#"
    },
    {
      id: 9,
      title: "IC One-Pager",
      explanation: "Review the partner-ready one-page IC summary.",
      status: deal?.analysis?.ic_one_pager ? "Completed" : (deal?.analysis?.memo ? "Ready" : "Not Started"),
      actionLabel: "Open IC One-Pager",
      actionHref: deal ? `/deal/${deal.id}/ic-one-pager` : "#"
    },
    {
      id: 10,
      title: "Decision",
      explanation: "Move the deal to Watchlist, Diligence, Invested, Passed, or Revisit Later.",
      status: deal?.status !== "New" && deal?.analysis?.ic_one_pager ? "Ready" : "Not Started",
      actionLabel: "Update Status",
      actionHref: deal ? `/deal/${deal.id}/deal-room` : "#"
    }
  ]

  return (
    <div className="relative border-l-2 border-muted ml-4 space-y-8 py-4">
      {steps.map((step, idx) => {
        const isCompleted = step.status === "Completed"
        const isReady = step.status === "Ready"
        const isNotStarted = step.status === "Not Started"

        return (
          <div key={step.id} className="relative pl-8">
            <div className={cn(
              "absolute -left-[11px] top-1 h-5 w-5 rounded-full flex items-center justify-center bg-background",
              isCompleted && "text-primary",
              isReady && "text-blue-500",
              isNotStarted && "text-muted-foreground"
            )}>
              {isCompleted ? <CheckCircle className="h-5 w-5 bg-background" /> : <Circle className={cn("h-4 w-4 bg-background", isReady && "fill-blue-500/20 text-blue-500")} />}
            </div>
            
            <div className={cn(
              "rounded-lg border p-4 shadow-sm transition-all",
              isCompleted && "bg-card border-border/50 opacity-70 hover:opacity-100",
              isReady && "bg-primary/5 border-primary/30 shadow-md",
              isNotStarted && "bg-muted/30 border-dashed border-muted-foreground/30 opacity-60"
            )}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground">Step {step.id}</span>
                    <span className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      isCompleted && "bg-primary/10 text-primary",
                      isReady && "bg-blue-500/10 text-blue-600",
                      isNotStarted && "bg-muted text-muted-foreground"
                    )}>
                      {step.status}
                    </span>
                  </div>
                  <h4 className={cn("font-bold text-lg", isNotStarted ? "text-muted-foreground" : "text-foreground")}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    {step.explanation}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <Link href={step.actionHref}>
                    <Button 
                      variant={isReady ? "default" : "outline"} 
                      size="sm" 
                      disabled={isNotStarted && step.id !== 1}
                      className={cn(isReady && "shadow-sm")}
                    >
                      {step.actionLabel}
                      {isReady && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
