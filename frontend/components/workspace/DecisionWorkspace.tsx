"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, ShieldCheck, FileSignature, Save, Loader2, ArrowRight } from "lucide-react"
import { DecisionsService, HumanDecisionInput } from "@/services/decisions"
import { Button } from "@/components/ui/button"
import { useInvestmentCase } from "@/context/InvestmentCaseContext"

export function DecisionWorkspace({ decisionId }: { decisionId: string }) {
  const { investmentCase, isLoading, error: icError } = useInvestmentCase()
  
  // Human Decision State
  const [icDecision, setIcDecision] = useState<string>("")
  const [rationale, setRationale] = useState<string>("")
  const [overrideAcknowledged, setOverrideAcknowledged] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conditionalText, setConditionalText] = useState<string>("")

  useEffect(() => {
    // Load previous decision if exists
    DecisionsService.getHumanDecision(decisionId)
      .then(data => {
        if (data && data.human_final_decision) {
          setIcDecision(data.human_final_decision)
          setRationale(data.human_rationale || "")
          setSaved(true)
        }
      })
      .catch(err => {
        // 404 is fine (no decision recorded yet)
      })
  }, [decisionId])

  const handleSaveDecision = async () => {
    if (!icDecision) return
    setSaving(true)
    setError(null)
    
    try {
      const isBlocked = investmentCase?.decision_integrity?.status === "BLOCKED_PENDING_REVIEW"
      const payload: HumanDecisionInput = {
        human_final_decision: icDecision,
        human_rationale: rationale,
        override_reason: (isBlocked && icDecision === "Approve") ? rationale : null,
        conditions_json: icDecision === "Conditional" ? JSON.stringify([{ "condition": conditionalText, "status": "pending" }]) : null
      }
      await DecisionsService.recordHumanDecision(decisionId, payload)
      setSaved(true)
    } catch (err) {
      console.error("Failed to save decision", err)
      setError("Failed to save decision. Please verify your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleEditDecision = () => {
    setSaved(false)
    // Note: Since the backend is additive, saving again will simply append a new record, 
    // which becomes the latest active decision upon the next GET request.
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-dashed rounded-xl bg-muted/20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium tracking-wide">Retrieving Decision Memory...</p>
      </div>
    )
  }

  if (!investmentCase || icError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-muted/20">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground font-medium">No system analysis available.</p>
        <p className="text-muted-foreground text-sm mt-1">Initial diligence must be completed before recording an IC decision.</p>
      </div>
    )
  }

  const integrityStatus = investmentCase.decision_integrity?.status || "UNKNOWN"
  const isBlocked = integrityStatus === "BLOCKED_PENDING_REVIEW"
  const recommendation = investmentCase.analytical_recommendation?.value || "Hold"

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <FileSignature className="w-6 h-6 mr-3 text-primary" />
            Investment Committee Review
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Record the final human judgment and rationale for institutional memory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: System Synthesis (AI) */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">System Analysis</h3>
          
          <div className="bg-muted/30 border rounded-xl p-6">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Algorithm Recommendation</h4>
            <div className="flex items-center mt-2 mb-4">
              <span className={`text-2xl font-bold ${recommendation === 'Invest' ? 'text-emerald-600' : recommendation === 'Hold' ? 'text-amber-600' : 'text-rose-600'}`}>
                {recommendation}
              </span>
              <span className="ml-4 text-muted-foreground text-sm font-medium">
                {investmentCase.analytical_recommendation?.status || "Draft"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed bg-background p-4 rounded-lg border">
              Driven by {investmentCase.conflicts.length} identified conflicts and {investmentCase.diligence.tasks.length} diligence tasks.
            </p>
          </div>

          <div className={`border rounded-xl p-6 ${isBlocked ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Integrity Envelope</h4>
            <div className="flex items-center mt-2 mb-4">
              {isBlocked ? <AlertTriangle className="w-6 h-6 text-rose-600 mr-3" /> : <ShieldCheck className="w-6 h-6 text-emerald-600 mr-3" />}
              <span className={`text-xl font-bold ${isBlocked ? 'text-rose-700' : 'text-emerald-700'}`}>
                {isBlocked ? "Blocked Pending Review" : "Clear"}
              </span>
            </div>
            {isBlocked && investmentCase.decision_integrity?.blocking_conditions && investmentCase.decision_integrity.blocking_conditions.length > 0 && (
              <div className="bg-rose-100/50 p-4 rounded-lg border border-rose-200">
                <p className="text-sm font-bold text-rose-800 mb-2">Active Conflicts:</p>
                <ul className="space-y-2">
                  {investmentCase.decision_integrity.blocking_conditions.map((cond: any, i: number) => (
                    <li key={i} className="text-sm text-rose-700 flex items-start">
                      <span className="mr-2">•</span> {cond.description || cond.message || cond}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Human Form */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Human Investment Decision</h3>
          
          <div className="bg-card border rounded-xl p-6 shadow-sm relative overflow-hidden">
            {saved && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Decision Recorded</h3>
                <p className="text-muted-foreground text-sm mt-2">Saved to Institutional Memory</p>
                
                <button 
                  onClick={handleEditDecision}
                  className="mt-6 text-sm font-medium text-primary hover:underline underline-offset-4"
                >
                  Edit Decision Record
                </button>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-foreground mb-3 block">Final Committee Resolution</label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setIcDecision("Approve")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${icDecision === "Approve" ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-emerald-200 hover:bg-emerald-50/50"}`}
                  >
                    <CheckCircle className={`w-6 h-6 mb-2 ${icDecision === "Approve" ? "text-emerald-600" : ""}`} />
                    <span className="text-sm font-bold">Approve</span>
                  </button>
                  <button 
                    onClick={() => setIcDecision("Conditional")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${icDecision === "Conditional" ? "bg-amber-50 border-amber-500 text-amber-700 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-amber-200 hover:bg-amber-50/50"}`}
                  >
                    <AlertTriangle className={`w-6 h-6 mb-2 ${icDecision === "Conditional" ? "text-amber-600" : ""}`} />
                    <span className="text-sm font-bold">Conditional</span>
                  </button>
                  <button 
                    onClick={() => setIcDecision("Reject")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${icDecision === "Reject" ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-rose-200 hover:bg-rose-50/50"}`}
                  >
                    <XCircle className={`w-6 h-6 mb-2 ${icDecision === "Reject" ? "text-rose-600" : ""}`} />
                    <span className="text-sm font-bold">Reject</span>
                  </button>
                </div>
              </div>

              {isBlocked && icDecision === "Approve" && (
               <div className="bg-rose-50 border border-rose-200 p-5 rounded-lg flex flex-col mt-4">
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
                      type="checkbox" 
                      className="mt-1 w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500 bg-background" 
                      checked={overrideAcknowledged}
                      onChange={(e) => setOverrideAcknowledged(e.target.checked)}
                      id="override-ack"
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
                    className="w-full h-24 bg-background border rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-foreground mb-2 block">Decision Rationale</label>
                <textarea 
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder={isBlocked && icDecision === "Approve" ? "Provide detailed justification for overriding the active blockers..." : "Explain the reasoning behind this decision..."}
                  className="w-full h-32 bg-background border rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>

              {error && (
                <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-md p-3">
                  {error}
                </div>
              )}

              <div className="pt-6 border-t">
                <Button 
                  onClick={handleSaveDecision}
                  disabled={!icDecision || saving || (isBlocked && icDecision === "Approve" && (rationale.length < 20 || !overrideAcknowledged)) || (icDecision === "Conditional" && conditionalText.length < 10)}
                  className="w-full py-6 font-bold tracking-wide uppercase"
                  variant={!icDecision || (isBlocked && icDecision === "Approve" && (rationale.length < 20 || !overrideAcknowledged)) || (icDecision === "Conditional" && conditionalText.length < 10) ? "secondary" : "default"}
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  {saving ? "Recording..." : "Record Decision"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
