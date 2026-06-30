"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

export function DealTimeline({ currentStageIndex = 6 }: { currentStageIndex?: number }) {
  const steps = [
    "Pitch Received",
    "Research Complete",
    "AI Evaluation",
    "Claim Verification",
    "Due Diligence",
    "Partner Notes",
    "IC Memo",
    "Decision",
    "Portfolio Monitoring"
  ];

  return (
    <div className="w-full py-4 overflow-x-auto scrollbar-hide">
      <div className="min-w-[800px] flex items-center justify-between relative px-2">
        {/* Background Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-muted z-0"></div>
        
        {/* Active Animated Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(Math.min(currentStageIndex, steps.length - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 z-0 origin-left"
        ></motion.div>

        {steps.map((step, i) => {
          const isCompleted = i < currentStageIndex;
          const isActive = i === currentStageIndex;
          
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2 group w-24">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.15, type: "spring" }}
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-background
                  ${isCompleted ? 'border-emerald-500 text-emerald-500' : 
                    isActive ? 'border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 
                    'border-muted-foreground/30 text-muted-foreground/30'}`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4 bg-background rounded-full" /> : 
                 isActive ? <ArrowRight className="w-3 h-3" /> : 
                 <Circle className="w-2 h-2 fill-current" />}
              </motion.div>
              <span className={`text-[9px] font-bold uppercase tracking-widest text-center leading-tight transition-colors duration-500
                ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 
                  isActive ? 'text-primary' : 
                  'text-muted-foreground'}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
