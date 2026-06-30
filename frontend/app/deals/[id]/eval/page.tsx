"use client";

import React, { useState } from 'react';
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Activity, ArrowUpRight, TrendingUp, Twitter, Linkedin, Building2, Podcast, History, Users } from "lucide-react";
import { DealRoomSkeleton } from "@/components/ui/DealRoomSkeleton";
import { TooltipHelper } from "@/components/ui/TooltipHelper";

export default function FounderProfile() {
  const { state, loading } = useGlobalDeal();
  const deal = state?.deal;

  if (loading) return <DealRoomSkeleton />;

  // Mock data for the founder
  const founder = {
    name: deal?.founder_name || "Alex Chen",
    role: "Co-Founder & CEO",
    score: 88,
    sentiment: "Highly Positive",
    traits: ["Visionary", "Technical", "Serial Founder"],
    background: "Previously Staff Engineer at Stripe. Scaled core billing infrastructure to handle $10B+ volume.",
    previousStartups: [
      { name: "PaymentsCo", outcome: "Acquired by Square (2020)", return: "3.5x" }
    ],
    timeline: [
      { year: "2015", event: "Joined Stripe as early engineer" },
      { year: "2018", event: "Founded PaymentsCo" },
      { year: "2020", event: "Sold PaymentsCo to Square for $45M" },
      { year: "2022", event: "Started exploring AI reasoning models" },
      { year: "2023", event: f"Founded {deal?.startup_name || 'Startup'}" }
    ],
    networks: [
      "Stripe Mafia", "YCombinator Alumni", "AI Researchers"
    ],
    knownInvestors: ["Sequoia", "Founders Fund", "Elad Gil"]
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl font-bold text-indigo-500">
             {founder.name.split(' ').map((n: string) => n[0]).join('')}
           </div>
           <div>
             <h1 className="text-3xl font-bold">{founder.name}</h1>
             <p className="text-muted-foreground mt-1 flex items-center gap-2">
               {founder.role} at {deal?.startup_name}
               <a href="#" className="text-indigo-400 hover:text-indigo-300"><Linkedin className="w-4 h-4" /></a>
               <a href="#" className="text-indigo-400 hover:text-indigo-300"><Twitter className="w-4 h-4" /></a>
             </p>
           </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
             <Activity className="w-4 h-4" /> Run Deep Background Check
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between text-emerald-500">
              <span className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Founder Score</span>
              <TooltipHelper content="Aggregated score based on previous exits, technical background, referencing, and media sentiment." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-emerald-500">{founder.score}/100</div>
              <TooltipHelper content="The AI calculated this score based on the founder's previous successful exits (+15), high relevance of domain expertise (+10), and strong technical background (+5)." />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
              <TrendingUp className="w-4 h-4 mr-2" /> Market Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{founder.sentiment}</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
              <User className="w-4 h-4 mr-2" /> Identified Traits
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
             {founder.traits.map(t => (
                <Badge key={t} variant="secondary" className="bg-primary/10 text-primary">{t}</Badge>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
           <Card>
             <CardHeader className="border-b border-border/50">
               <CardTitle className="flex items-center gap-2">
                 <History className="w-5 h-5 text-indigo-500" /> Professional Timeline
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {founder.timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background text-indigo-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-xs">
                         {item.year.slice(2)}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-border/50 bg-muted/20">
                         <div className="text-sm font-medium">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="border-b border-border/50">
               <CardTitle className="flex items-center gap-2">
                 <Building2 className="w-5 h-5 text-amber-500" /> Previous Startups
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0 divide-y divide-border/50">
                {founder.previousStartups.map(s => (
                  <div key={s.name} className="p-4 flex items-center justify-between">
                     <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-sm text-muted-foreground">{s.outcome}</div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Fund Return</div>
                        <Badge className="bg-emerald-500/10 text-emerald-500">{s.return}</Badge>
                     </div>
                  </div>
                ))}
             </CardContent>
           </Card>
        </div>

        <div className="space-y-8">
           <Card>
             <CardHeader className="border-b border-border/50">
               <CardTitle className="flex items-center gap-2 text-sm">
                 <Users className="w-4 h-4 text-indigo-500" /> Networks & Connections
               </CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                <div>
                   <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Talent Networks</div>
                   <div className="flex flex-wrap gap-2">
                     {founder.networks.map(n => <Badge key={n} variant="outline">{n}</Badge>)}
                   </div>
                </div>
                <div>
                   <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Known Investors (Co-invests)</div>
                   <div className="flex flex-wrap gap-2">
                     {founder.knownInvestors.map(n => <Badge key={n} className="bg-muted text-muted-foreground hover:bg-muted">{n}</Badge>)}
                   </div>
                </div>
             </CardContent>
           </Card>

           <Card className="bg-primary/5 border-primary/20">
             <CardHeader className="pb-3 border-b border-primary/10">
               <CardTitle className="flex items-center gap-2 text-sm text-primary">
                 <Podcast className="w-4 h-4" /> AI Discovered Media
               </CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-3">
                <div className="text-sm border border-border/50 p-3 rounded-lg bg-background hover:border-primary/50 cursor-pointer transition-colors group">
                   <div className="font-medium group-hover:text-primary transition-colors flex items-center justify-between">
                     Invest Like The Best Podcast
                     <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                   </div>
                   <div className="text-xs text-muted-foreground mt-1">Discussed scaling engineering teams and transition from IC to management.</div>
                </div>
                <div className="text-sm border border-border/50 p-3 rounded-lg bg-background hover:border-primary/50 cursor-pointer transition-colors group">
                   <div className="font-medium group-hover:text-primary transition-colors flex items-center justify-between">
                     Substack: "The End of Traditional SaaS"
                     <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                   </div>
                   <div className="text-xs text-muted-foreground mt-1">Highly viral essay written 6 months ago outlining the thesis for {deal?.startup_name}.</div>
                </div>
             </CardContent>
           </Card>
        </div>

      </div>
    </div>
  );
}
