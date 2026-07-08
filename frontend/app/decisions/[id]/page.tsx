"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { OverviewPanel } from "@/components/workspace/OverviewPanel"
import { EvidenceExplorer } from "@/components/workspace/EvidenceExplorer"
import { InvestmentAnalysis } from "@/components/workspace/InvestmentAnalysis"
import { DecisionWorkspace } from "@/components/workspace/DecisionWorkspace"
import { api } from "@/lib/api"

const TABS = ["Deal Workspace", "Evidence", "Investment Analysis", "Decision"]

export default function VCDecisionWorkspace() {
  const params = useParams()
  const decisionId = params.id as string
  const [activeTab, setActiveTab] = useState("Deal Workspace")
  const [decisionData, setDecisionData] = useState<any>(null)
  const [evaluationData, setEvaluationData] = useState<any>(null)
  
  useEffect(() => {
    Promise.all([
      api.get(`/api/v1/decisions/${decisionId}`),
      api.get(`/api/v1/decisions/${decisionId}/evaluate`).catch(() => null)
    ]).then(([dData, eData]) => {
      setDecisionData(dData)
      setEvaluationData(eData)
    }).catch(err => console.error("Failed to load data", err))
  }, [decisionId])

  const subjectName = decisionData?.subject?.name || "Loading..."
  const metadata = decisionData?.subject?.metadata_json ? JSON.parse(decisionData.subject.metadata_json) : {}
  const recommendation = evaluationData?.synthesis?.recommendation_type || "PENDING"
  const confidence = evaluationData?.synthesis?.model_confidence || 0
  const integrityStatus = evaluationData?.decision_integrity?.status || "PENDING"

  return (
    <div className="flex flex-col h-full text-slate-100 animate-in fade-in duration-500 bg-slate-950">
      
      {/* Header */}
      <header className="flex flex-col gap-6 px-6 py-6 border-b border-slate-800 bg-slate-900/40">
        <div className="flex justify-between items-start w-full">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-3">{subjectName}</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Sector</span>
              <span className="text-sm font-semibold text-slate-200">{metadata.sector || "Enterprise AI"}</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Stage</span>
              <span className="text-sm font-semibold text-slate-200">{metadata.stage || "Series A"}</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Round</span>
              <span className="text-sm font-semibold text-slate-200">{metadata.round_size || "$15M"}</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Diligence Stage</span>
              <span className="text-sm font-semibold text-blue-400">Final IC Review</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Recommendation</span>
              <span className={`text-sm font-bold ${recommendation === 'DEFER' ? 'text-amber-400' : recommendation === 'INVEST' ? 'text-emerald-400' : 'text-slate-300'}`}>
                {recommendation}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Evidence Strength</span>
              <span className="text-sm font-semibold text-slate-200">{confidence > 80 ? "High" : confidence > 60 ? "Moderate" : "Weak"}</span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Decision Blocker</span>
              <span className={`text-sm font-bold ${integrityStatus === 'BLOCKED_PENDING_REVIEW' ? 'text-rose-400' : integrityStatus === 'CLEAR' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {integrityStatus === 'BLOCKED_PENDING_REVIEW' ? 'Material Conflict' : integrityStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Last Evaluated</span>
              <span className="text-sm font-medium text-slate-300">Just now</span>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-start w-full">
          <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-inner">
            {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab
                  ? "bg-blue-600/20 text-blue-400 shadow-sm border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab}
            </button>
          ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        {activeTab === "Deal Workspace" && <OverviewPanel decisionId={decisionId} decisionData={decisionData} />}
        {activeTab === "Evidence" && <EvidenceExplorer decisionId={decisionId} />}
        {activeTab === "Investment Analysis" && <InvestmentAnalysis decisionId={decisionId} />}
        {activeTab === "Decision" && <DecisionWorkspace decisionId={decisionId} />}
      </main>
      
    </div>
  )
}
