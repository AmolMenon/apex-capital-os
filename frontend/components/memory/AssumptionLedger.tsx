"use client"

import React, { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"

export function AssumptionLedger() {
  const [assumptions, setAssumptions] = useState<any[]>([])

  useEffect(() => {
    // In a real app we'd fetch from /api/v1/memory/assumptions
    setAssumptions([
      { id: 1, decision_id: 999, category: "Market", statement: "Competitor will not lower prices.", confidence: 60, status: "Invalidated", accuracy: 0.1 },
      { id: 2, decision_id: 1000, category: "Technology", statement: "LLM inference costs will decrease by 50% YoY.", confidence: 80, status: "Unverified", accuracy: null },
      { id: 3, decision_id: 888, category: "Regulatory", statement: "GDPR compliance will require 2 full-time hires.", confidence: 90, status: "Verified", accuracy: 0.95 }
    ])
  }, [])

  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800/50">
          <tr>
            <th className="px-6 py-4 font-medium">Assumption Statement</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Initial Confidence</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Accuracy Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {assumptions.map((a) => (
            <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-200">
                {a.statement}
                <span className="block text-xs text-slate-500 mt-1">From Decision #{a.decision_id}</span>
              </td>
              <td className="px-6 py-4">
                <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-xs">{a.category}</span>
              </td>
              <td className="px-6 py-4 text-slate-300">{a.confidence}%</td>
              <td className="px-6 py-4">
                {a.status === "Verified" && <span className="flex items-center text-emerald-400"><CheckCircle2 className="w-4 h-4 mr-1.5"/> Verified</span>}
                {a.status === "Unverified" && <span className="flex items-center text-amber-400"><AlertCircle className="w-4 h-4 mr-1.5"/> Unverified</span>}
                {a.status === "Invalidated" && <span className="flex items-center text-rose-400"><XCircle className="w-4 h-4 mr-1.5"/> Invalidated</span>}
              </td>
              <td className="px-6 py-4 text-right">
                {a.accuracy !== null ? (
                  <span className={`font-mono ${a.accuracy > 0.7 ? "text-emerald-400" : a.accuracy < 0.4 ? "text-rose-400" : "text-amber-400"}`}>
                    {(a.accuracy * 100).toFixed(0)}%
                  </span>
                ) : (
                  <span className="text-slate-600">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
