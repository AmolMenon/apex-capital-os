"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, animate } from 'framer-motion';
import { Info, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface ExplainableScoreProps {
  score: number;
  confidence: number;
  supportingFactors: string[];
  weaknesses: string[];
  missingInfo: string[];
  label?: string;
}

export function ExplainableScore({
  score,
  confidence,
  supportingFactors = [],
  weaknesses = [],
  missingInfo = [],
  label = "Score"
}: ExplainableScoreProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Color determination based on score
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-yellow-500';
    return 'text-rose-500';
  };
  
  const getBgColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (s >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div 
      className="relative flex items-center gap-3 cursor-pointer group"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className={`px-4 py-2 rounded-xl border ${getBgColor(score)} flex flex-col items-center justify-center min-w-[80px]`}>
        <motion.div 
          key={score}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-2xl font-bold ${getScoreColor(score)} font-mono tracking-tighter`}
        >
          {score}
        </motion.div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</div>
      </div>
      
      <div className="flex flex-col justify-center">
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Info size={12} />
          {confidence}% Confidence
        </div>
      </div>

      {showDetails && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-4 z-50 text-sm"
        >
          {supportingFactors.length > 0 && (
            <div className="mb-3">
              <h4 className="text-emerald-400 font-semibold flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                <CheckCircle2 size={14} /> Supporting
              </h4>
              <ul className="space-y-1">
                {supportingFactors.map((factor, i) => (
                  <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {weaknesses.length > 0 && (
            <div className="mb-3">
              <h4 className="text-rose-400 font-semibold flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                <AlertTriangle size={14} /> Weaknesses
              </h4>
              <ul className="space-y-1">
                {weaknesses.map((weakness, i) => (
                  <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5">
                    <span className="text-rose-500 mt-0.5">•</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {missingInfo.length > 0 && (
            <div>
              <h4 className="text-yellow-400 font-semibold flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                <HelpCircle size={14} /> Missing Context
              </h4>
              <ul className="space-y-1">
                {missingInfo.map((info, i) => (
                  <li key={i} className="text-gray-300 text-xs flex items-start gap-1.5">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {info}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
