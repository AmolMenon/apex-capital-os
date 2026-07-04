"use client"

import React from "react"
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react"

export function ExecutionTracker({ decisionId }: { decisionId: string }) {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Execution Plan</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/20">
          Generate Action Plan
        </button>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Milestones & Tasks</h3>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 mr-4" />
            <div className="flex-1">
              <h4 className="text-slate-200 font-medium">Finalize Term Sheet</h4>
              <p className="text-sm text-slate-500 mt-1">Owner: Legal Team • Completed Oct 12</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-blue-400 mt-0.5 mr-4 animate-pulse" />
            <div className="flex-1">
              <h4 className="text-blue-400 font-medium">Regulatory Filing</h4>
              <p className="text-sm text-slate-500 mt-1">Owner: Compliance • Due Next Week</p>
              
              <div className="mt-4 bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs text-blue-400 font-bold">AI</span>
                  </div>
                  <div>
                    <h5 className="text-sm text-blue-300 font-medium">AI Intervention Suggested</h5>
                    <p className="text-xs text-blue-400/80 mt-1 leading-relaxed">
                      Based on recent EU changes, filing requirements have updated. Do you want the AI to draft an amended appendix?
                    </p>
                    <button className="mt-3 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-md text-xs transition-colors flex items-center">
                      Draft Amendment <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Circle className="w-5 h-5 text-slate-600 mt-0.5 mr-4" />
            <div className="flex-1">
              <h4 className="text-slate-500 font-medium">Board Approval</h4>
              <p className="text-sm text-slate-600 mt-1">Owner: Lead Partner • Blocked by Regulatory</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
