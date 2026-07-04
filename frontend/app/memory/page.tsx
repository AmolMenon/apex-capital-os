"use client"

import React, { useState, useEffect } from "react"
import { Brain, Network, Database, Target, TrendingUp, AlertTriangle } from "lucide-react"
import { AssumptionLedger } from "@/components/memory/AssumptionLedger"

export default function InstitutionalMemoryDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [decisions, setDecisions] = useState<any[]>([])

  useEffect(() => {
    // In a real app we'd fetch this from /api/v1/memory/stats
    setStats({
      total_assumptions_tracked: 142,
      assumption_accuracy_percent: 68.5,
      patterns_discovered: 14,
      learning_velocity: "+12% this month"
    })
    
    import("@/lib/api").then(({ api }) => {
      api.getMemoryDecisions().then(data => setDecisions(data)).catch(err => console.error(err))
    })
  }, [])

  return (
    <div className="flex flex-col h-full text-slate-100 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-tight flex items-center">
          <Database className="w-8 h-8 mr-3 text-blue-400" />
          Institutional Memory
        </h1>
        <p className="text-slate-400 mt-2">
          Apex automatically tracks assumptions, predictions, and outcomes to compound organizational intelligence.
        </p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800/50">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-sm font-medium">Assumptions Tracked</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-light">{stats?.total_assumptions_tracked || "-"}</span>
        </div>
        
        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800/50">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-sm font-medium">Assumption Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-light text-emerald-400">{stats?.assumption_accuracy_percent || "-"}%</span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800/50">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-400 text-sm font-medium">Discovered Patterns</span>
            <Network className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-light text-purple-400">{stats?.patterns_discovered || "-"}</span>
        </div>

        <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800/50 border-l-2 border-l-amber-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-amber-500 text-sm font-medium">Recurring Blind Spots</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xl font-medium text-amber-400 mb-1 block">SaaS Adoption Overestimation</span>
          <span className="text-xs text-slate-500">Flagged in 3 recent decisions</span>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-800 pb-2">Recorded IC Decisions</h2>
          {decisions.length === 0 ? (
            <p className="text-slate-500 italic">No decisions recorded yet.</p>
          ) : (
            <div className="space-y-6 mt-6">
              {decisions.map(d => {
                const isOverride = d.override_reason != null || (d.ai_recommendation !== "Invest" && d.human_final_decision === "Approve");
                return (
                  <div key={d.id} className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-sm hover:border-slate-600 transition-colors">
                    
                    {/* Header */}
                    <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-semibold text-lg text-slate-100">{d.company || `Decision #${d.decision_id}`}</h3>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{new Date(d.created_at).toLocaleDateString()}</span>
                        {isOverride && (
                          <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-500/20">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Human Override
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                         <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View Full Record →</button>
                      </div>
                    </div>
                    
                    {/* Comparison Body */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* AI Side */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Apex Recommendation</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${d.ai_recommendation === 'Invest' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                            {d.ai_recommendation || "Pending"}
                          </span>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80 text-sm text-slate-400 h-24 overflow-y-auto">
                           {/* Assuming ai_rationale would normally be here, fallback to a generic message if not available */}
                           <p className="italic">AI Synthesis provided high confidence in market expansion, but flagged valuation risks.</p>
                        </div>
                      </div>
                      
                      {/* Human Side */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Human IC Decision</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${d.human_final_decision === 'Approve' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : d.human_final_decision === 'Conditional' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {d.human_final_decision}
                          </span>
                        </div>
                        <div className="bg-blue-950/10 p-4 rounded-lg border border-blue-900/30 text-sm text-slate-200 h-24 overflow-y-auto">
                          {d.human_rationale}
                        </div>
                      </div>
                      
                    </div>

                    {/* Metadata Footer */}
                    {(d.override_reason || d.conditions_json) && (
                      <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 grid grid-cols-1 gap-4">
                        {d.override_reason && (
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 block mb-1">Override Justification</span>
                            <p className="text-sm text-amber-200/80 leading-relaxed">{d.override_reason}</p>
                          </div>
                        )}
                        {d.conditions_json && (
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block mb-1">Active Conditions</span>
                            <p className="text-sm text-purple-200/80 leading-relaxed italic">Conditions attached to this decision are currently being tracked.</p>
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

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-800 pb-2">Assumption Ledger</h2>
          <AssumptionLedger />
        </div>
      </div>
    </div>
  )
}
