"use client";

import { Database, Search } from "lucide-react";
import { InsightCard } from "@/components/InsightCard";

export default function MemoryPage() {
  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Institutional Memory</h1>
          <p className="text-muted-foreground mt-2">Search past investment cases, IC discussions, and rejected deals.</p>
        </div>
      </div>

      <div className="relative max-w-2xl">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Ask Apex anything about past deals..." 
          className="w-full pl-12 pr-4 py-4 bg-secondary/30 border border-border/50 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-border shadow-sm"
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" /> Surfaced Context
        </h2>
        
        <div className="space-y-4">
          <InsightCard 
            title="Pattern Detected: Enterprise AI Sales Cycles"
            type="info"
            content="Based on 4 past investments (including rejected deal 'Omni AI' in 2023), enterprise AI products typically experience 9-12 month sales cycles, contrary to founder projections of 3-6 months."
            recommendation="Apply a 2x multiple to the time-to-close assumption in Nova AI's financial model."
          />

          <div className="p-5 border rounded-lg bg-card">
            <h3 className="font-semibold text-sm mb-3">Historical IC Discussion: Omni AI (Rejected 2023)</h3>
            <div className="border-l-2 border-border/50 ml-2 pl-4 space-y-4 text-sm">
              <div>
                <span className="font-medium">Partner A:</span> "The tech is great, but they are underestimating how long it takes a bank's infosec team to approve an LLM deployment."
              </div>
              <div>
                <span className="font-medium">Partner B:</span> "Agreed. Until we see a repeatable motion that bypasses procurement, this is too capital intensive."
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs font-medium text-muted-foreground">
              Tag: High CAC, Long Sales Cycle, Enterprise AI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
