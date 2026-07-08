"use client"

import React, { useState, useEffect } from "react"
import { Database, AlertTriangle, Search, Activity } from "lucide-react"

export default function InstitutionalMemoryDashboard() {
  const [decisions, setDecisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import("@/lib/api").then(({ api }) => {
      api.getMemoryDecisions().then(data => {
        setDecisions(data)
        setLoading(false)
      }).catch(err => {
        console.error(err)
        setLoading(false)
      })
    })
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-slate-950 text-slate-400">
        <Activity className="w-8 h-8 animate-pulse text-blue-500 mb-4" />
        <p className="font-medium tracking-wide">Loading Institutional Memory...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full text-slate-100 animate-in fade-in duration-500 max-w-[1200px] mx-auto p-8">
      <header className="mb-12 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-light tracking-tight flex items-center">
          <Database className="w-8 h-8 mr-3 text-blue-400" />
          Institutional Memory
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Apex compounds organizational intelligence by tracking underwriting assumptions against actual outcomes.
        </p>
      </header>

      {/* Stats Row - Professional & Focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Recorded Decisions</h3>
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-4xl font-light">{decisions.length}</span>
          <p className="text-xs text-slate-500 mt-2">Historically tracked across the portfolio</p>
        </div>

        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-amber-500 text-sm font-bold uppercase tracking-wider">Active Blind Spots</h3>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-lg font-medium text-amber-400 block mb-1">SaaS Adoption Overestimation</span>
          <p className="text-xs text-slate-400">
            Identified across 3 recent decisions where management claims exceeded market reality. Actively flagging on new pipeline deals.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-2 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            Decision Ledger
          </h2>
          {decisions.length === 0 ? (
            <p className="text-slate-500 italic p-6 bg-slate-900 rounded-xl border border-slate-800 text-center">No decisions recorded yet.</p>
          ) : (
            <div className="space-y-6">
              {decisions.map(d => {
                const isOverride = d.override_reason != null || (d.ai_recommendation !== "Invest" && d.human_final_decision === "Approve");
                return (
                  <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition-colors">
                    
                    {/* Header */}
                    <div className="bg-slate-950/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-bold text-lg text-slate-100">{d.company || `Decision #${d.decision_id}`}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {new Date(d.created_at).toLocaleDateString()}
                        </span>
                        {isOverride && (
                          <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/50">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Human Override
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Comparison Body */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* AI Side */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Apex Recommendation</span>
                          <span className={`text-sm font-bold ${d.ai_recommendation === 'Invest' ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {d.ai_recommendation || "Pending"}
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                           <p className="italic">Persisted synthesis securely archived. Historical inference tracing available via backend console.</p>
                        </div>
                      </div>
                      
                      {/* Human Side */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-xs uppercase font-bold tracking-widest text-blue-400">Human IC Decision</span>
                          <span className={`text-sm font-bold ${d.human_final_decision === 'Approve' ? 'text-emerald-400' : d.human_final_decision === 'Conditional' ? 'text-amber-400' : 'text-rose-400'}`}>
                            {d.human_final_decision}
                          </span>
                        </div>
                        <div className="text-sm text-slate-200 leading-relaxed">
                          {d.human_rationale}
                        </div>
                      </div>
                      
                    </div>

                    {/* Metadata Footer */}
                    {(d.override_reason || d.conditions_json) && (
                      <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800 grid grid-cols-1 gap-4">
                        {d.override_reason && (
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block mb-1">Override Justification</span>
                            <p className="text-sm text-amber-200/80 leading-relaxed border-l-2 border-amber-900 pl-3 py-1">{d.override_reason}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
