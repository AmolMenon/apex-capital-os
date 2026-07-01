"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ICReadinessCard, DiligenceTaskTable, ClaimVerificationTable, EvidenceTrackerTable, FounderFollowupCards, CustomerReferenceCards, DataRoomRequestTable, RiskResolutionTable, ICDecisionLogCard, ConversationContradictionsTable } from "@/components/diligence/DiligenceComponents"
import { BenchmarkWarning } from "@/components/diligence/PublicDataComponents"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { EmptyState } from "@/components/ui/EmptyState"

export default function DiligenceCommandCenterPage() {
  const params = useParams()
  const [deal, setDeal] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
  const [convIntel, setConvIntel] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [dealRes, planRes, convRes] = await Promise.all([
        fetch(`${"http://127.0.0.1:8000"}/deals/${params.id}`),
        fetch(`${"http://127.0.0.1:8000"}/diligence/${params.id}`),
        fetch(`${"http://127.0.0.1:8000"}/conversations/${params.id}`)
      ])
      
      if (dealRes.ok) setDeal(await dealRes.json())
      if (planRes.ok) setPlan(await planRes.json())
      if (convRes.ok) setConvIntel(await convRes.json())
    } catch (e) {
      console.error("Diligence data fetch failed", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [params.id])

  const handleEvaluate = async () => {
    setLoading(true)
    await fetch(`${"http://127.0.0.1:8000"}/diligence/${params.id}`, { method: "POST" })
    await loadData()
  }

  if (loading) return <div className="container py-8 max-w-7xl mx-auto text-center"><RefreshCw className="h-8 w-8 animate-spin mx-auto mt-20" /></div>
  
  if (!deal) return <div className="container py-8">Deal not found.</div>

  if (!plan) {
    return (
      <div className="container py-8 max-w-7xl mx-auto space-y-6">
        <PageHelpBanner 
          title="Diligence Command Center" 
          explanation="This converts open risks and unsupported claims into founder follow-ups, data room requests, and customer reference questions."
        />
        <EmptyState 
          title="No Diligence Plan" 
          description="Evaluate a plan to convert open risks and unsupported claims into actionable tasks."
          icon={RefreshCw}
          primaryActionLabel="Investigate Diligence Gaps"
          onPrimaryAction={handleEvaluate}
        />
      </div>
    )
  }

  const mergedFollowups = [...(plan.founder_followups || [])]
  if (convIntel && convIntel.open_followups) {
    const convFollowups = convIntel.open_followups.map((f: any) => ({
      question: `[Conversation Review] ${f.followup_item}`,
      why_it_matters: f.impact_if_unresolved || "Unresolved transcript contradiction",
      status: "Open"
    }))
    mergedFollowups.unshift(...convFollowups)
  }

  const aiMeta = plan?._ai_metadata;

  return (
    <div className="space-y-8">
      <BenchmarkWarning isPublic={deal.is_public_benchmark || deal.deal_type === "real_benchmark"} />
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <PageHelpBanner 
            title="Diligence Command Center" 
            explanation="This converts open risks and unsupported claims into actionable founder follow-ups, data room requests, and customer reference questions."
          />
        </div>
        <div className="flex flex-col items-end gap-2 -mt-4">
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
          <Button variant="outline" size="sm" onClick={handleEvaluate}><RefreshCw className="h-4 w-4 mr-2" /> Refresh Plan</Button>
        </div>
      </div>

      <ICReadinessCard 
        score={plan.ic_readiness_score} 
        verdict={plan.diligence_status}
        blockers={plan.readiness_blockers || []}
        nextAction={plan.final_diligence_verdict}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {convIntel && convIntel.contradictions && convIntel.contradictions.length > 0 && (
            <ConversationContradictionsTable contradictions={convIntel.contradictions} />
          )}
          <DiligenceTaskTable tasks={plan.priority_tasks || []} dealId={deal?.id || parseInt(params.id as string)} />
          <RiskResolutionTable risks={plan.risk_resolution_plan || []} dealId={deal?.id || parseInt(params.id as string)} />
          <EvidenceTrackerTable items={plan.evidence_items || []} dealId={deal?.id || parseInt(params.id as string)} />
          <ClaimVerificationTable claims={plan.claim_verifications || []} />
        </div>
        
        <div className="space-y-6">
          <ICDecisionLogCard dealId={deal?.id || parseInt(params.id as string)} onLogSubmit={loadData} />
          
          {deal.ic_decision_logs && deal.ic_decision_logs.length > 0 && (
            <div className="border rounded-lg p-4 bg-card text-sm space-y-3">
              <h4 className="font-bold text-xs uppercase text-muted-foreground">IC History</h4>
              {deal.ic_decision_logs.map((log: any) => (
                <div key={log.id} className="border-b pb-2 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="secondary">{log.decision}</Badge>
                    <span className="text-xs text-muted-foreground">{log.decision_date ? log.decision_date.substring(0, 10) : ""}</span>
                  </div>
                  <p className="text-xs italic text-muted-foreground">"{log.decision_rationale}"</p>
                </div>
              ))}
            </div>
          )}
          
          <DataRoomRequestTable requests={plan.data_room_requests || []} />
          <FounderFollowupCards followups={mergedFollowups || []} />
          <CustomerReferenceCards references={plan.customer_reference_questions || []} />
        </div>
      </div>
    </div>
  )
}
