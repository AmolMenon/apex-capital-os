"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipHelperProps {
  content: string | React.ReactNode
  children?: React.ReactNode
}

export function TooltipHelper({ content, children }: TooltipHelperProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children ? (
            <span className="cursor-help underline decoration-muted-foreground/50 decoration-dotted underline-offset-4">
              {children}
            </span>
          ) : (
            <HelpCircle className="h-4 w-4 inline-block text-muted-foreground cursor-help ml-1 align-text-bottom hover:text-foreground transition-colors" />
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] text-sm leading-relaxed z-50">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const TOOLTIP_DICTIONARY = {
  apexScore: "Overall attractiveness score based on market, founder, product, traction, business model, distribution, moat, and exit potential.",
  evidenceScore: "Measures how much of the investment case is supported by credible evidence rather than narrative.",
  deckQuality: "Measures how investor-ready the pitch deck is based on clarity, traction, financials, competition, team, and fundraising ask.",
  icReadiness: "Measures whether the deal has enough evidence, risk resolution, and diligence completeness to be discussed at investment committee.",
  powerLawScore: "Estimates whether the startup has potential to become a venture-scale outlier.",
  thesisFit: "Measures whether the startup fits the fund’s sector, stage, geography, ownership, and return strategy.",
  mockMode: "Deterministic demo mode that works without API keys. Real LLM providers can be connected later.",
  unsupportedClaim: "A statement from the deck or founder input that needs verification before investment judgment.",
  criticalRisk: "A risk that could materially change the recommendation or block IC readiness.",
}
