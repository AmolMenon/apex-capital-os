import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Sparkles, AlertTriangle } from "lucide-react"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { PrintActions } from "@/components/ui/PrintActions"
import { InvestorJudgmentCard } from "@/components/ui/InvestorJudgmentCard"
import { ChangeOurMindCard } from "@/components/ui/ChangeOurMindCard"
import { calculateDealHealth } from "@/lib/deal-logic"
import { api } from "@/lib/api"
import { PublicBenchmarkBadge, BenchmarkWarning, SourceConfidenceBadge, SourceRegistryTable } from '@/components/diligence/PublicDataComponents'

async function getMemo(id: string) {
  try {
    const res = await fetch(`${"http://127.0.0.1:8000"}/deals/${id}/memo`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (e) {
    return null
  }
}

export default async function MemoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const memo = await getMemo(params.id)
  const deal = await api.getDeal(params.id)

  if (!memo || !deal) {
    return <div className="p-8">Memo not available.</div>
  }

  const aiMeta = memo._ai_metadata
  const health = calculateDealHealth(deal)
  
  let decisionOutput = null
  let conversationOutput = null
  try {
    const res = await fetch(`${"http://127.0.0.1:8000"}/deals/${params.id}/decision`, { cache: 'no-store' })
    if (res.ok) decisionOutput = await res.json()
    
    const convRes = await fetch(`${"http://127.0.0.1:8000"}/conversations/${params.id}`, { cache: 'no-store' })
    if (convRes.ok) conversationOutput = await convRes.json()
  } catch (e) {
    console.error("Fetch error", e)
  }

  // Inject conversation summary if it exists
  if (conversationOutput && conversationOutput.summary) {
    memo.founder_conversation_review = `Overall Conversation Score: ${conversationOutput.overall_conversation_score}/100\n\n` +
      `Summary: ${conversationOutput.summary}\n\n` + 
      (conversationOutput.contradictions && conversationOutput.contradictions.length > 0 ? `Contradictions Identified: ${conversationOutput.contradictions.length}` : 'No critical contradictions identified during discussions.')
  }

  const order = [
    { key: "executive_snapshot", label: "Executive Snapshot" },
    { key: "market_thesis", label: "Market Thesis" },
    { key: "founder_market_fit", label: "Founder-Market Fit" },
    { key: "product_analysis", label: "Product Analysis" },
    { key: "executive_summary", label: "Executive Summary" },
    { key: "company_overview", label: "Company Overview" },
    { key: "problem", label: "Problem" },
    { key: "solution", label: "Solution" },
    { key: "market_opportunity", label: "Market Opportunity" },
    { key: "why_now", label: "Why Now" },
    { key: "product", label: "Product" },
    { key: "business_model", label: "Business Model" },
    { key: "traction", label: "Traction" },
    { key: "competition", label: "Competition" },
    { key: "investment_thesis", label: "Investment Thesis" },
    { key: "key_risks", label: "Key Risks" },
    { key: "diligence_required", label: "Diligence Required" },
    { key: "return_potential", label: "Return Potential" },
    { key: "deck_evidence_review", label: "Deck Evidence Review" },
    { key: "research_evidence", label: "Research Evidence" },
    { key: "founder_conversation_review", label: "Founder Conversation Review" },
    { key: "final_recommendation", label: "Final Recommendation" }
  ]

  return (
    <div className="flex-1 max-w-4xl mx-auto space-y-8 p-8 pt-6 pb-20">
      <PageHelpBanner 
        title="Investment Memo" 
        explanation="This is the full-length investment memo, synthesized automatically from the deal room, research, deck, and diligence."
      />
      <BenchmarkWarning isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {aiMeta && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5">
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
        <PrintActions documentTitle="Memo" summaryTextToCopy={memo.executive_snapshot || memo.executive_summary} />
      </div>

      <div className="text-center space-y-2 mb-8 border-b pb-8">
        <h1 className="text-4xl font-serif font-bold tracking-tight">Investment Memo</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">Apex Capital Internal Draft</p>
      </div>

      <div className="mb-12">
        <InvestorJudgmentCard 
          recommendation={decisionOutput?.recommendation || health.recommendation}
          whyNotInvest={decisionOutput?.reasoning || health.mainBlocker}
          mainRisk={decisionOutput?.blockers?.[0] || deal.analysis?.risks?.[0]?.description || "No primary risk identified yet."}
          whatWouldChange={[]}
          nextAction={health.nextActionTitle}
          nextActionHref={health.nextActionHref}
          dealId={deal.id.toString()}
        />
        <div className="mt-4">
          <ChangeOurMindCard 
            upgradeTriggers={decisionOutput?.change_our_mind?.upgrade_triggers || ["Stronger retention numbers", "Clear evidence of CAC payback < 12mo", "Completion of technical diligence"]}
            downgradeTriggers={decisionOutput?.change_our_mind?.downgrade_triggers || ["Regulatory risk materialized", "Founders hesitant on reference calls"]}
            passTriggers={decisionOutput?.change_our_mind?.pass_triggers || ["Target ownership < 5%", "Key competitor launches matching feature"]}
          />
        </div>
      </div>

      <div className="space-y-10 font-serif leading-relaxed text-foreground/90">
        {order.map(section => (
          memo[section.key] && (
            <section key={section.key} className="space-y-3">
              <h3 className="text-xl font-bold tracking-tight text-foreground border-b pb-2">{section.label}</h3>
              <p className="text-base whitespace-pre-wrap">{memo[section.key]}</p>
            </section>
          )
        ))}
      </div>
    </div>
  )
}
