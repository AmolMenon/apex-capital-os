"use client";

import { OperationsPanel } from "@/components/OperationsPanel";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, AlertTriangle, Sparkles, Globe, Cpu } from "lucide-react"
import { useGlobalDeal } from "@/components/GlobalDealProvider"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { InvestorJudgmentCard } from "@/components/ui/InvestorJudgmentCard"
import { calculateDealHealth } from "@/lib/deal-logic"
import { UnknownMetricsGrid } from "@/components/web-research/WebResearchComponents"

export default function DealRoomOverview() {
  const { state, loading } = useGlobalDeal();

  if (loading || !state) return <div className="p-12 text-center animate-pulse">Loading Deal Intelligence...</div>;

  const { deal, analysis, research: webResearch, diligence: latestRun } = state;
  const health = calculateDealHealth(deal);
  
  // Use autonomous pipeline data if available
  const oneLineThesis = analysis?.one_line_thesis || "Analysis pending.";
  const recommendation = analysis?.explainable_score?.supporting_factors?.length > 0 ? "Watchlist / Proceed to Diligence" : health.recommendation;
  const whyNotInvest = analysis?.explainable_score?.weaknesses?.[0] || health.mainBlocker;
  const mainRisk = analysis?.risks?.[0]?.description || "No primary risk identified yet.";

  return (
    <div className="space-y-6 bg-gradient-to-br from-background to-emerald-500/5 dark:to-emerald-900/10 min-h-screen p-6 rounded-xl border border-emerald-500/10">
      <div>
        <OperationsPanel entityType="deal" entityId={deal.id.toString()} />
      </div>
      <div>
        <PageHelpBanner 
          title="Investment Snapshot" 
          explanation="Executive summary of the deal. The autonomous pipeline continuously updates this snapshot."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InvestorJudgmentCard 
            recommendation={recommendation}
            whyNotInvest={whyNotInvest}
            mainRisk={mainRisk}
            whatWouldChange={[]}
            nextAction={health.nextActionTitle}
            nextActionHref={health.nextActionHref}
            dealId={deal.id.toString()}
          />
        </div>

        {latestRun && latestRun.ic_readiness_score && (
          <Card className="bg-background/80 backdrop-blur-md border-emerald-500/30 shadow-lg md:col-span-2">
            <CardHeader className="pb-3 border-b border-emerald-500/10 flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2 text-emerald-900">
                <Target className="w-5 h-5 text-emerald-600" />
                Latest Diligence Run
              </CardTitle>
              <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
                {latestRun.diligence_status || 'Completed'}
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800 mb-1">IC Readiness Score</h4>
                  <p className="text-lg font-bold text-emerald-950">{latestRun.ic_readiness_score}/100</p>
                </div>
                <div className="flex items-center justify-end md:col-span-3">
                  <a href={`/deals/${deal.id}/diligence`} className="text-sm font-medium text-emerald-700 hover:underline">
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
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5 font-normal">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>AI Native</span>
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-primary/5 p-5 rounded-xl border border-primary/10 shadow-inner">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">One-Line Thesis</h4>
              <p className="text-lg font-medium leading-snug text-foreground">{oneLineThesis}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Why Now</h4>
                <p className="text-sm text-foreground leading-relaxed">{analysis?.ic_one_pager?.why_now || "Analysis pending."}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Why This Team</h4>
                <p className="text-sm text-foreground leading-relaxed">{analysis?.ic_one_pager?.why_this_team || "Analysis pending."}</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border">
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Why This Can Be Venture Scale</h4>
              <p className="text-sm text-foreground leading-relaxed">{analysis?.ic_one_pager?.why_this_can_be_big || "Analysis pending."}</p>
            </div>
            
        </CardContent>
        </Card>
      </div>
    </div>
  )
}
