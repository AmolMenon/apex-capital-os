"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertTriangle, ShieldCheck, FileSignature, Save, Loader2, ArrowRight } from "lucide-react"
import { api } from "@/lib/api"

export function DecisionWorkspace({ decisionId }: { decisionId: string }) {
  const [evaluation, setEvaluation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Human Decision State
  const [icDecision, setIcDecision] = useState<string>("")
  const [rationale, setRationale] = useState<string>("")
  const [overrideAcknowledged, setOverrideAcknowledged] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load Evaluation
    api.get(`/api/v1/decisions/${decisionId}/evaluate`)
      .then(data => {
        setEvaluation(data)
      })
      .catch(err => {
        console.error("Failed to load evaluation", err)
      })
      
    // Load previous decision if exists
    api.getHumanDecision(decisionId)
      .then(data => {
        if (data && data.human_final_decision) {
          setIcDecision(data.human_final_decision)
          setRationale(data.human_rationale || "")
          setSaved(true)
        }
        setLoading(false)
      })
      .catch(err => {
        // 404 is fine (no decision recorded yet)
        setLoading(false)
      })
  }, [decisionId])

  const handleSaveDecision = async () => {
    if (!icDecision) return
    setSaving(true)
    
    try {
      const isBlocked = evaluation?.integrity_envelope?.integrity_status === "BLOCKED_PENDING_REVIEW"
      const payload = {
        human_final_decision: icDecision,
        human_rationale: rationale,
        override_reason: (isBlocked && icDecision === "Approve") ? rationale : null,
        approvers_json: JSON.stringify(["Current User"]), // mocked user for now
        conditions_json: icDecision === "Conditional" ? JSON.stringify([{ "status": "pending" }]) : null
      }
      await api.recordHumanDecision(decisionId, payload)
      setSaved(true)
    } catch (err) {
      console.error("Failed to save decision", err)
      alert("Failed to save decision. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-slate-800/50 border-dashed rounded-xl bg-slate-900/20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 font-medium tracking-wide">Synthesizing Decision Integrity Record...</p>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-slate-800/50 border-dashed rounded-xl bg-slate-900/20">
        <AlertTriangle className="w-12 h-12 text-slate-700 mb-4" />
        <p className="text-slate-500">No diligence completed.</p>
        <p className="text-slate-600 text-sm mt-1">Please run AI Diligence before making a final IC Decision.</p>
      </div>
    )
  }

  const integrityStatus = evaluation.integrity_envelope?.integrity_status || "UNKNOWN"
  const isBlocked = integrityStatus === "BLOCKED_PENDING_REVIEW"
  const recommendation = evaluation.synthesis?.recommendation_type || "Hold"

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-light text-slate-100 flex items-center">
            <FileSignature className="w-6 h-6 mr-3 text-blue-400" />
            Investment Committee Decision
          </h2>
          <p className="text-sm text-slate-400 mt-2">Record the final human judgment and rationale for institutional memory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: System Synthesis */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">System Synthesis</h3>
          
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Apex Recommendation</h4>
            <div className="flex items-center mt-2 mb-4">
              <span className={`text-2xl font-semibold ${recommendation === 'Invest' ? 'text-emerald-400' : recommendation === 'Hold' ? 'text-amber-400' : 'text-rose-400'}`}>
                {recommendation}
              </span>
              <span className="ml-4 text-slate-300 text-sm font-medium">
                {evaluation.synthesis?.confidence}% Confidence
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              "{evaluation.synthesis?.summary}"
            </p>
          </div>

          <div className={`border rounded-xl p-6 ${isBlocked ? 'bg-rose-950/20 border-rose-900/50' : 'bg-emerald-950/20 border-emerald-900/50'}`}>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Decision Blocker Status</h4>
            <div className="flex items-center mt-2 mb-4">
              {isBlocked ? <AlertTriangle className="w-6 h-6 text-rose-400 mr-3" /> : <ShieldCheck className="w-6 h-6 text-emerald-400 mr-3" />}
              <span className={`text-xl font-medium ${isBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isBlocked ? "Blocked Pending Review" : "Clear"}
              </span>
            </div>
            {isBlocked && evaluation.integrity_envelope?.blocking_conditions?.length > 0 && (
              <div className="bg-rose-900/10 p-4 rounded-lg border border-rose-900/30">
                <p className="text-sm font-medium text-rose-300 mb-2">Active Blockers:</p>
                <ul className="space-y-2">
                  {evaluation.integrity_envelope.blocking_conditions.map((cond: string, i: number) => (
                    <li key={i} className="text-sm text-rose-400/80 flex items-start">
                      <span className="mr-2">•</span> {cond}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Human Form */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Human IC Decision</h3>
          
          <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            {saved && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-400">Decision Recorded</h3>
                <p className="text-slate-400 text-sm mt-2">Saved to Institutional Memory</p>
                
                <a href="/memory" className="mt-6 inline-flex items-center bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  View Memory Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                
                <button 
                  onClick={() => setSaved(false)}
                  className="mt-4 text-sm text-slate-500 hover:text-slate-300 underline decoration-slate-700 underline-offset-4"
                >
                  Edit Decision
                </button>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 block">Final Judgment</label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setIcDecision("Approve")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${icDecision === "Approve" ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-400" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-emerald-500/30 hover:bg-slate-800"}`}
                  >
                    <CheckCircle className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Approve</span>
                  </button>
                  <button 
                    onClick={() => setIcDecision("Conditional")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${icDecision === "Conditional" ? "bg-amber-900/40 border-amber-500/50 text-amber-400" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-amber-500/30 hover:bg-slate-800"}`}
                  >
                    <AlertTriangle className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Conditional</span>
                  </button>
                  <button 
                    onClick={() => setIcDecision("Reject")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${icDecision === "Reject" ? "bg-rose-900/40 border-rose-500/50 text-rose-400" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-rose-500/30 hover:bg-slate-800"}`}
                  >
                    <XCircle className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Reject</span>
                  </button>
                </div>
              </div>

              {isBlocked && icDecision === "Approve" && (
                <div className="bg-rose-950/40 border border-rose-900 p-5 rounded-lg flex flex-col mt-4">
                  <div className="flex items-start mb-4">
                    <AlertTriangle className="w-5 h-5 text-rose-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-sm font-semibold uppercase tracking-wider text-rose-400">Mandatory Override Acknowledgment</h5>
                      <p className="text-sm text-rose-300/90 mt-2 leading-relaxed">
                        This deal is <strong>Blocked Pending Review</strong> due to unresolved evidence conflicts. Overriding the AI recommendation requires explicit sign-off and detailed rationale. This override will be permanently logged in Institutional Memory.
                      </p>
                    </div>
                  </div>
                  <label className="flex items-start space-x-3 bg-rose-900/20 p-3 rounded border border-rose-900/50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 rounded border-rose-700 text-rose-600 focus:ring-rose-500 bg-slate-900" 
                      checked={overrideAcknowledged}
                      onChange={(e) => setOverrideAcknowledged(e.target.checked)}
                      id="override-ack"
                    />
                    <span className="text-sm text-rose-200">I acknowledge the active integrity blockers and assume responsibility for this override.</span>
                  </label>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block uppercase tracking-wider">Decision Rationale</label>
                <textarea 
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder={isBlocked && icDecision === "Approve" ? "Provide detailed justification for overriding the active blockers..." : "Explain the reasoning behind this decision..."}
                  className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <div className="pt-6 border-t border-slate-800">
                <button 
                  onClick={handleSaveDecision}
                  disabled={!icDecision || saving || (isBlocked && icDecision === "Approve" && (rationale.length < 20 || !overrideAcknowledged))}
                  className={`w-full py-4 rounded-lg font-bold tracking-wide transition-colors flex items-center justify-center uppercase text-sm ${
                    !icDecision || (isBlocked && icDecision === "Approve" && (rationale.length < 20 || !overrideAcknowledged))
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : icDecision === "Approve" 
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20" 
                        : icDecision === "Reject"
                          ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                  }`}
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  {saving ? "Recording Decision..." : "Sign & Record Decision"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
