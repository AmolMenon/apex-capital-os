"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronUp, ChevronDown, TrendingUp, AlertTriangle, Users } from "lucide-react";

const INSIGHTS = [
  {
    id: 1,
    icon: TrendingUp,
    title: "Portfolio Trend Detected",
    content: "Three fintech companies in the active pipeline are showing improving net dollar retention (NDR > 120%).",
    color: "emerald"
  },
  {
    id: 2,
    icon: Users,
    title: "Exceptional Talent Signal",
    content: "AI detects unusually high founder quality in 'Sarvam AI' based on previous GitHub contributions and network density.",
    color: "indigo"
  },
  {
    id: 3,
    icon: AlertTriangle,
    title: "Valuation Anomaly",
    content: "Acme Corp is overpriced by 40% compared to peer group medians in the Enterprise SaaS category.",
    color: "rose"
  }
];

export function SmartInsightsWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate insights every 10 seconds if open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const insight = INSIGHTS[currentIndex];
  const Icon = insight.icon;

  const colorClasses = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20"
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-[350px] bg-card/90 backdrop-blur-md border shadow-2xl rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
              <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" /> Autonomous Insights
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentIndex((prev) => (prev - 1 + INSIGHTS.length) % INSIGHTS.length)} className="p-1 hover:bg-muted rounded text-muted-foreground"><ChevronUp className="w-3 h-3" /></button>
                <button onClick={() => setCurrentIndex((prev) => (prev + 1) % INSIGHTS.length)} className="p-1 hover:bg-muted rounded text-muted-foreground"><ChevronDown className="w-3 h-3" /></button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded text-muted-foreground ml-1"><X className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="p-4 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-3"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${colorClasses[insight.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {insight.content}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Sparkles className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}
