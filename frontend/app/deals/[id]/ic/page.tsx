"use client"

import React, { useState } from "react"
import { useInvestmentCase } from "@/context/InvestmentCaseContext"
import { InvestmentStatus } from "@/components/investment-case/InvestmentStatus"
import { DecisionsService, HumanDecisionInput } from "@/services/decisions"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertTriangle, ShieldCheck, XCircle } from "lucide-react"

export default function ICPage({ params }: { params: { id: string } }) {
  const { investmentCase, isLoading, error: icError, refreshInvestmentCase } = useInvestmentCase()
  
  const [icDecision, setIcDecision] = useState<string>("")
  const [rationale, setRationale] = useState<string>("")
  const [overrideAcknowledged, setOverrideAcknowledged] = useState(false)
  const [saving, setSaving] = useState(false)
  const [conditionalText, setConditionalText] = useState<string>("")
  const [saveError, setSaveError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-12 animate-pulse max-w-4xl mx-auto mt-12">
        <div className="h-12 bg-muted/40 rounded-lg w-1/3"></div>
        <div className="h-64 bg-muted/30 rounded-lg w-full"></div>
      </div>
    )
  }

  if (!investmentCase || icError) {
    return (
      <div className="flex h-[400px] items-center justify-center text-red-500">
        Failed to load connected investment case.
      </div>
    )
  }

  const { analytical_recommendation, decision_integrity, investment_case_assumptions, conflicts, diligence, human_decision } = investmentCase

  const allAssumptions = Object.values(investment_case_assumptions).flat()
  const whyInvest = allAssumptions.filter(a => a.status === "Verified").sort((a,b) => a.id - b.id)
  const invalidated = allAssumptions.filter(a => a.status === "Invalidated").sort((a,b) => a.id - b.id)
  const unverified = allAssumptions.filter(a => a.status === "Unverified").sort((a,b) => a.id - b.id)

  const confirmedContradictions = conflicts.filter(c => c.status === "CONFIRMED_CONTRADICTION").sort((a,b) => a.id - b.id)
  const openConflicts = conflicts.filter(c => c.status !== "RESOLVED" && c.status !== "CONFIRMED_CONTRADICTION").sort((a,b) => a.id - b.id)
  
  const openTasks = diligence.tasks.filter(t => t.status !== "COMPLETED").sort((a,b) => a.id - b.id)
  const completedFindings = diligence.findings

  const integrityStatus = decision_integrity?.status || "UNKNOWN"
  const isBlocked = integrityStatus === "BLOCKED_PENDING_REVIEW"
  const recommendation = analytical_recommendation?.value || "Hold"
  const isSaved = human_decision && human_decision.value

  const handleSaveDecision = async () => {
    if (!icDecision) return
    setSaving(true)
    setSaveError(null)
    
    try {
      const payload: HumanDecisionInput = {
        human_final_decision: icDecision,
        human_rationale: rationale,
        override_reason: (isBlocked && icDecision === "Approve") ? rationale : null,
        conditions_json: icDecision === "Conditional" ? JSON.stringify([{ "condition": conditionalText, "status": "pending" }]) : null
      }
      await DecisionsService.recordHumanDecision(params.id, payload)
      // Refresh the context so human_decision appears in canonical state
      await refreshInvestmentCase()
    } catch (err: any) {
      setSaveError(err.response?.data?.detail || err.message || "Failed to save decision.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 animate-in fade-in duration-500 font-serif">
      
      {/* 1. DEAL IDENTITY & MEMO HEADER */}
      <header className="border-b-2 border-primary/20 pb-8 text-center space-y-4 font-sans">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-foreground">Investment Committee Review</h1>
        <p className="text-muted-foreground uppercase tracking-wider text-sm">Strictly Confidential Memorandum</p>
      </header>

      {/* 2. SYSTEM ANALYSIS */}
      <section className="space-y-8 font-sans">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">I. System Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Current Recommendation</h3>
            <div className="text-3xl font-bold text-foreground">{recommendation}</div>
            <p className="text-sm text-muted-foreground mt-1">Status: {analytical_recommendation?.status || "Draft"}</p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Decision Integrity</h3>
            <div className="flex items-center gap-3">
              {isBlocked ? <AlertTriangle className="w-8 h-8 text-rose-600" /> : <ShieldCheck className="w-8 h-8 text-emerald-600" />}
              <div>
                <div className={`text-xl font-bold ${isBlocked ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {isBlocked ? "Blocked Pending Review" : "Clear"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isBlocked && decision_integrity?.blocking_conditions && decision_integrity.blocking_conditions.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded text-sm text-rose-800 space-y-2">
            <p className="font-bold uppercase tracking-wider text-xs">Active Blockers</p>
            <ul className="list-disc pl-5 space-y-1">
              {decision_integrity.blocking_conditions.map((cond: any, i: number) => (
                <li key={i}>{cond.description || cond.message || cond}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 3. INVESTMENT CASE */}
      <section className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b pb-2 font-sans">II. Investment Case</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-green-900 mb-3">Why Invest</h3>
            {whyInvest.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-foreground">
                {whyInvest.map(a => <li key={a.id}>{a.statement}</li>)}
              </ul>
            ) : <p className="italic text-muted-foreground">No verified critical assumptions support this case.</p>}
          </div>

          <div>
            <h3 className="text-lg font-bold text-red-900 mb-3">Why Not Invest (Risks)</h3>
            {invalidated.length > 0 || confirmedContradictions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-foreground">
                {invalidated.map(a => <li key={`inv-${a.id}`}>[Invalidated Assumption] {a.statement}</li>)}
                {confirmedContradictions.map(c => <li key={`con-${c.id}`}>[Confirmed Contradiction] Conflict #{c.id}</li>)}
              </ul>
            ) : <p className="italic text-muted-foreground">No critical risks have been confirmed.</p>}
          </div>
        </div>
      </section>

      {/* 4. UNRESOLVED ISSUES */}
      <section className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b pb-2 font-sans">III. Critical Unknowns & Unresolved Issues</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-md font-bold mb-3 text-orange-900">Unverified Assumptions</h3>
            {unverified.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-foreground">
                {unverified.map(a => <li key={a.id}>{a.statement}</li>)}
              </ul>
            ) : <p className="italic text-muted-foreground">None.</p>}
          </div>

          <div>
            <h3 className="text-md font-bold mb-3 text-orange-900">Unresolved Conflicts</h3>
            {openConflicts.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-foreground">
                {openConflicts.map(c => <li key={c.id}>Conflict #{c.id} between claim {c.claim_a_id} and claim {c.claim_b_id}</li>)}
              </ul>
            ) : <p className="italic text-muted-foreground">None.</p>}
          </div>

          <div>
            <h3 className="text-md font-bold mb-3 text-blue-900">Open Diligence Tasks</h3>
            {openTasks.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2 text-foreground">
                {openTasks.map(t => <li key={t.id}>Task #{t.id} targeting {t.target_type} #{t.target_id}</li>)}
              </ul>
            ) : <p className="italic text-muted-foreground">None.</p>}
          </div>
        </div>
      </section>

      {/* 5. HUMAN INVESTMENT DECISION */}
      <section className="space-y-6 bg-muted/20 p-8 rounded-lg border font-sans">
        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground border-b border-border pb-2">IV. Human Investment Decision</h2>
        
        {isSaved ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recorded Decision</div>
                <div className="text-2xl font-bold text-foreground">{human_decision.value}</div>
              </div>
            </div>
            {human_decision.value === "Conditional" && human_decision.conditions_json && (
              <div className="bg-background p-4 border rounded">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Conditions</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {human_decision.conditions_json}
                </p>
              </div>
            )}
            <div className="bg-background p-4 border rounded">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Rationale</p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{human_decision.rationale || "No rationale provided."}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-bold text-foreground mb-3 block">Final Committee Resolution</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button 
                  onClick={() => setIcDecision("Approve")}
                  className={`flex flex-col items-center justify-center p-4 rounded border-2 transition-all ${icDecision === "Approve" ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-emerald-200"}`}
                >
                  <CheckCircle className={`w-6 h-6 mb-2 ${icDecision === "Approve" ? "text-emerald-600" : ""}`} />
                  <span className="text-sm font-bold">Approve</span>
                </button>
                <button 
                  onClick={() => setIcDecision("Conditional")}
                  className={`flex flex-col items-center justify-center p-4 rounded border-2 transition-all ${icDecision === "Conditional" ? "bg-amber-50 border-amber-500 text-amber-700 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-amber-200"}`}
                >
                  <AlertTriangle className={`w-6 h-6 mb-2 ${icDecision === "Conditional" ? "text-amber-600" : ""}`} />
                  <span className="text-sm font-bold">Conditional</span>
                </button>
                <button 
                  onClick={() => setIcDecision("Reject")}
                  className={`flex flex-col items-center justify-center p-4 rounded border-2 transition-all ${icDecision === "Reject" ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-rose-200"}`}
                >
                  <XCircle className={`w-6 h-6 mb-2 ${icDecision === "Reject" ? "text-rose-600" : ""}`} />
                  <span className="text-sm font-bold">Reject</span>
                </button>
              </div>
            </div>

            {isBlocked && icDecision === "Approve" && (
              <div className="bg-rose-50 border border-rose-200 p-5 rounded flex flex-col">
                <div className="flex items-start mb-4">
                  <AlertTriangle className="w-5 h-5 text-rose-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-bold uppercase tracking-wider text-rose-800">Override Acknowledgment Required</h5>
                    <p className="text-sm text-rose-700 mt-2 leading-relaxed">
                      This deal contains unresolved conflicts. Overriding the analysis requires explicit sign-off and detailed rationale.
                    </p>
                  </div>
                </div>
                <label className="flex items-start space-x-3 bg-rose-100/50 p-3 rounded border border-rose-200 cursor-pointer">
                  <input 
                    id="override-ack"
                    type="checkbox" 
                    className="mt-1 w-4 h-4 rounded border-rose-300 text-rose-600 bg-background" 
                    checked={overrideAcknowledged}
                    onChange={(e) => setOverrideAcknowledged(e.target.checked)}
                  />
                  <span className="text-sm font-medium text-rose-900">I acknowledge the active blockers and assume responsibility for this override.</span>
                </label>
              </div>
            )}

            {icDecision === "Conditional" && (
              <div>
                <label className="text-sm font-bold text-foreground mb-2 block">Conditions</label>
                <textarea 
                  value={conditionalText}
                  onChange={(e) => setConditionalText(e.target.value)}
                  placeholder="Specify the exact conditions that must be met..."
                  className="w-full h-24 bg-background border rounded p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">Decision Rationale</label>
              <textarea 
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder={isBlocked && icDecision === "Approve" ? "Provide detailed justification for overriding the active blockers..." : "Explain the reasoning behind this decision..."}
                className="w-full h-32 bg-background border rounded p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>

            {saveError && (
              <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded p-3">
                {saveError}
              </div>
            )}

            <Button 
              onClick={handleSaveDecision}
              disabled={!icDecision || saving || (isBlocked && icDecision === "Approve" && (rationale.length < 20 || !overrideAcknowledged)) || (icDecision === "Conditional" && conditionalText.length < 10)}
              className="w-full py-6 font-bold tracking-wide uppercase"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {saving ? "Recording..." : "Record Decision"}
            </Button>
          </div>
        )}
      </section>

    </div>
  )
}
