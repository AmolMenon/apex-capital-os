"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Target, Database, Cpu, Search, Briefcase } from "lucide-react";
import { PageHelpBanner } from "@/components/ui/PageHelpBanner";

export default function InvestmentPlaybooks() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-indigo-500" />
          Investment Playbooks
        </h1>
        <p className="text-muted-foreground mt-1">Algorithmic benchmarks and thesis templates derived from our top-performing portfolio companies.</p>
      </div>

      <PageHelpBanner 
        title="Institutional Memory" 
        explanation="Apex Capital encodes past successes and failures into structured playbooks. When assessing a new deal, the AI compares the target's metrics against these verified benchmarks."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Playbook 1: Vertical SaaS */}
        <Card className="border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
          <CardHeader className="border-b border-border/50 bg-indigo-500/5">
            <div className="flex justify-between items-start">
               <div>
                 <CardTitle className="flex items-center gap-2 text-indigo-500">
                   <Briefcase className="w-5 h-5" /> Vertical SaaS (B2B)
                 </CardTitle>
                 <CardDescription className="mt-1">High-ACV workflow automation for traditional industries.</CardDescription>
               </div>
               <Badge className="bg-indigo-500">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
             <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                   <Target className="w-4 h-4" /> Expected Benchmarks (Series A)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="border border-border/50 p-3 rounded-lg bg-background">
                      <div className="text-xs text-muted-foreground mb-1">Net Revenue Retention</div>
                      <div className="font-bold text-lg text-emerald-500">{'>'} 120%</div>
                   </div>
                   <div className="border border-border/50 p-3 rounded-lg bg-background">
                      <div className="text-xs text-muted-foreground mb-1">Gross Margin</div>
                      <div className="font-bold text-lg text-emerald-500">{'>'} 80%</div>
                   </div>
                   <div className="border border-border/50 p-3 rounded-lg bg-background">
                      <div className="text-xs text-muted-foreground mb-1">Payback Period</div>
                      <div className="font-bold text-lg text-emerald-500">{'<'} 14 mos</div>
                   </div>
                   <div className="border border-border/50 p-3 rounded-lg bg-background">
                      <div className="text-xs text-muted-foreground mb-1">LTV:CAC</div>
                      <div className="font-bold text-lg text-emerald-500">{'>'} 4.0x</div>
                   </div>
                </div>
             </div>
             
             <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Failure Patterns to Avoid</h4>
                <ul className="text-sm space-y-2 text-red-400">
                   <li>• Professional services revenue exceeds 20% of total ARR.</li>
                   <li>• Founder-led sales haven't transitioned to repeatable rep quotas.</li>
                   <li>• High churn in the long-tail SMB segment.</li>
                </ul>
             </div>
          </CardContent>
        </Card>

        {/* Playbook 2: Applied AI */}
        <Card className="border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
          <CardHeader className="border-b border-border/50 bg-emerald-500/5">
            <div className="flex justify-between items-start">
               <div>
                 <CardTitle className="flex items-center gap-2 text-emerald-500">
                   <Cpu className="w-5 h-5" /> Applied AI & Agents
                 </CardTitle>
                 <CardDescription className="mt-1">GenAI applications replacing human labor or creating net-new software paradigms.</CardDescription>
               </div>
               <Badge className="bg-emerald-500">High Conviction</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
             <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                   <Target className="w-4 h-4" /> Expected Benchmarks (Series A)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="border border-border/50 p-3 rounded-lg bg-background">
                      <div className="text-xs text-muted-foreground mb-1">ARR Growth (YoY)</div>
                      <div className="font-bold text-lg text-emerald-500">{'>'} 300%</div>
                   </div>
                   <div className="border border-border/50 p-3 rounded-lg bg-background">
                      <div className="text-xs text-muted-foreground mb-1">Gross Margin (Post-Compute)</div>
                      <div className="font-bold text-lg text-amber-500">{'>'} 60%</div>
                   </div>
                   <div className="border border-border/50 p-3 rounded-lg bg-background">
                      <div className="text-xs text-muted-foreground mb-1">NDR (Net Dollar Retention)</div>
                      <div className="font-bold text-lg text-emerald-500">{'>'} 130%</div>
                   </div>
                   <div className="border border-border/50 p-3 rounded-lg bg-background">
                      <div className="text-xs text-muted-foreground mb-1">Time to Value</div>
                      <div className="font-bold text-lg text-emerald-500">{'<'} 1 Day</div>
                   </div>
                </div>
             </div>
             
             <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Failure Patterns to Avoid</h4>
                <ul className="text-sm space-y-2 text-red-400">
                   <li>• Thin wrapper around OpenAI API with no proprietary data moat.</li>
                   <li>• Margins compressing as inference costs scale linearly with revenue.</li>
                   <li>• High initial adoption followed by massive churn (tourist users).</li>
                </ul>
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
