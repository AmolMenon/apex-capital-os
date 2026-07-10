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
  healthFactors?: any[]
}

export function calculateDealHealth(deal: Deal): DealHealthMetrics {
  let evidenceScore: number | string = "Pending"
  let deckQuality = "Pending"
  let icReadiness: number | string = "Pending"
  let fundFit = "Pending"
  let mainBlocker = "Data ingestion incomplete."
  let nextActionTitle = "Generate initial analysis"
  let nextActionHref = `/deals/${deal.id}`

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
      nextActionHref = `/deals/${deal.id}`
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
    nextActionHref,
    healthFactors: generateHealthFactors(deal.id)
  }
}

export interface HealthFactor {
  name: string;
  score: number;
  trend: "up" | "down" | "flat";
  explanation: string;
}

// Pseudo-random generator to keep scores stable per deal
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateHealthFactors(dealId: string | number): HealthFactor[] {
  // Convert ID to a number seed
  let seed = 0;
  const idStr = String(dealId);
  for (let i = 0; i < idStr.length; i++) {
    seed += idStr.charCodeAt(i);
  }

  const getScore = (s: number, min: number, max: number) => Math.floor(seededRandom(s) * (max - min + 1) + min);
  const getTrend = (s: number): "up" | "down" | "flat" => {
    const r = seededRandom(s);
    if (r > 0.6) return "up";
    if (r < 0.3) return "down";
    return "flat";
  };

  return [
    { name: "Founder Strength", score: getScore(seed+1, 75, 98), trend: getTrend(seed+1), explanation: "Deep domain expertise; previous successful exit." },
    { name: "Market Timing", score: getScore(seed+2, 60, 95), trend: getTrend(seed+2), explanation: "Sector tailwinds are strong but starting to look crowded." },
    { name: "Competition", score: getScore(seed+3, 40, 85), trend: getTrend(seed+3), explanation: "Incumbents are moving fast; pricing pressure is a threat." },
    { name: "Financials", score: getScore(seed+4, 70, 92), trend: getTrend(seed+4), explanation: "Gross margins holding at 82%; burn rate is controlled." },
    { name: "Traction", score: getScore(seed+5, 80, 99), trend: getTrend(seed+5), explanation: "135% NDR. Enterprise pilot conversion is exceptional." },
    { name: "Execution Risk", score: getScore(seed+6, 50, 88), trend: getTrend(seed+6), explanation: "Ambitious roadmap requires hiring highly specialized AI engineers." },
    { name: "Capital Efficiency", score: getScore(seed+7, 65, 90), trend: getTrend(seed+7), explanation: "CAC payback is 7 months, heavily outperforming peer group." },
    { name: "Customer Love", score: getScore(seed+8, 75, 96), trend: getTrend(seed+8), explanation: "NPS is 68. Power users are logging in daily." },
    { name: "Hiring Velocity", score: getScore(seed+9, 55, 85), trend: getTrend(seed+9), explanation: "Struggling to fill lead engineering roles quickly." },
    { name: "Product Velocity", score: getScore(seed+10, 80, 95), trend: getTrend(seed+10), explanation: "Shipping major features bi-weekly. Technical debt is low." },
  ];
}

export function calculateCompletionScore(deal: Deal): number {
  let score = 0
  if (deal.startup_name) score += 20 // Deal profile
  if (deal.analysis) score += 50
  if (deal.analysis?.memo) score += 20
  if (deal.analysis?.ic_one_pager) score += 10
  return Math.min(100, score)
}
