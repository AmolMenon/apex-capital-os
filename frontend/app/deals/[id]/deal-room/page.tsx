import { OperationsPanel } from "@/components/OperationsPanel";
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, AlertTriangle, Sparkles, Globe, Cpu } from "lucide-react"
import { api } from "@/lib/api"
import { PublicBenchmarkBadge, BenchmarkWarning, SourceConfidenceBadge, SourceRegistryTable } from '@/components/diligence/PublicDataComponents'
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { InvestorJudgmentCard } from "@/components/ui/InvestorJudgmentCard"
import { calculateDealHealth } from "@/lib/deal-logic"
import { defaultDecision } from "@/lib/safeDefaults"
import { UnknownMetricsGrid } from "@/components/web-research/WebResearchComponents"

export const dynamic = "force-dynamic"

export default async function DealRoomOverview(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let deal = null
  let webResearch = null
  let latestRun = null
  
  try {
    deal = await api.getDeal(params.id)
    if (deal) { 
      webResearch = await api.getWebResearch(deal.id).catch(() => null) 
      latestRun = await api.getLatestDiligenceRun(deal.id).catch(() => null)
    }
  } catch (e) {
    console.error("Fetch error", e)
  }
  
  if (!deal) {
    // Fallback for demo when backend is down
    deal = {
      id: params.id,
      startup_name: "Mock AI Corp",
      sector: "AI Infrastructure",
      stage: "Series A",
      valuation: 50000000,
      status: "In Progress",
      deal_type: "demo",
      analysis: {
        one_line_thesis: "A highly technical team building the orchestration layer for enterprise AI.",
        recommendation: "Strong Buy",
        risks: [
          { category: "Market", description: "High competition from AWS/GCP." }
        ],
        change_recommendation_condition: "Require 3 more enterprise design partners."
      }
    } as any;
  }

  const analysis = deal.analysis || {
    ic_one_pager: null,
    memo: null,
    risks: [],
    one_line_thesis: "Analysis pending.",
  }
  const aiMeta = analysis.ic_one_pager?._ai_metadata || analysis.memo?._ai_metadata
  const health = calculateDealHealth(deal)
  
  let decisionOutput = defaultDecision
  try {
    const d = await api.getDecision(params.id).catch(() => null)
    if (d) decisionOutput = d
  } catch (e) {
    console.error("Fetch error", e)
  }
  
  return (
    <div className="space-y-6 bg-gradient-to-br from-background to-emerald-500/5 dark:to-emerald-900/10 min-h-screen p-6 rounded-xl border border-emerald-500/10">
      <div>
        <OperationsPanel entityType="deal" entityId={deal.id.toString()} />
      </div>
      <div>
        <PageHelpBanner 
          title="Investment Snapshot" 
          explanation="Executive summary of the deal. Use the tabs above for deeper intelligence and evidence grading."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InvestorJudgmentCard 
            recommendation={decisionOutput.recommendation_reason || health.recommendation}
            whyNotInvest={decisionOutput.blocking_issues?.[0] || health.mainBlocker}
            mainRisk={analysis.risks?.[0]?.description || "No primary risk identified yet."}
            whatWouldChange={decisionOutput.what_would_upgrade_recommendation || []}
            nextAction={health.nextActionTitle}
            nextActionHref={health.nextActionHref}
            dealId={deal.id.toString()}
          />
        </div>

        {latestRun && (
          <Card className="bg-background/80 backdrop-blur-md border-emerald-500/30 shadow-lg md:col-span-2">
            <CardHeader className="pb-3 border-b border-emerald-500/10 flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2 text-emerald-900">
                <Target className="w-5 h-5 text-emerald-600" />
                Latest Diligence Run
              </CardTitle>
              <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                {latestRun.status}
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800 mb-1">Recommendation</h4>
                  <p className="text-lg font-bold text-emerald-950">{latestRun.final_recommendation}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800 mb-1">Trust Score</h4>
                  <p className="text-lg font-bold text-emerald-950">{latestRun.trust_score}/100</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800 mb-1">IC Readiness</h4>
                  <p className="text-lg font-bold text-emerald-950">{latestRun.ic_readiness}</p>
                </div>
                <div className="flex items-center justify-end">
                  <a href={`/deals/${deal.id}/diligence-runs/${latestRun.run_id}`} className="text-sm font-medium text-emerald-700 hover:underline">
                    View Full Report &rarr;
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-background/80 backdrop-blur-md shadow-lg md:col-span-1 border-primary/20">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2 text-foreground">
              <Target className="w-5 h-5 text-primary" />
              Investment Snapshot
            </CardTitle>
            {aiMeta && (
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5 font-normal">
                {aiMeta.fallback_used ? (
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                ) : (
                  <Sparkles className="w-3 h-3 text-primary" />
                )}
                <span className="capitalize">{aiMeta.provider_used} Model</span>
                {aiMeta.fallback_used && <span className="text-amber-500 ml-1">(Mock fallback used)</span>}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-primary/5 p-5 rounded-xl border border-primary/10 shadow-inner">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">One-Line Thesis</h4>
              <p className="text-lg font-medium leading-snug text-foreground">{analysis.one_line_thesis}</p>
            </div>
            
            
            {(deal as any).agent_workflow && (deal as any).agent_workflow.final_report && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-4 rounded-lg mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-200 mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4"/> Agentic Research Report
                </h4>
                <p className="text-sm font-medium leading-snug text-indigo-900 dark:text-indigo-100">{(deal as any).agent_workflow.final_report.public_benchmark_conclusion}</p>
                <div className="mt-2 text-xs text-indigo-700 dark:text-indigo-300 flex gap-4">
                  <span>Agents Run: <span className="font-bold">{(deal as any).agent_workflow.agents_run?.length || 0}/12</span></span>
                  <span>IC Status: <span className="font-bold">{(deal as any).agent_workflow.final_report.ic_readiness_status}</span></span>
                </div>
              </div>
            )}

            {webResearch && webResearch.vc_synthesis && (
              <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4"/> Public Market Synthesis
                </h4>
                <p className="text-sm font-medium leading-snug text-slate-800 dark:text-slate-200">{webResearch.vc_synthesis.public_company_snapshot}</p>
                <div className="mt-2 text-xs text-muted-foreground flex gap-4">
                  <span>Confidence: <span className="font-bold text-slate-700 dark:text-slate-300">{webResearch.public_data_confidence}</span></span>
                  <span>Source Quality: <span className="font-bold text-slate-700 dark:text-slate-300">{webResearch.source_quality_score}/100</span></span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Why Now</h4>
                <p className="text-sm text-foreground leading-relaxed">{analysis.ic_one_pager?.why_now || "Not generated yet."}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Why This Team</h4>
                <p className="text-sm text-foreground leading-relaxed">{analysis.ic_one_pager?.why_this_team || "Not generated yet."}</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Platform Diligence Signals</h4>
              <p className="text-sm text-foreground leading-relaxed">
                 <a href={`/deals/${deal.id}/platform-diligence`} className="text-emerald-700 hover:underline">View Platform Diligence Engine &rarr;</a>
              </p>
            </div>
            
            <div className="pt-2 border-t border-border">
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Why This Can Be Venture Scale</h4>
              <p className="text-sm text-foreground leading-relaxed">{analysis.ic_one_pager?.why_this_can_be_big || "Not generated yet."}</p>
            </div>
          
            {webResearch && webResearch.unknown_private_metrics?.length > 0 && (
              <div className="mt-6 border-t pt-4 border-border">
                <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Unknown Metrics (Require Diligence)</h4>
                <UnknownMetricsGrid metrics={webResearch.unknown_private_metrics.slice(0, 2)} />
              </div>
            )}
            
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
