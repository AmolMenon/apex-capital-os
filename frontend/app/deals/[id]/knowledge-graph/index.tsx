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

      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 min-h-[400px] relative overflow-hidden flex items-center justify-center">
        {/* Visual SVG Knowledge Graph Mock */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <g stroke="url(#edgeGradient)" strokeWidth="2" fill="none">
             {/* Center to Left */}
             <path d="M 50% 50% Q 40% 40% 30% 30%" />
             {/* Center to Top Right */}
             <path d="M 50% 50% Q 65% 35% 75% 25%" />
             {/* Center to Bottom */}
             <path d="M 50% 50% Q 55% 65% 50% 80%" />
             {/* Center to Bottom Right */}
             <path d="M 50% 50% Q 70% 60% 80% 70%" />
             {/* Cross connection */}
             <path d="M 75% 25% Q 80% 45% 80% 70%" />
          </g>
        </svg>

        <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
           <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center font-bold text-red-500 z-10 shadow-lg shadow-red-500/20">Competitor</div>
           <span className="text-xs font-semibold text-neutral-400 bg-neutral-900 px-2 rounded-full border border-neutral-800">Competes With</span>
        </div>

        <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
           <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-500 z-10 shadow-lg shadow-emerald-500/20">Stripe</div>
           <span className="text-xs font-semibold text-neutral-400 bg-neutral-900 px-2 rounded-full border border-neutral-800">Former Emp</span>
        </div>

        <div className="absolute top-[80%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
           <div className="w-16 h-16 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center font-bold text-indigo-500 z-10 shadow-lg shadow-indigo-500/20">Fund II</div>
           <span className="text-xs font-semibold text-neutral-400 bg-neutral-900 px-2 rounded-full border border-neutral-800">Sell To</span>
        </div>

        <div className="absolute top-[70%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
           <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center font-bold text-amber-500 z-10 shadow-lg shadow-amber-500/20">Sam Altman</div>
           <span className="text-xs font-semibold text-neutral-400 bg-neutral-900 px-2 rounded-full border border-neutral-800">Angel</span>
        </div>

        {/* Central Node */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground z-20 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
           Target Deal
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
