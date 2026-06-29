"use client";

import React from 'react';
import { useGlobalDeal } from './GlobalDealProvider';
import { InvestmentReadinessMeter } from './InvestmentReadinessMeter';
import { Building2, Activity, PlayCircle, CheckCircle2, CircleDashed } from 'lucide-react';
import { motion } from 'framer-motion';

export function AutonomousSidebar() {
  const { state, loading, simulateAutonomous } = useGlobalDeal();

  if (loading || !state) {
    return (
      <div className="w-80 border-r border-gray-800 bg-gray-950 p-6 flex flex-col min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-2/3"></div>
          <div className="h-4 bg-gray-800 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const deal = state.deal;
  const auto = state.autonomous;

  // Mock metrics for Investment Readiness Meter
  const metrics = {
    researchCompleteness: 85,
    evidenceCompleteness: 60,
    financialConfidence: 70,
    founderValidation: 90,
    marketConfidence: 75
  };
  const overallScore = 76;

  return (
    <div className="w-80 border-r border-gray-800 bg-[#0c0c0e] flex flex-col h-screen overflow-y-auto shrink-0 sticky top-0">
      <div className="p-6 border-b border-gray-800/60">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              {deal.startup_name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Building2 size={12} /> {deal.sector}</span>
              <span>•</span>
              <span>{deal.stage}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <InvestmentReadinessMeter metrics={metrics} overallScore={overallScore} />
        </div>
      </div>

      <div className="p-6 border-b border-gray-800/60 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Pipeline</h3>
          {auto.progress < 100 && auto.stage !== 'Pending' && (
            <Activity className="text-emerald-500 animate-pulse" size={14} />
          )}
        </div>

        {auto.stage === 'Pending' ? (
          <div className="text-center py-8">
            <button 
              onClick={simulateAutonomous}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <PlayCircle size={16} /> Run Full Pipeline
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400">{auto.stage}</span>
                <span className="text-gray-400">{auto.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${auto.progress}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
              {auto.timeline.map((event: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-gray-800 bg-gray-900 text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                     <CheckCircle2 size={12} />
                  </div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-gray-800/50 bg-gray-900/50 shadow-sm">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className="font-bold text-gray-200 text-xs">{event.title}</div>
                      <time className="text-[10px] font-mono text-gray-500">{event.time}</time>
                    </div>
                    <div className="text-gray-400 text-[10px] leading-relaxed">{event.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {auto.logs.length > 0 && (
              <div className="mt-8 bg-black border border-gray-800 p-3 rounded-lg font-mono text-[10px] text-emerald-500/70 h-32 overflow-y-auto">
                {auto.logs.map((log: string, i: number) => (
                  <div key={i} className="mb-1">{log}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {state.partner_questions && state.partner_questions.length > 0 && (
        <div className="p-6">
           <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">AI IC Partner</h3>
           <ul className="space-y-3">
             {state.partner_questions.map((q, i) => (
               <li key={i} className="text-xs text-gray-300 bg-gray-800/30 p-2.5 rounded-lg border border-gray-800/50 leading-relaxed">
                 <span className="text-indigo-400 font-bold mr-1">Q:</span>{q}
               </li>
             ))}
           </ul>
        </div>
      )}
    </div>
  );
}
