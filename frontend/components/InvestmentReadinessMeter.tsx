import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface ReadinessMeterProps {
  metrics: {
    researchCompleteness: number;
    evidenceCompleteness: number;
    financialConfidence: number;
    founderValidation: number;
    marketConfidence: number;
  };
  overallScore: number;
}

export function InvestmentReadinessMeter({ metrics, overallScore }: ReadinessMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-500 bg-amber-500/10';
    return 'text-red-500 bg-red-500/10';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const metricList = [
    { label: "Research", value: metrics.researchCompleteness },
    { label: "Evidence", value: metrics.evidenceCompleteness },
    { label: "Financial", value: metrics.financialConfidence },
    { label: "Founder", value: metrics.founderValidation },
    { label: "Market", value: metrics.marketConfidence },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">IC Readiness</h3>
        <div className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(overallScore)}`}>
          {overallScore}/100
        </div>
      </div>
      
      <div className="space-y-3">
        {metricList.map((m, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-[10px] font-medium text-gray-400">
              <span>{m.label}</span>
              <span>{m.value}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                className={`h-full ${getProgressColor(m.value)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
