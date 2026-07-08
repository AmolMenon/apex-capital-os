import React, { useState, useEffect } from "react"
import { ShieldAlert, Target, Search, AlertCircle, Play, History, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api"

export function OverviewPanel({ decisionId, decisionData }: { decisionId: string, decisionData: any }) {
  const [evaluation, setEvaluation] = useState<any>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const fetchEvaluation = () => {
    api.get(`/api/v1/decisions/${decisionId}/evaluate`)
      .then(data => setEvaluation(data))
      .catch(err => console.error("No evaluation found"))
  }

  useEffect(() => {
    fetchEvaluation()
  }, [decisionId])

  const runEvaluation = async () => {
    setIsEvaluating(true)
    try {
      const data = await api.post(`/api/v1/decisions/${decisionId}/evaluate_adaptive`, {})
      if (data) {
        setEvaluation(data)
      }
    } catch (e) {
      console.error(e)
    }
    setIsEvaluating(false)
  }

  const subjectName = decisionData?.subject?.name || "Company"
  const metadata = decisionData?.subject?.metadata_json ? JSON.parse(decisionData.subject.metadata_json) : {}

  const hasEvaluation = !!evaluation
  const recommendation = evaluation?.synthesis?.recommendation_type || "Pending"
  const integrityStatus = evaluation?.integrity_envelope?.integrity_status || "Unknown"
  const isBlocked = integrityStatus === "BLOCKED_PENDING_REVIEW"
  
  const keyRisks = evaluation?.synthesis?.key_risks?.slice(0, 3) || []
  const unresolvedConflicts = evaluation?.synthesis?.unresolved_conflicts || []
  const nextAction = evaluation?.synthesis?.next_best_action || (isBlocked ? "Resolve Blockers" : "Proceed to IC")

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {!hasEvaluation ? (
        <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 text-center space-y-4 my-12">
          <h2 className="text-xl font-medium text-slate-200">Ready for Underwriting Synthesis</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Apex has ingested the latest materials. Click below to synthesize the investment case, evaluate underwriting assumptions, and identify potential thesis breakers.
          </p>
          <button 
            onClick={runEvaluation}
            disabled={isEvaluating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center mx-auto"
          >
            {isEvaluating ? (
              <span className="animate-pulse">Synthesizing Evidence...</span>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Synthesize Investment Case
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          {/* Section 1: Investment Case */}
          <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400 flex items-center mb-4 border-b border-slate-800 pb-2">
              <Target className="w-4 h-4 mr-2" />
              Investment Case
            </h3>
            <p className="text-slate-200 text-base leading-relaxed">
              {evaluation.synthesis?.recommendation || "Nexus Data Systems represents a strong opportunity in the Enterprise Data sector. The management team has demonstrated exceptional execution, but valuation multiples are high. We believe the core technology moat justifies the premium."}
            </p>
            
            <div className="mt-6 pt-4 border-t border-slate-800/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Why Now</h4>
              <p className="text-sm text-slate-400">
                The company is raising capital ahead of a major product launch that is expected to triple their total addressable market. A 6-month delay would result in significantly worse entry valuations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 2: Core Underwriting Assumptions */}
            <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center mb-4 border-b border-slate-800 pb-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Underwriting Assumptions
              </h3>
              <ul className="space-y-4 flex-1">
                <li className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <div className="text-sm text-slate-300 font-medium mb-1">Customer Retention &gt; 110% Net Dollar Retention</div>
                  <div className="text-xs text-slate-500">Supported by recent cohort analysis. <span className="text-emerald-500 font-semibold">Strong Evidence</span>.</div>
                </li>
                <li className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <div className="text-sm text-slate-300 font-medium mb-1">Enterprise Sales Cycle under 4 months</div>
                  <div className="text-xs text-slate-500">Supported by CRM data extract. <span className="text-emerald-500 font-semibold">Strong Evidence</span>.</div>
                </li>
              </ul>
            </div>

            {/* Section 3: Material Risks & Thesis Breakers */}
            <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center mb-4 border-b border-slate-800 pb-2">
                <ShieldAlert className="w-4 h-4 mr-2" />
                Key Risks & Thesis Breakers
              </h3>
              <ul className="space-y-3 flex-1">
                {keyRisks.length > 0 ? (
                  keyRisks.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start text-sm bg-amber-950/10 p-3 rounded-lg border border-amber-900/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-300">{risk}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">No material risks highlighted by synthesis engine.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Section 4: Open Diligence Questions & Blockers */}
          {(unresolvedConflicts.length > 0 || isBlocked) && (
            <div className={`p-6 rounded-xl border shadow-sm ${isBlocked ? 'bg-rose-950/10 border-rose-900/50' : 'bg-slate-900/40 border-slate-800'}`}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center mb-4 border-b pb-2 ${isBlocked ? 'text-rose-400 border-rose-900/30' : 'text-slate-400 border-slate-800'}`}>
                <Search className="w-4 h-4 mr-2" />
                Open Diligence Questions
              </h3>
              
              <ul className="space-y-3">
                {unresolvedConflicts.map((conflict: string, i: number) => (
                  <li key={i} className="flex items-start text-sm p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                    <AlertCircle className="w-4 h-4 text-rose-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-rose-200 font-medium block mb-1">Targeted Diligence Required</span>
                      <span className="text-slate-400">{conflict}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Section 5: Relevant Historical Precedents (from Memory) */}
          <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-400 flex items-center mb-4 border-b border-slate-800 pb-2">
              <History className="w-4 h-4 mr-2" />
              Relevant Historical Precedents
            </h3>
            
            <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800/50 flex flex-col md:flex-row gap-4 justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Acme Corp Series A (2023)</h4>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Similar to the current situation with Nexus Data Systems, Acme Corp presented management revenue claims that conflicted with independent diligence by &gt;20%. The firm proceeded with a conditional approval, but Acme subsequently failed to meet their Q3 targets.
                </p>
              </div>
              <div className="shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  Recurring Blind Spot Detected
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
      
    </div>
  )
}
