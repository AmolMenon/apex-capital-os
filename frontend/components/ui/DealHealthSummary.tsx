"use client"
import { Deal } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { ExplanationPopover } from "@/components/ui/ExplanationPopover"
import { calculateDealHealth } from "@/lib/deal-logic"
import { AlertTriangle, Activity, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DealHealthSummary({ deal }: { deal: Deal }) {
  const health = calculateDealHealth(deal)

  return (
    <Card className="mb-6 shadow-sm border-primary/20">
      <CardHeader className="bg-muted/30 pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Deal Health Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="space-y-1">
            <ExplanationPopover 
              title="Recommendation" 
              explanation="The recommendation combines Apex Score, Evidence Score, unresolved critical risks, IC readiness, and fund fit. A high Apex Score alone does not automatically mean Invest."
            >
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recommendation</div>
            </ExplanationPopover>
            <div className="pt-1">
              <StatusBadge status={health.recommendation} />
            </div>
          </div>
          
          <div className="space-y-1">
            <ExplanationPopover 
              title="Apex Score" 
              explanation="A deterministic grade (0-100) based on 10 dimensions of the startup's profile, including market size, founder quality, and traction."
            >
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Apex Score</div>
            </ExplanationPopover>
            <div className="text-xl font-bold text-foreground">{health.apexScore}</div>
          </div>

          <div className="space-y-1">
            <ExplanationPopover 
              title="Evidence Score" 
              explanation="This tells you how much of the investment case is supported by evidence rather than founder narrative or assumptions. Increases as Research and Deck Analysis are completed."
            >
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Evidence Score</div>
            </ExplanationPopover>
            <div className="text-xl font-bold text-foreground">{health.evidenceScore}</div>
          </div>

          <div className="space-y-1">
            <ExplanationPopover 
              title="IC Readiness" 
              explanation="This shows whether the deal has enough completed diligence, verified evidence, and risk resolution to be discussed at investment committee."
            >
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">IC Readiness</div>
            </ExplanationPopover>
            <div className="text-xl font-bold text-foreground">{health.icReadiness}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-destructive flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Main Blocker
            </h4>
            <p className="text-sm text-foreground bg-destructive/5 p-3 rounded-md border border-destructive/10">
              {health.mainBlocker}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Next Best Action
            </h4>
            <div className="bg-emerald-50 p-3 rounded-md border border-emerald-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-emerald-800">{health.nextActionTitle}</span>
              <Link href={health.nextActionHref}>
                <Button size="sm" variant="outline" className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                  Execute Action
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
