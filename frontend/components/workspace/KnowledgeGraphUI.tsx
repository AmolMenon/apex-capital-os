"use client"

import React, { useState, useEffect } from "react"
import { Network, Search, Filter, FileText, AlertCircle, Target, ArrowDown } from "lucide-react"

export function KnowledgeGraphUI() {
  const [graphData, setGraphData] = useState<any>(null)

  useEffect(() => {
    // In a real app we'd fetch from /api/v1/memory/graph/{id}
    // Mocking the structure
    setGraphData({
      nodes: [
        { id: "n1", type: "Decision", content: "Seed Investment in BharatVector" },
        { id: "n2", type: "Assumption", content: "LLM inference costs decrease 50% YoY" },
        { id: "n3", type: "Evidence", content: "NVIDIA Earnings Call Q3" },
        { id: "n4", type: "Pattern", content: "Overestimating SaaS adoption speed" }
      ],
      edges: [
        { source: "n3", target: "n2", relationship: "SUPPORTS" },
        { source: "n2", target: "n1", relationship: "INFLUENCES" },
        { source: "n4", target: "n1", relationship: "WARNING_FOR" }
      ]
    })
  }, [])

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[500px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
        <h2 className="text-sm font-semibold uppercase tracking-wider flex items-center text-slate-300">
          <Network className="w-4 h-4 mr-2 text-indigo-400" />
          Provenance Lineage
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
        {graphData && (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            
            {/* Source Node */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <FileText className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-800 bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Source Document</span>
                  <span className="text-[9px] text-slate-600 font-mono">ID: n3</span>
                </div>
                <p className="text-sm text-slate-300 font-medium">NVIDIA Earnings Call Q3</p>
              </div>
            </div>

            {/* Relationship */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
               <div className="flex items-center justify-center w-10 h-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
               </div>
               <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] flex md:justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 shadow-sm flex items-center">
                    <ArrowDown className="w-3 h-3 mr-1" /> Supports
                  </span>
               </div>
            </div>

            {/* Assumption Node */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-amber-900/50 text-amber-500 border-amber-500/30 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-amber-900/30 bg-amber-950/20 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">Extracted Assumption</span>
                  <span className="text-[9px] text-slate-600 font-mono">ID: n2</span>
                </div>
                <p className="text-sm text-amber-200/90 font-medium">LLM inference costs decrease 50% YoY</p>
              </div>
            </div>
            
            {/* Relationship */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
               <div className="flex items-center justify-center w-10 h-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
               </div>
               <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] flex md:justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20 shadow-sm flex items-center">
                    <ArrowDown className="w-3 h-3 mr-1" /> Influences
                  </span>
               </div>
            </div>

            {/* Decision Node */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-blue-900/50 text-blue-400 border-blue-500/30 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Target className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-blue-900/30 bg-blue-950/20 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Target Decision</span>
                  <span className="text-[9px] text-slate-600 font-mono">ID: n1</span>
                </div>
                <p className="text-sm text-blue-200/90 font-medium">Seed Investment in BharatVector</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
