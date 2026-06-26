"use client"

import { Deal } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Play, Upload, CheckCircle, Search, FileText, CheckSquare, Activity, AlertCircle } from "lucide-react"
import { calculateDealHealth } from "@/lib/deal-logic"

interface NextBestActionCardProps {
  deal: Deal
  hasFundFit?: boolean
}

export function NextBestActionCard({ deal, hasFundFit = false }: NextBestActionCardProps) {
  const health = calculateDealHealth(deal)
  
  let icon = Play
  let urgencyClass = "text-primary bg-primary/10"
  let urgencyLabel = "High"

  if (health.nextActionTitle.includes("Generate initial analysis")) {
    icon = Play
    urgencyLabel = "Critical"
    urgencyClass = "text-destructive bg-destructive/10"
  } else if (health.nextActionTitle.includes("Research Brief")) {
    icon = Search
  } else if (health.nextActionTitle.includes("Analyze Pitch Deck")) {
    icon = Upload
  } else if (health.nextActionTitle.includes("Diligence Plan")) {
    icon = AlertCircle
    urgencyLabel = "Critical"
    urgencyClass = "text-destructive bg-destructive/10"
  } else if (health.nextActionTitle.includes("Fund Fit")) {
    icon = Activity
  } else if (health.nextActionTitle.includes("Memo")) {
    icon = FileText
  } else if (health.nextActionTitle.includes("IC")) {
    icon = CheckSquare
  } else {
    icon = CheckCircle
    urgencyLabel = "Completed"
    urgencyClass = "text-emerald-600 bg-emerald-100"
  }

  const Icon = icon

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 shadow-sm mb-6">
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Next Best Action</span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${urgencyClass}`}>
              Urgency: {urgencyLabel}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {health.nextActionTitle}
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-foreground font-medium">Why this is the next action:</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {health.mainBlocker}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 flex gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
          <Link href={health.nextActionHref} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto shadow-md font-semibold">
              Execute Action <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
