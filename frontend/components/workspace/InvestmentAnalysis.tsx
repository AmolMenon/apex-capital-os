"use client"

import React, { useState, useEffect } from "react"
import { Brain, MessageSquare, ThumbsDown, ThumbsUp, GitMerge, Loader2, Network, X, AlertTriangle, ShieldCheck, Search, Play, FileSearch } from "lucide-react"
import { api } from "@/lib/api"

export function InvestmentAnalysis({ decisionId }: { decisionId: string }) {
  const [evaluation, setEvaluation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [traceOpen, setTraceOpen] = useState(false)
  const [traceData, setTraceData] = useState<any>(null)
  const [traceLoading, setTraceLoading] = useState(false)

  const fetchTrace = async (objectType: string, objectId: string | number) => {
    if (!objectId) return
    setTraceOpen(true)
    setTraceLoading(true)
    try {
      const data = await api.get(`/api/v1/decisions/${decisionId}/adaptive-trace/${objectType}/${objectId}`)
      if (data) {
        setTraceData(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setTraceLoading(false)
    }
  }

  const fetchEvaluation = async () => {
    try {
      const data = await api.get(`/api/v1/decisions/${decisionId}/evaluate`)
      if (data) {
        setEvaluation(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchEvaluation()
  }, [decisionId])

  const handleRunDiligence = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.post(`/api/v1/decisions/${decisionId}/evaluate_adaptive`, {})
      if (data) {
        setEvaluation(data)
      } else {
        setError(`Diligence analysis failed.`)
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (stance: string) => {
    if (stance?.toLowerCase() === "positive") return ThumbsUp
    if (stance?.toLowerCase() === "negative") return ThumbsDown
    return MessageSquare
  }

  const getColor = (stance: string) => {
    if (stance?.toLowerCase() === "positive") return "text-emerald-400"
    if (stance?.toLowerCase() === "negative") return "text-rose-400"
    return "text-amber-400"
  }

  const getBg = (stance: string) => {
    if (stance?.toLowerCase() === "positive") return "bg-emerald-400/10"
    if (stance?.toLowerCase() === "negative") return "bg-rose-400/10"
    return "bg-amber-400/10"
  }

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Investment Analysis</h2>
          <p className="text-sm text-slate-400 mt-1">AI-driven diligence and risk synthesis.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRunDiligence}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/20 flex items-center font-medium"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {loading ? "Running Diligence..." : "Run AI Diligence"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 p-4 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {evaluation ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl mt-6 font-sans">
          
          {/* Memo Header */}
          <div className="p-8 border-b border-slate-800 bg-slate-900/80">
            <h1 className="text-3xl font-light text-slate-100 mb-6">Investment Memorandum</h1>
            <div className="flex flex-wrap gap-y-4 gap-x-12">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold block mb-1">Recommendation</span>
                <span className={`text-lg font-bold ${evaluation.synthesis?.recommendation_type === 'DEFER' ? 'text-amber-400' : evaluation.synthesis?.recommendation_type === 'INVEST' ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {evaluation.synthesis?.recommendation_type || 'PENDING'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold block mb-1">Confidence</span>
                <span className="text-lg font-bold text-slate-200">{evaluation.synthesis?.confidence || 0}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold block mb-1">Prepared By</span>
                <span className="text-lg font-bold text-slate-200 flex items-center">
                  <Brain className="w-4 h-4 mr-2 text-blue-400" />
                  Apex Intelligence
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-12 max-w-4xl">
            
            {/* Executive View & Thesis */}
            <section className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-2">Executive View</h3>
                <p className="text-slate-300 leading-relaxed text-base">
                  {evaluation.synthesis?.summary || "Executive summary pending."}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-2">Investment Thesis</h3>
                <p className="text-slate-200 font-medium leading-relaxed text-lg border-l-4 border-blue-500/50 pl-4 py-1">
                  {evaluation.synthesis?.recommendation || "Thesis pending."}
                </p>
                {evaluation.recommendation_id && (
                  <button onClick={() => fetchTrace("Recommendation", evaluation.recommendation_id)} className="mt-3 text-xs flex items-center text-blue-400 hover:text-blue-300">
                    <Network className="w-3.5 h-3.5 mr-1.5" /> View Logical Provenance Trace
                  </button>
                )}
              </div>
            </section>

            {/* Why It Works & Material Risks */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-800 pb-2">Why It Works</h3>
                <ul className="space-y-3">
                  {evaluation.agent_perspectives?.filter((p:any) => p.stance === "Positive").flatMap((p:any) => p.key_points).map((point: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-slate-300">
                      <ThumbsUp className="w-4 h-4 text-emerald-500/70 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-800 pb-2 flex items-center">
                  Material Risks
                </h3>
                <ul className="space-y-3">
                  {evaluation.synthesis?.key_risks?.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-slate-300">
                      <AlertTriangle className="w-4 h-4 text-amber-500/70 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Evidence Intelligence */}
            <section className="space-y-8 bg-slate-950 p-6 rounded-xl border border-slate-800/50">
              <h2 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-3">Evidence Intelligence</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Critical Assumptions</h3>
                  <ul className="space-y-2">
                    {evaluation.synthesis?.unverified_assumptions?.map((assm: string, i: number) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start bg-slate-900/50 p-3 rounded border border-slate-800">
                        <span className="text-amber-500 mr-2 font-bold">?</span> {assm}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Missing Information</h3>
                  <ul className="space-y-2">
                    {evaluation.synthesis?.missing_information?.map((miss: string, i: number) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start bg-slate-900/50 p-3 rounded border border-slate-800">
                        <FileSearch className="w-4 h-4 text-slate-500 mr-2 mt-0.5" /> {miss}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {evaluation.synthesis?.unresolved_conflicts?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-500 mb-3">Unresolved Evidence Conflicts</h3>
                  <div className="space-y-3">
                    {evaluation.synthesis.unresolved_conflicts.map((conflict: string, i: number) => (
                      <div key={i} className="bg-rose-950/20 p-4 rounded-lg border border-rose-900/50 flex items-start">
                        <AlertTriangle className="w-5 h-5 text-rose-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-rose-200 leading-relaxed">{conflict}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Deep Dives */}
            {evaluation.challenge_findings?.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-800 pb-2">Targeted Reviews & Findings</h3>
                <div className="grid grid-cols-1 gap-4">
                  {evaluation.challenge_findings.map((ch: any, i: number) => (
                    <div key={i} className="bg-slate-900/60 border border-slate-700/50 p-5 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start">
                      <div className="flex-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Investigated Area: {ch.target_id}</p>
                        <p className="text-slate-300 text-sm italic mb-2">"{ch.challenge_findings}"</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-1 rounded">Outcome: {ch.assumption_status_change}</span>
                      </div>
                      <button onClick={() => fetchTrace("ChallengeFinding", ch.finding_id)} className="text-xs flex items-center text-blue-400 hover:text-blue-300 whitespace-nowrap bg-blue-900/20 px-3 py-1.5 rounded border border-blue-800/50 transition-colors">
                        <Network className="w-3.5 h-3.5 mr-1.5" /> Trace Finding
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Strategic Conditions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-800 pb-2">Conditions for Reversal</h3>
                <ul className="space-y-3">
                  {evaluation.synthesis?.conditions_for_reversal?.map((cond: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-slate-300">
                      <GitMerge className="w-4 h-4 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-800 pb-2">Next Best Actions</h3>
                <div className="bg-blue-950/20 p-4 rounded-lg border border-blue-900/50">
                  <p className="text-sm text-blue-200 font-medium leading-relaxed">{evaluation.synthesis?.next_best_action}</p>
                </div>
              </div>
            </section>

            {/* Specialized Assessments */}
            {evaluation.agent_perspectives?.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-800 pb-2">Specialized Assessments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {evaluation.agent_perspectives.map((agent: any, idx: number) => {
                    const titleMap: Record<string, string> = {
                      "Market Analyst": "Commercial Assessment",
                      "Financial Auditor": "Financial Assessment",
                      "Risk Assessor": "Risk Assessment",
                      "Legal/Compliance": "Regulatory Assessment",
                      "Tech Reviewer": "Technical Assessment"
                    };
                    const title = titleMap[agent.agent_name] || `${agent.agent_name} Assessment`;
                    return (
                      <div key={idx} className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-slate-200">{title}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${agent.stance === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' : agent.stance === 'Negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {agent.stance}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-slate-700 pl-3 mb-4">
                          "{agent.perspective}"
                        </p>
                        <ul className="space-y-2 mt-4">
                          {agent.key_points?.map((point: string, i: number) => (
                            <li key={i} className="flex items-start text-xs text-slate-400">
                              <span className="text-slate-600 mr-2">•</span> {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Integrity Check */}
            <section className="mt-12 pt-8 border-t border-slate-800">
              <div className={`p-6 rounded-xl border ${evaluation.integrity_envelope?.integrity_status === 'BLOCKED_PENDING_REVIEW' ? 'bg-rose-950/20 border-rose-900/50' : 'bg-emerald-950/20 border-emerald-900/50'} flex flex-col md:flex-row gap-6 items-center justify-between`}>
                <div className="flex items-center">
                  {evaluation.integrity_envelope?.integrity_status === 'BLOCKED_PENDING_REVIEW' ? (
                    <AlertTriangle className="w-8 h-8 text-rose-500 mr-4" />
                  ) : (
                    <ShieldCheck className="w-8 h-8 text-emerald-500 mr-4" />
                  )}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Decision Integrity Check</h3>
                    <p className={`text-lg font-semibold ${evaluation.integrity_envelope?.integrity_status === 'BLOCKED_PENDING_REVIEW' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {evaluation.integrity_envelope?.integrity_status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                {evaluation.integrity_envelope?.blocking_conditions?.length > 0 && (
                  <div className="flex-1 text-sm text-rose-200/80 border-l border-rose-900/50 pl-6">
                    <span className="font-bold block mb-1">Active Blockers:</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {evaluation.integrity_envelope.blocking_conditions.map((b: string, i: number) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 border border-slate-800/50 border-dashed rounded-xl bg-slate-900/20">
          <Search className="w-12 h-12 text-slate-700 mb-4" />
          <p className="text-slate-500 font-medium">No diligence analysis generated yet.</p>
          <p className="text-slate-600 text-sm mt-1">Click "Run AI Diligence" to analyze evidence and form a thesis.</p>
        </div>
      )}
      
      {/* Provenance Trace Modal */}
      {traceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl max-h-[80vh] rounded-xl flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-slate-200 flex items-center">
                <Network className="w-5 h-5 mr-3 text-blue-400" />
                Source Trace
              </h3>
              <button onClick={() => setTraceOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {traceLoading ? (
                <div className="flex flex-col justify-center items-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" /><span className="text-slate-400 font-medium tracking-wide">Reconstructing Provenance Lineage...</span></div>
              ) : traceData ? (
                <div className="space-y-6">
                  <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50 text-sm text-slate-300">
                    This logic graph tracks the exact provenance from raw evidence to the final conclusion, ensuring complete auditability.
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Nodes</h4>
                    <div className="space-y-3">
                      {traceData.nodes?.map((n: any, i: number) => (
                        <div key={i} className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 flex flex-col">
                          <span className="text-xs font-mono text-blue-400 mb-2 font-medium">{n.id}</span>
                          <span className="text-sm text-slate-300 leading-relaxed">{n.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Lineage</h4>
                    <div className="space-y-2">
                      {traceData.edges?.map((e: any, i: number) => (
                        <div key={i} className="flex flex-wrap items-center text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
                          <span className="text-slate-300 font-mono bg-slate-800 px-2 py-1 rounded truncate max-w-[200px]">{e.source}</span>
                          <span className="mx-3 text-slate-500">── <span className="text-blue-400 font-medium">{e.relationship}</span> ──&gt;</span>
                          <span className="text-slate-300 font-mono bg-slate-800 px-2 py-1 rounded truncate max-w-[200px]">{e.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 py-10 text-center">Failed to load trace data.</div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}
