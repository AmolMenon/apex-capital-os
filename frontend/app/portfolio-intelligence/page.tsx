"use client";

import React from 'react';
import { useGlobalPortfolio } from "@/components/GlobalPortfolioProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, TrendingUp, Users, Target, Activity } from "lucide-react";

export default function PortfolioIntelligence() {
  const { deals, loading } = useGlobalPortfolio();

  if (loading) return <div className="p-12 text-center animate-pulse">Loading Analytics...</div>;

  const totalDeals = deals.length;
  const inPipeline = deals.filter(d => !['Approved', 'Passed'].includes(d.status)).length;
  const approved = deals.filter(d => d.status === 'Approved').length;
  const passed = deals.filter(d => d.status === 'Passed').length;
  
  // Dummy conversion rate
  const conversionRate = totalDeals > 0 ? ((approved / totalDeals) * 100).toFixed(1) : "0";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <BarChart className="w-8 h-8 text-indigo-500" />
          Portfolio Intelligence
        </h1>
        <p className="text-muted-foreground mt-2">Firm-wide analytics, conversion rates, and stage-by-stage insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
               <Target className="w-4 h-4 mr-2" /> Total Deals Analyzed
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalDeals}</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
               <Activity className="w-4 h-4 mr-2" /> Active in Pipeline
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{inPipeline}</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
               <Users className="w-4 h-4 mr-2" /> Approved
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{approved}</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
               <TrendingUp className="w-4 h-4 mr-2" /> Approval Rate
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              Sector Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-border/50 bg-muted/10">
            {/* Placeholder for actual chart */}
            <div className="text-center text-muted-foreground">
               <p className="font-medium">Sectors Analyzed</p>
               <div className="mt-4 flex flex-wrap gap-2 justify-center">
                 <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs">Enterprise SaaS (45%)</span>
                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs">Fintech (30%)</span>
                 <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs">Healthtech (25%)</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-emerald-400" />
              Funnel Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-center px-8 border-t border-border/50 bg-muted/10 space-y-4">
             {/* Funnel visualization */}
             <div className="w-full bg-muted rounded-full h-8 overflow-hidden flex items-center relative">
               <div className="absolute inset-y-0 left-0 bg-blue-500/50 w-full rounded-full flex items-center px-4 text-xs font-bold shadow-sm">New (100%)</div>
             </div>
             <div className="w-[80%] mx-auto bg-muted rounded-full h-8 overflow-hidden flex items-center relative">
               <div className="absolute inset-y-0 left-0 bg-indigo-500/60 w-full rounded-full flex items-center px-4 text-xs font-bold shadow-sm">Partner Review (80%)</div>
             </div>
             <div className="w-[40%] mx-auto bg-muted rounded-full h-8 overflow-hidden flex items-center relative">
               <div className="absolute inset-y-0 left-0 bg-purple-500/70 w-full rounded-full flex items-center px-4 text-xs font-bold shadow-sm text-white">IC (40%)</div>
             </div>
             <div className="w-[15%] mx-auto bg-muted rounded-full h-8 overflow-hidden flex items-center relative">
               <div className="absolute inset-y-0 left-0 bg-emerald-500 w-full rounded-full flex items-center justify-center text-xs font-bold shadow-sm text-white">Approved (15%)</div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
