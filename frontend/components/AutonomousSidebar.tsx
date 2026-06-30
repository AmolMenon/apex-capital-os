"use client";

import React from 'react';
import { useGlobalDeal } from './GlobalDealProvider';
import { InvestmentReadinessMeter } from './InvestmentReadinessMeter';
import { Building2, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const WORKFLOW_STAGES = [
  { id: 'deal-room', label: 'Initial Screening', number: 1 },
  { id: 'research', label: 'Market & Competitor Analysis', number: 2 },
  { id: 'ecosystem', label: 'Ecosystem Intelligence', number: 3 },
  { id: 'verification', label: 'Diligence Verification', number: 4 },
  { id: 'diligence', label: 'Deep Diligence', number: 5 },
  { id: 'risk', label: 'Risk Assessment', number: 6 },
  { id: 'thesis', label: 'Investment Thesis', number: 7 },
  { id: 'ic-memo', label: 'IC Memo Preparation', number: 8 },
  { id: 'portfolio', label: 'Portfolio Integration', number: 9 },
];

export function AutonomousSidebar() {
  const { state, loading } = useGlobalDeal();
  const pathname = usePathname();

  if (loading || !state) {
    return (
      <div className="hidden xl:flex w-80 border-r border-gray-800 bg-gray-950 p-6 flex-col min-h-screen shrink-0">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-2/3"></div>
          <div className="h-4 bg-gray-800 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const deal = state.deal;
  
  // Calculate completion percentage based on current route for demo purposes
  const currentStageIndex = WORKFLOW_STAGES.findIndex(s => pathname.includes(`/deals/${deal.id}/${s.id}`));
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;
  const completionPercentage = Math.round(((activeIndex + 1) / WORKFLOW_STAGES.length) * 100);

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
    <div className="hidden xl:flex w-[320px] border-r border-gray-800 bg-[#0c0c0e] flex-col h-screen overflow-y-auto shrink-0 sticky top-0">
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
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Workflow Progress</h3>
          <span className="text-xs font-bold text-emerald-500">{completionPercentage}% Complete</span>
        </div>
        
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="space-y-1 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-800">
          {WORKFLOW_STAGES.map((stage, i) => {
            const isCompleted = i < activeIndex;
            const isActive = i === activeIndex;
            const isPending = i > activeIndex;
            
            return (
              <Link key={stage.id} href={`/deals/${deal.id}/${stage.id}`}>
                <div className={`relative flex items-center gap-4 p-2 rounded-lg transition-colors group cursor-pointer ${isActive ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border shadow-sm shrink-0 z-10 transition-colors
                    ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500' : 
                      isActive ? 'bg-primary/20 border-primary/50 text-primary' : 
                      'bg-[#0c0c0e] border-gray-700 text-gray-500 group-hover:border-gray-500'}`}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{stage.number}</span>}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm font-medium ${isCompleted ? 'text-gray-300' : isActive ? 'text-white font-bold' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {stage.label}
                    </span>
                    {isActive && <ChevronRight size={14} className="text-primary animate-pulse" />}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
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
