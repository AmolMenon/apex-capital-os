"use client"

import { Deal } from "@/types"
import { CheckCircle2, Circle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DealWorkflowStatusBarProps {
  deal: Deal
}

export function DealWorkflowStatusBar({ deal }: DealWorkflowStatusBarProps) {
  const pathname = usePathname()
  
  // Logic to determine completion state of each step
  const steps = [
    {
      id: "intake",
      label: "Intake",
      path: "deal-room",
      isCompleted: true, // If we have a deal object, intake is done
      tooltip: "Deal details have been ingested.",
      action: ""
    },
    {
      id: "analysis",
      label: "Analysis",
      path: "deal-room",
      isCompleted: !!deal.analysis,
      tooltip: deal.analysis ? "Initial analysis generated." : "No analysis has been generated yet.",
      action: deal.analysis ? "" : "Generate initial analysis to score the startup."
    },
    {
      id: "research",
      label: "Research",
      path: "research",
      isCompleted: !!deal.analysis,
      tooltip: deal.analysis ? "Market and competitor research generated." : "No research brief available.",
      action: deal.analysis ? "" : "Generate research brief to validate claims."
    },
    {
      id: "deck",
      label: "Deck",
      path: "deck",
      isCompleted: !!deal.analysis,
      tooltip: deal.analysis ? "Pitch deck analyzed for unsupported claims." : "No pitch deck has been analyzed yet.",
      action: deal.analysis ? "" : "Upload or paste deck text to extract claims."
    },
    {
      id: "conversations",
      label: "Calls",
      path: "conversations",
      isCompleted: true, // Mocked as true
      tooltip: "Conversation transcripts analyzed.",
      action: ""
    },
    {
      id: "diligence",
      label: "Diligence",
      path: "diligence",
      isCompleted: !!deal.analysis,
      tooltip: deal.analysis ? "Diligence plan created." : "No diligence plan generated.",
      action: deal.analysis ? "" : "Generate diligence plan to resolve risks."
    },
    {
      id: "fund-fit",
      label: "Fund Fit",
      path: "fund-fit",
      isCompleted: true, // It's deterministic, maybe it just needs to be viewed? Let's say it's done if analysis exists
      tooltip: deal.analysis ? "Fund strategy simulation is available." : "Need analysis first.",
      action: ""
    },
    {
      id: "memo",
      label: "Memo",
      path: "memo",
      isCompleted: !!deal.analysis?.memo,
      tooltip: deal.analysis?.memo ? "Investment memo generated." : "No investment memo generated yet.",
      action: deal.analysis?.memo ? "" : "Generate final memo."
    },
    {
      id: "ic",
      label: "IC",
      path: "ic-one-pager",
      isCompleted: !!deal.analysis?.ic_one_pager,
      tooltip: deal.analysis?.ic_one_pager ? "IC One-Pager prepared." : "No IC One-Pager available.",
      action: deal.analysis?.ic_one_pager ? "" : "Generate partner tear sheet."
    }
  ]

  // Re-evaluate fund fit completion
  steps[6].isCompleted = !!deal.analysis

  return (
    <div className="bg-muted/30 border-b px-6 py-3 overflow-x-auto whitespace-nowrap">
      <div className="flex items-center justify-between min-w-max max-w-6xl mx-auto space-x-2">
        <TooltipProvider>
          {steps.map((step, idx) => {
            const isActive = pathname.includes(`/deals/${deal.id}/${step.path}`)
            const isCompleted = step.isCompleted
            
            // Determine icon and color
            let Icon = Circle
            let colorClass = "text-muted-foreground"
            
            if (isCompleted) {
              Icon = CheckCircle2
              colorClass = "text-emerald-500"
            } else if (isActive) {
              Icon = Clock
              colorClass = "text-primary"
            } else {
              Icon = Circle
              colorClass = "text-muted-foreground opacity-50"
            }

            return (
              <div key={step.id} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      href={`/deals/${deal.id}/${step.path}`}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-sm",
                        isActive ? "bg-background shadow-sm border font-medium" : "hover:bg-muted font-normal text-muted-foreground"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", colorClass)} />
                      <span className={cn(isActive ? "text-foreground" : "")}>{step.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs space-y-1 p-3">
                    <p className="font-semibold text-sm">
                      {step.label}: {isCompleted ? "Completed" : "Incomplete"}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.tooltip}</p>
                    {!isCompleted && step.action && (
                      <p className="text-xs font-medium text-primary mt-1">{step.action}</p>
                    )}
                  </TooltipContent>
                </Tooltip>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className={cn(
                    "w-4 h-[1px] mx-1",
                    isCompleted ? "bg-emerald-500/50" : "bg-border"
                  )} />
                )}
              </div>
            )
          })}
        </TooltipProvider>
      </div>
    </div>
  )
}
