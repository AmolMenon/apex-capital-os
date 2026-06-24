"use client"

import { Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ScoreCardProps {
  label: string
  value: string | number
  interpretation: string
  status: "success" | "warning" | "destructive" | "neutral"
  tooltip: string
  className?: string
}

export function ScoreCard({ label, value, interpretation, status, tooltip, className = "" }: ScoreCardProps) {
  const statusColors = {
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    warning: "bg-amber-500/10 text-amber-600 border-amber-200",
    destructive: "bg-red-500/10 text-red-600 border-red-200",
    neutral: "bg-primary/10 text-primary border-primary/20"
  }

  return (
    <div className={`p-4 rounded-xl border bg-card shadow-sm flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {label}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 opacity-50 hover:opacity-100" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px] p-3 text-sm">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge variant="outline" className={`text-xs font-semibold px-2 py-0.5 border ${statusColors[status]}`}>
          {status === "success" && "Strong"}
          {status === "warning" && "Moderate"}
          {status === "destructive" && "Weak"}
          {status === "neutral" && "Active"}
        </Badge>
      </div>
      
      <div>
        <div className="text-4xl font-extrabold tracking-tight mb-2">
          {value}
        </div>
        <p className="text-sm text-muted-foreground font-medium leading-snug">
          {interpretation}
        </p>
      </div>
    </div>
  )
}
