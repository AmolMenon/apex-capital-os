"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Network, Search, AlertTriangle, Link2, BookOpen, Clock, Activity, Target } from "lucide-react";

export default function DealKnowledgeGraphPage() {
  const params = useParams() as any;
  const dealId = params.id;

  const [graphData, setGraphData] = useState<any>(null);
  const [similarDeals, setSimilarDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [graph, similar] = await Promise.all([
          api.getDealKnowledgeGraph(dealId),
          api.getSimilarDeals(dealId)
        ]);
        setGraphData(graph);
        setSimilarDeals(similar);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [dealId]);

  if (loading) {
    return (
      <div className="p-10 text-center text-neutral-500">
        <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading Deal Knowledge Graph...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center">
            <Network className="w-8 h-8 mr-3 text-indigo-500" />
            Knowledge Graph Overview
          </h1>
          <p className="text-neutral-500 max-w-3xl text-lg">
            This graph maps all verified relationships, risks, and similar benchmarks connected to this company across the entire fund's memory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Similar Deals Network */}
        <div className="col-span-3 lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center mb-6">
              <Target className="w-5 h-5 mr-2 text-indigo-500" />
              Similar Companies & Benchmarks
            </h2>
            
            {similarDeals.length > 0 ? (
              <div className="space-y-4">
                {similarDeals.map((deal: any, idx: number) => (
                  <div key={idx} className="p-5 bg-neutral-50 dark:bg-neutral-800/30 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                          {deal.company_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{deal.company_name}</h3>
                          <p className="text-sm text-neutral-500">Similarity Score: {deal.similarity_score}%</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {deal.useful_benchmark_reason}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1">Why Similar</p>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{deal.why_similar}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1">Key Differences</p>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{deal.key_differences}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 mb-2">Decision Context</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 bg-indigo-50 dark:bg-indigo-900/10 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                        {deal.decision_context}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500 bg-neutral-50 dark:bg-neutral-800/20 rounded-xl border border-neutral-200 dark:border-neutral-800 border-dashed">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No highly similar benchmarks found in the Knowledge Graph for this deal.</p>
              </div>
            )}
          </div>
        </div>

        {/* Graph Meta */}
        <div className="col-span-3 lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center mb-4">
              <Network className="w-5 h-5 mr-2 text-indigo-500" />
              Graph Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Total Connected Nodes</span>
                <span className="font-bold text-neutral-900 dark:text-white">{graphData?.nodes?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Verified Edges</span>
                <span className="font-bold text-neutral-900 dark:text-white">{graphData?.edges?.length || 0}</span>
              </div>
            </div>
            
            <button 
              onClick={() => api.rebuildDealKnowledgeGraph(dealId).then(() => window.location.reload())}
              className="w-full mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800/50"
            >
              Sync Latest Evidence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
