"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Network, Search, AlertTriangle, Lightbulb, Link2, ShieldAlert, BookOpen, Clock, Activity } from "lucide-react";

export default function KnowledgeGraphPage() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getCrossDealInsights();
        setInsights(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-neutral-500">
        <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading Investment Knowledge Graph...</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="p-10 text-center text-neutral-500">
        <p>Failed to load knowledge graph.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-indigo-900 p-8 rounded-2xl shadow-2xl relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
              <Network className="w-8 h-8 mr-3 text-indigo-400" />
              Investment Knowledge Graph
            </h1>
            <p className="text-indigo-200 max-w-2xl text-lg">
              The institutional memory layer. Apex connects companies, risks, sources, and IC decisions across the entire workspace to identify compounding patterns.
            </p>
          </div>
          <button 
            onClick={() => api.rebuildKnowledgeGraph().then(() => window.location.reload())}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            Rebuild Graph
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Learning Loop Feed */}
        <div className="col-span-3 lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Fund Learning Loop
            </h2>
            <div className="space-y-4">
              {insights.learning_loop?.map((node: any, idx: number) => (
                <div key={idx} className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">{node.learning}</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">{node.why_it_matters}</p>
                  <div className="pt-3 border-t border-yellow-200 dark:border-yellow-900/30">
                    <p className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase tracking-widest mb-1">Recommended Change</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">{node.suggested_workflow_change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <Search className="w-5 h-5 mr-2 text-indigo-500" />
              Recurring Diligence Gaps
            </h2>
            <div className="space-y-3">
              {insights.diligence_gaps?.map((gap: any, idx: number) => (
                <div key={idx} className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="font-medium text-neutral-900 dark:text-white">{gap.required_document}</p>
                  <p className="text-xs text-neutral-500 mt-1">Found in: {gap.affected_deals.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3 lg:col-span-2 space-y-6">
          {/* Pattern Findings */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <Network className="w-5 h-5 mr-2 text-blue-500" />
              Cross-Deal Pattern Detection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.patterns?.map((pattern: any, idx: number) => (
                <div key={idx} className="p-4 border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">{pattern.pattern_type}</span>
                  <p className="font-semibold text-neutral-900 dark:text-white mb-2">{pattern.description}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{pattern.implication}</p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {pattern.deals_affected.map((d: string) => (
                      <span key={d} className="px-2 py-1 bg-white dark:bg-black/20 border border-blue-200 dark:border-blue-800/50 rounded-md text-xs font-medium text-blue-700 dark:text-blue-300">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Memory */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-emerald-500" />
              Historical Decision Memory
            </h2>
            <div className="space-y-4">
              {insights.decision_memory?.map((mem: any, idx: number) => (
                <div key={idx} className="flex items-start p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <div className={`shrink-0 w-2 h-2 mt-2 rounded-full mr-4 ${mem.recommendation === 'Pass' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-neutral-900 dark:text-white">{mem.company_name}</span>
                      <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-xs font-medium text-neutral-700 dark:text-neutral-300">{mem.deal_type}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-widest ${mem.recommendation === 'Pass' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                        {mem.recommendation}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                      <span className="font-medium text-neutral-900 dark:text-neutral-200">What changed the decision: </span>
                      {mem.what_changed_the_decision}
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="text-xs">
                        <span className="text-neutral-500">IC Blockers: </span>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">{mem.decision_blockers.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
