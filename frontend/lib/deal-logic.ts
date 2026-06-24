import { Deal } from "@/types"

export interface DealHealthMetrics {
  recommendation: string
  apexScore: number | string
  evidenceScore: number | string
  deckQuality: string
  icReadiness: number | string
  fundFit: string
  mainBlocker: string
  nextActionTitle: string
  nextActionHref: string
}

export function calculateDealHealth(deal: Deal): DealHealthMetrics {
  let evidenceScore: number | string = "Pending"
  let deckQuality = "Pending"
  let icReadiness: number | string = "Pending"
  let fundFit = "Pending"
  let mainBlocker = "Data ingestion incomplete."
  let nextActionTitle = "Generate initial analysis"
  let nextActionHref = `/deals/${deal.id}/deal-room`

  if (deal.analysis) {
    evidenceScore = 40 // Base score if only analysis is present
    deckQuality = "Missing"
    icReadiness = 30
    fundFit = "Thesis Fit: " + (deal.analysis.fund_return?.verdict || "Evaluating")
    mainBlocker = "No external market/competitor research to validate claims."
    nextActionTitle = "Generate Research Brief"
    nextActionHref = `/deals/${deal.id}/research`
    
    if (deal.analysis) {
      evidenceScore = 85
      deckQuality = "Analyzed"
      mainBlocker = "Fund fit and target ownership requirements unverified."
      nextActionTitle = "Review Fund Fit"
      nextActionHref = `/deals/${deal.id}/fund-fit`
      icReadiness = 80
    }

    if (deal.analysis && deal.analysis.memo) {
      mainBlocker = "IC One-Pager not yet prepared."
      nextActionTitle = "Prepare IC One-Pager"
      nextActionHref = `/deals/${deal.id}/ic-one-pager`
      icReadiness = 90
    }

    if (deal.analysis && deal.analysis.ic_one_pager) {
      mainBlocker = "None. Ready for Investment Committee."
      nextActionTitle = "Update Deal Status"
      nextActionHref = `/deals/${deal.id}/deal-room`
      icReadiness = 100
      evidenceScore = 95
      deckQuality = "Verified"
    }
  }

  return {
    recommendation: deal.analysis?.recommendation || "Incomplete",
    apexScore: deal.analysis?.overall_score || "N/A",
    evidenceScore,
    deckQuality,
    icReadiness,
    fundFit,
    mainBlocker,
    nextActionTitle,
    nextActionHref
  }
}

export function calculateCompletionScore(deal: Deal): number {
  let score = 0
  if (deal.startup_name) score += 20 // Deal profile
  if (deal.analysis) score += 50
  if (deal.analysis?.memo) score += 20
  if (deal.analysis?.ic_one_pager) score += 10
  return Math.min(100, score)
}
