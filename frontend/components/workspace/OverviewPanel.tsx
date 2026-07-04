import React, { useState, useEffect } from "react"
import { ShieldAlert, Target, ShieldCheck, AlertTriangle, AlertCircle, Play } from "lucide-react"
import { api } from "@/lib/api"

export function OverviewPanel({ decisionId, decisionData }: { decisionId: string, decisionData: any }) {
  const [evaluation, setEvaluation] = useState<any>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  // Fetch the latest reasoning run if it exists
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
  const nextAction = evaluation?.synthesis?.next_best_action || (isBlocked ? "Resolve Blockers" : "Evaluate Deal")

  return (
    <div className="space-y-6">
      
      {!hasEvaluation ? (
        <div className="bg-slate-900/60 p-8 rounded-xl border border-slate-800 text-center space-y-4">
          <h2 className="text-xl font-medium text-slate-200">Deal Ready for Evaluation</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Apex has ingested the Pitch Deck, Founder Updates, and Financials. Click below to synthesize the intelligence, identify contradictions, and generate an investment recommendation.
          </p>
          <button 
            onClick={runEvaluation}
            disabled={isEvaluating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center mx-auto"
          >
            {isEvaluating ? (
              <span className="animate-pulse">Running Targeted Challenges...</span>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Evaluate Investment
              </>
            )}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            
            {/* Investment Case */}
            <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 flex flex-col h-full shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Investment Case
                </h3>
              </div>
              <div className="flex-1">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {evaluation.synthesis?.recommendation || "No investment thesis available."}
                </p>
              </div>
            </div>

            {/* Material Risk */}
            <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800 flex flex-col h-full shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Material Risk
                </h3>
              </div>
              <div className="flex-1 space-y-3">
                {keyRisks.length > 0 ? (
                  <ul className="space-y-3">
                    {keyRisks.map((risk: string, i: number) => (
                      <li key={i} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-3 flex-shrink-0"></div>
                        <span className="text-slate-300">{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm">No material risks identified.</p>
                )}
                {unresolvedConflicts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <p className="text-xs font-semibold uppercase text-rose-400 mb-2">Unresolved Conflicts</p>
                    <ul className="space-y-2">
                      {unresolvedConflicts.map((conflict: string, i: number) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{conflict}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Required Next Action */}
            <div className={`p-6 rounded-xl border flex flex-col h-full shadow-sm transition-colors ${isBlocked ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-800/50' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center ${isBlocked ? 'text-rose-400' : 'text-blue-400'}`}>
                  <Play className="w-4 h-4 mr-2" />
                  Required Next Action
                </h3>
              </div>
              <div className="flex-1">
                <p className={`text-lg font-medium leading-snug ${isBlocked ? 'text-rose-300' : 'text-slate-200'}`}>
                  {nextAction}
                </p>
                {isBlocked && (
                  <div className="mt-4 p-3 bg-rose-900/20 rounded border border-rose-800/30">
                    <p className="text-xs text-rose-200/80">
                      <strong>Blocker:</strong> This deal cannot proceed to final IC vote without an explicit human override due to active integrity warnings.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </>
      )}
      
    </div>
  )
}
