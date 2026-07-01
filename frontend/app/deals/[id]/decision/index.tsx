import { notFound } from "next/navigation"
import { api } from "@/lib/api"
import { PublicBenchmarkBadge, BenchmarkWarning, SourceConfidenceBadge, SourceRegistryTable } from '@/components/diligence/PublicDataComponents'
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, CircleX, AlertCircle, MessageSquare, Zap, Target, Network } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { defaultDecision, defaultFundFit } from "@/lib/safeDefaults"

export const dynamic = "force-dynamic"

export default async function DecisionEnginePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let deal = null
  try {
    deal = await api.getDeal(params.id)
  } catch (e) {
    console.error("Deal fetch error", e)
  }
  
  if (!deal) notFound()

  let decisionOutput = defaultDecision
  let convIntel = null
  let fundFit = defaultFundFit
  let graphSimilar = null

  try {
    const [d, c, f, g] = await Promise.all([
      api.getDecision(params.id).catch(() => null),
      api.getConversationIntelligence(params.id).catch(() => null),
      api.getFundFit(params.id).catch(() => null),
      api.getSimilarDeals(params.id).catch(() => [])
    ])
    if (d) decisionOutput = d
    if (c) convIntel = c
    if (f) fundFit = f
    if (g && g.length > 0) graphSimilar = g[0]
  } catch (e) {
    console.error("Fetch error", e)
  }
  
  return (
    <div className="space-y-6 pb-20">
      <PageHelpBanner 
        title="Decision Engine" 
        explanation="The engine's calibrated judgment on the deal, including what to look for that would upgrade or downgrade the conviction."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-primary shadow-sm">
          <CardHeader className="bg-muted/10 border-b border-border pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Engine Output
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-6 mb-4">
              <div className="flex-1 bg-background border rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Final Verdict</h4>
                {decisionOutput.current_recommendation?.toLowerCase().includes("invest") ? (
                  <Badge className="text-2xl px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">INVEST</Badge>
                ) : decisionOutput.current_recommendation?.toLowerCase().includes("pass") ? (
                  <Badge className="text-2xl px-6 py-2 bg-destructive hover:bg-destructive text-white shadow-lg shadow-destructive/20">PASS</Badge>
                ) : (
                  <Badge className="text-2xl px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20">
                    {decisionOutput.current_recommendation?.toUpperCase() || "BENCHMARK ONLY"}
                  </Badge>
                )}
                <p className="text-sm font-medium text-muted-foreground mt-4">Confidence: <span className="text-foreground">{decisionOutput.confidence_level}</span></p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Calibrated Recommendation</h4>
                  <p className="text-md font-semibold text-foreground">{decisionOutput.calibrated_recommendation}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reasoning</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{decisionOutput.recommendation_reason}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/10 border-b border-border pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Blocking Issues & Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-destructive mb-2 flex items-center gap-2">
                <CircleX className="w-4 h-4" /> Hard Blockers
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {decisionOutput.blocking_issues?.length > 0 ? (
                  decisionOutput.blocking_issues.map((issue, idx) => <li key={idx}>{issue}</li>)
                ) : (
                  <li>No blocking issues identified.</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Evidence Gaps
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {decisionOutput.evidence_gaps?.length > 0 ? (
                  decisionOutput.evidence_gaps.map((gap, idx) => <li key={idx}>{gap}</li>)
                ) : (
                  <li>No significant evidence gaps.</li>
                )}
              </ul>
            </div>
            <div className="pt-4 border-t">
              <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" /> What must happen before IC
              </h4>
              <p className="text-sm text-muted-foreground font-medium">
                {decisionOutput.next_decision_milestone || "Resolve evidence gaps and verify thesis."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-t-4 border-t-emerald-500">
          <CardHeader className="bg-muted/10 border-b border-border pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-500">
              <CheckCircle className="w-5 h-5" />
              Positive Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
              {decisionOutput.positive_signals?.length > 0 ? (
                decisionOutput.positive_signals.map((signal, idx) => <li key={idx}>{signal}</li>)
              ) : (
                <li className="text-muted-foreground">No positive signals identified.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-amber-500">
          <CardHeader className="bg-muted/10 border-b border-border pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-500">
              <AlertCircle className="w-5 h-5" />
              Upgrade / Downgrade Triggers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h4 className="text-sm font-bold text-emerald-500 mb-2">What Would Upgrade Recommendation</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {decisionOutput.what_would_upgrade_recommendation?.length > 0 ? (
                  decisionOutput.what_would_upgrade_recommendation.map((t, idx) => <li key={idx}>{t}</li>)
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-destructive mb-2">What Would Downgrade Recommendation</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {decisionOutput.what_would_downgrade_recommendation?.length > 0 ? (
                  decisionOutput.what_would_downgrade_recommendation.map((t, idx) => <li key={idx}>{t}</li>)
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {convIntel && convIntel.decision_impact && (
          <Card className="shadow-sm border-t-4 border-t-purple-500">
            <CardHeader className="bg-muted/10 border-b border-border pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-500">
                <MessageSquare className="w-5 h-5" />
                Conversation Intelligence Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between mb-2 pb-2 border-b">
                <span className="text-sm font-semibold text-muted-foreground uppercase">Signal Score</span>
                <span className="text-lg font-bold text-foreground">{convIntel.overall_conversation_score}/100</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground mb-1">Final Explanation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{convIntel.decision_impact.final_explanation}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 pt-4 border-t">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Recommendation</span>
                  <span className="text-sm font-semibold text-foreground">{convIntel.decision_impact.recommendation_adjustment}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Evidence Score Impact</span>
                  <span className="text-sm font-semibold text-foreground">{convIntel.decision_impact.evidence_score_impact}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">IC Readiness Impact</span>
                  <span className="text-sm font-semibold text-foreground">{convIntel.decision_impact.ic_readiness_impact}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardHeader className="bg-muted/10 border-b border-border pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" />
              Fund-Fit Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between mb-2 pb-2 border-b">
              <span className="text-sm font-semibold text-muted-foreground uppercase">Thesis Fit Score</span>
              <span className="text-lg font-bold text-foreground">{fundFit.thesis_fit_score}/100</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">Fund Return Potential</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fundFit.fund_return_potential || "Not evaluated"} — Requires exit of ${fundFit.ownership_scenarios?.required_exit_value_1x_fund ? (Number(fundFit.ownership_scenarios.required_exit_value_1x_fund) >= 1e9 ? (Number(fundFit.ownership_scenarios.required_exit_value_1x_fund) / 1e9).toFixed(1) + "B" : (Number(fundFit.ownership_scenarios.required_exit_value_1x_fund) / 1e6).toFixed(1) + "M") : "N/A"} to return 1x of the fund.
              </p>
            </div>
            <div className="pt-4 border-t">
              <span className="text-xs text-muted-foreground block mb-1">Capital Allocation Priority</span>
              <span className="text-sm font-semibold text-foreground">{fundFit.reserve_strategy?.capital_allocation_priority || "Low"}</span>
            </div>
          </CardContent>
        </Card>

        {graphSimilar && (
          <Card className="shadow-sm border-t-4 border-t-indigo-500 md:col-span-2">
            <CardHeader className="bg-muted/10 border-b border-border pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-indigo-500">
                <Network className="w-5 h-5" />
                Knowledge Graph Context: Similar Deal History
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between mb-2 pb-2 border-b">
                <span className="text-sm font-semibold text-muted-foreground uppercase">Closest Match</span>
                <span className="text-lg font-bold text-foreground">{graphSimilar.company_name} ({graphSimilar.similarity_score}% Match)</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">Why Similar</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{graphSimilar.why_similar}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1">Key Differences</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{graphSimilar.key_differences}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <span className="text-xs text-muted-foreground block mb-1 text-indigo-500 font-bold uppercase tracking-widest">Historical Decision Context</span>
                <p className="text-sm font-medium text-foreground bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-md border border-indigo-100 dark:border-indigo-900/30">
                  {graphSimilar.decision_context}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  )
}
