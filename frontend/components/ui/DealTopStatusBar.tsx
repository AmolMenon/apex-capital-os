"use client"

import { Deal } from "@/types"
import { calculateDealHealth, calculateCompletionScore } from "@/lib/deal-logic"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "./button"

export function DealTopStatusBar({ deal }: { deal: Deal }) {
  const health = calculateDealHealth(deal)
  const completionScore = calculateCompletionScore(deal)
  const [convScore, setConvScore] = useState<number | string>("Pending")
  
  useEffect(() => {
    if (deal.id) {
      api.getConversationIntelligence(deal.id).then(res => {
        if (res && res.overall_conversation_score) {
          setConvScore(res.overall_conversation_score)
        }
      }).catch(() => {})
    }
  }, [deal.id])

  return (
    <div className="bg-muted/10 border-b px-6 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-w-6xl mx-auto">
        
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Evidence</span>
          <span className="font-medium text-foreground">{health.evidenceScore}</span>
        </div>
        <div className="w-px h-6 bg-border"></div>
        
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Conversation</span>
          <span className="font-medium text-foreground">{convScore}</span>
        </div>
        <div className="w-px h-6 bg-border"></div>

        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">IC Readiness</span>
          <span className="font-medium text-foreground">{health.icReadiness}</span>
        </div>
        <div className="w-px h-6 bg-border"></div>

        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Fund Fit</span>
          <span className="font-medium text-foreground max-w-[150px] truncate" title={health.fundFit}>{health.fundFit}</span>
        </div>
        <div className="w-px h-6 bg-border"></div>

        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completion</span>
          <span className="font-medium text-foreground">{completionScore}%</span>
        </div>
        <div className="w-px h-6 bg-border hidden md:block"></div>

        <div className="flex flex-col flex-1 min-w-[200px]">
          <span className="text-xs text-destructive uppercase tracking-wider font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Blocker
          </span>
          <span className="font-medium text-destructive truncate" title={health.mainBlocker}>{health.mainBlocker}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-600 uppercase tracking-wider font-semibold hidden lg:inline-block">Next:</span>
          <Link href={health.nextActionHref}>
            <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              {health.nextActionTitle} <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
