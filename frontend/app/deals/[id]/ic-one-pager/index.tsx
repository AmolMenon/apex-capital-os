import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertTriangle, Sparkles, Search } from "lucide-react"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { PrintActions } from "@/components/ui/PrintActions"
import { InvestorJudgmentCard } from "@/components/ui/InvestorJudgmentCard"
import { ChangeOurMindCard } from "@/components/ui/ChangeOurMindCard"
import { calculateDealHealth } from "@/lib/deal-logic"
import { api } from "@/lib/api"
import { PublicBenchmarkBadge, BenchmarkWarning, SourceConfidenceBadge, SourceRegistryTable } from '@/components/diligence/PublicDataComponents'

async function getOnePager(id: string) {
  try {
    const res = await fetch(`${"http://127.0.0.1:8000"}/deals/${id}/one-pager`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (e) {
    return null
  }
}

async function getFundFit(id: string) {
  try {
    const res = await fetch(`${"http://127.0.0.1:8000"}/fund/deals/${id}/fit`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (e) {
    return null
  }
}

async function getConversationIntelligence(id: string) {
  try {
    const res = await fetch(`${"http://127.0.0.1:8000"}/conversations/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (e) {
    return null
  }
}

export default async function OnePagerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const op = await getOnePager(params.id)
  const fundFit = await getFundFit(params.id)
  const convIntel = await getConversationIntelligence(params.id)
  const deal = await api.getDeal(params.id)

  if (!op || !deal) {
    return <div className="p-8">One pager not available.</div>
  }

  let risks = []
  try { risks = JSON.parse(op["Main risks"]) } catch (e) {}

  const health = calculateDealHealth(deal)
  const aiMeta = op?._ai_metadata;
  
  let decisionOutput = null
  try {
    const res = await fetch(`${"http://127.0.0.1:8000"}/deals/${params.id}/decision`, { cache: 'no-store' })
    if (res.ok) decisionOutput = await res.json()
  } catch (e) {
    console.error("Decision fetch error", e)
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto space-y-6 p-8 pt-6 pb-20 bg-gradient-to-br from-background to-emerald-500/5 dark:to-emerald-900/10 min-h-screen rounded-xl border border-emerald-500/10">
      <PageHelpBanner 
        title="IC One-Pager" 
        explanation="This is the final document presented to the Investment Committee. It distills weeks of research into a single page."
      />
      <div className="flex items-center justify-end print:hidden mb-4">
        <PrintActions documentTitle="IC One-Pager" summaryTextToCopy={op["One-line thesis"]} />
      </div>

      <div className="mb-6 print:hidden">
        <InvestorJudgmentCard 
          recommendation={decisionOutput?.recommendation || health.recommendation}
          whyNotInvest={decisionOutput?.reasoning || health.mainBlocker}
          mainRisk={decisionOutput?.blockers?.[0] || deal.analysis?.risks?.[0]?.description || "No primary risk identified yet."}
          whatWouldChange={[]}
          nextAction={health.nextActionTitle}
          nextActionHref={health.nextActionHref}
        />
        <div className="mt-4">
          <ChangeOurMindCard 
            upgradeTriggers={decisionOutput?.change_our_mind?.upgrade_triggers || ["Stronger retention numbers", "Clear evidence of CAC payback < 12mo", "Completion of technical diligence"]}
            downgradeTriggers={decisionOutput?.change_our_mind?.downgrade_triggers || ["Regulatory risk materialized", "Founders hesitant on reference calls"]}
            passTriggers={decisionOutput?.change_our_mind?.pass_triggers || ["Target ownership < 5%", "Key competitor launches matching feature"]}
          />
        </div>
      </div>

      <div className="border border-border/50 bg-background/90 backdrop-blur-md p-10 shadow-2xl rounded-lg print:shadow-none print:border-none print:p-0 print:bg-white mt-4 relative overflow-hidden">
        {/* Subtle document top glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0"></div>

        <div className="flex justify-between items-end border-b border-border/60 pb-6 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{op.Company}</h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">{op["One-line thesis"]}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="text-2xl font-bold text-primary">{op["Apex Score"]}/100</div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{op.Recommendation}</div>
            {aiMeta && (
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5 mt-2">
                {aiMeta.fallback_used ? (
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                ) : (
                  <Sparkles className="w-3 h-3 text-primary" />
                )}
                <span className="capitalize">{aiMeta.provider_used} Model</span>
                {aiMeta.fallback_used && <span className="text-amber-500 ml-1">(Fallback)</span>}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="col-span-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Sector</p>
            <p className="font-medium">{op.Sector}</p>
          </div>
          <div className="col-span-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Stage</p>
            <p className="font-medium">{op.Stage}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Round</p>
            <p className="font-medium">{op.Round}</p>
          </div>
        </div>

        {fundFit && (
          <div className="bg-emerald-500/5 p-5 rounded-lg border border-emerald-500/20 mb-8 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-500 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Fund Strategy Fit
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-500/70 uppercase tracking-wider font-semibold">Potential</p>
                <p className="font-bold text-base mt-1 text-emerald-900 dark:text-emerald-100">{fundFit.fund_return_potential}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-500/70 uppercase tracking-wider font-semibold">Target Ownership</p>
                <p className="font-bold text-base mt-1 text-emerald-900 dark:text-emerald-100">{(fundFit.target_ownership * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-500/70 uppercase tracking-wider font-semibold">Thesis Fit</p>
                <p className="font-bold text-base mt-1 text-emerald-900 dark:text-emerald-100">{fundFit.thesis_fit.verdict} ({fundFit.thesis_fit_score}/100)</p>
              </div>
            </div>
          </div>
        )}

        {convIntel && (
          <div className="bg-slate-900 text-white p-4 rounded-md border border-slate-800 mb-8 print:border-gray-300 print:text-black print:bg-white">
            <h3 className="text-sm font-bold mb-3">Founder-Investor Conversation Review</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase print:text-gray-500">Credibility</p>
                <p className="font-semibold text-sm">{convIntel.credibility_score}/100</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase print:text-gray-500">Clarity & Responsiveness</p>
                <p className="font-semibold text-sm">{Math.round((convIntel.clarity_score + convIntel.responsiveness_score) / 2)}/100</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase print:text-gray-500">Contradiction Risk</p>
                <p className="font-semibold text-sm text-red-400 print:text-red-600">{convIntel.contradiction_risk_score}/100</p>
              </div>
            </div>
            <p className="text-sm mt-3 pt-3 border-t border-slate-800 print:border-gray-200">
              {convIntel.summary}
            </p>
          </div>
        )}

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-bold border-b pb-1 mb-2">Why Now</h3>
            <p className="text-sm">{op["Why now"]}</p>
          </section>
          
          <section>
            <h3 className="text-lg font-bold border-b pb-1 mb-2">Why This Team</h3>
            <p className="text-sm">{op["Why this team"]}</p>
          </section>
          
          <section>
            <h3 className="text-lg font-bold border-b pb-1 mb-2">Why This Can Be Big</h3>
            <p className="text-sm">{op["Why this can be big"]}</p>
          </section>

          <section>
            <h3 className="text-lg font-bold border-b pb-1 mb-2">Key Traction</h3>
            <p className="text-sm">{op["Key traction"]}</p>
          </section>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <section className="bg-destructive/5 p-5 rounded-lg border border-destructive/20 shadow-sm transition-all hover:bg-destructive/10">
              <h3 className="text-sm font-bold text-destructive mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Main Risks
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-2 text-foreground/80">
                {risks.slice(0, 4).map((r: any, i: number) => (
                  <li key={i} className="pl-1">{r.risk}</li>
                ))}
              </ul>
            </section>
            <section className="bg-amber-500/5 p-5 rounded-lg border border-amber-500/20 shadow-sm transition-all hover:bg-amber-500/10">
              <h3 className="text-sm font-bold text-amber-600 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4" /> Diligence Required
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{op["Diligence required"]}</p>
            </section>
          </div>

          <section className="pt-6 border-t mt-6">
            <h3 className="text-xl font-bold inline-block mr-4">Final Call:</h3>
            <span className="text-xl font-bold text-primary">{op["Final call"]}</span>
          </section>
        </div>
      </div>
    </div>
  )
}
