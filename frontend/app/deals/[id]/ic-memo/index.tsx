"use client";

import React, { useState } from 'react';
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText, CheckCircle2, XCircle, AlertCircle, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";

export default function ICMemoPage() {
  const { state, loading } = useGlobalDeal();
  const [hasVoted, setHasVoted] = useState<string | null>(null);

  if (loading || !state?.deal) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full md:col-span-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const { deal } = state;

  if (deal.ic_readiness === "Not Ready") {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <EmptyState 
          title="Not Ready for Investment Committee"
          description={`The due diligence for ${deal.startup_name} is incomplete. Evaluate the IC Memo once all blockers are resolved.`}
          primaryActionLabel="Run Automated Diligence"
          onPrimaryAction={() => {}}
          icon={FileText}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      
      {/* Print-only Cover Page */}
      <div className="hidden print:flex flex-col justify-center items-center h-screen w-full break-after-page text-center bg-white text-black">
        <h1 className="text-6xl font-serif font-bold tracking-tight mb-8">Apex Capital</h1>
        <div className="w-32 h-1 bg-black mb-12"></div>
        <h2 className="text-4xl font-serif text-gray-800 mb-4">Investment Committee Memorandum</h2>
        <h3 className="text-2xl text-gray-600 mb-24">Project {deal.startup_name}</h3>
        <p className="text-lg text-gray-500 mt-auto mb-8">Confidential & Proprietary</p>
        <p className="text-md text-gray-400 mb-24">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Header & Controls */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Investment Committee Memo
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluated by Apex AI. Final review required before IC meeting.
          </p>
        </div>
        <Button onClick={() => window.print()} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 print:hidden">
          <FileText className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>
      
      {/* Recommendation Banner */}
      <div className={`rounded-xl p-6 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6
        ${deal.recommendation === 'Investigate' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={deal.recommendation === 'Investigate' ? 'text-amber-500 border-amber-500/50' : 'text-emerald-500 border-emerald-500/50'}>
              Lead Partner Recommendation
            </Badge>
            <span className="text-sm font-mono text-muted-foreground">Confidence: {deal.evidence_confidence}</span>
          </div>
          <h2 className="text-2xl font-bold">{deal.recommendation === 'Investigate' ? 'Proceed with Caution' : 'Strong Conviction to Invest'}</h2>
          <p className="text-sm mt-1 max-w-2xl text-foreground/80">
            Apex AI recommends moving forward, but highlights critical GTM concentration risks that must be discussed by the partnership.
          </p>
        </div>
        
        {/* Voting Panel */}
        <div className="bg-background border border-border/50 rounded-lg p-4 shrink-0 w-full md:w-64">
          <h3 className="text-sm font-bold text-center mb-3">Cast Your Vote</h3>
          {hasVoted ? (
            <div className="text-center py-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 rounded-md border border-emerald-500/20 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Vote Recorded ({hasVoted})
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => setHasVoted("Pass")} variant="outline" className="flex-1 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30">
                <ThumbsDown className="w-4 h-4 mr-2" /> Pass
              </Button>
              <Button onClick={() => setHasVoted("Invest")} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <ThumbsUp className="w-4 h-4 mr-2" /> Invest
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden print:block mb-8 text-black bg-white">
        <h1 className="text-3xl font-serif font-bold border-b-2 border-black pb-2 mb-4">Executive Summary</h1>
        <p className="font-serif text-lg leading-relaxed">{deal.recommendation === 'Investigate' ? 'Apex AI recommends proceeding with caution, highlighting critical GTM concentration risks.' : 'Apex AI has formed strong conviction and recommends immediate investment.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Memo Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="print:shadow-none print:border-none print:bg-transparent">
            <CardHeader className="pb-3 border-b print:border-b-2 print:border-black print:px-0">
              <CardTitle className="text-lg print:text-2xl print:font-serif print:font-bold print:text-black">Investment Thesis</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 font-serif leading-relaxed text-foreground/90 print:text-black print:px-0 space-y-4">
              <p>
                {deal.startup_name} is building the de-facto operating system for {deal.sector}. By focusing heavily on the {deal.business_model} model, they have achieved exceptional net revenue retention (135%) and a highly efficient CAC payback period ({"<"}6 months).
              </p>
              <p>
                We believe that the market is currently undergoing a massive platform shift, and incumbent legacy players are structurally unable to adapt due to their technical debt. {deal.startup_name}'s modern, API-first architecture creates an unassailable moat once integrated into a customer's core infrastructure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Key Risks & Mitigations</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="font-bold flex items-center gap-2 text-rose-500 mb-1"><AlertCircle className="w-4 h-4" /> Customer Concentration</h4>
                <p className="text-sm text-foreground/80 mb-2">The top 3 customers account for 45% of total ARR. Losing one would severely impact growth.</p>
                <div className="bg-muted p-3 rounded-md text-sm border-l-2 border-emerald-500">
                  <span className="font-bold text-emerald-500 block mb-1">Mitigation:</span>
                  The sales pipeline is robust, with 12 new enterprise contracts in late-stage negotiations expected to close this quarter, diluting the concentration to under 25%.
                </div>
              </div>
              
              <div>
                <h4 className="font-bold flex items-center gap-2 text-rose-500 mb-1"><AlertCircle className="w-4 h-4" /> Incumbent Retaliation</h4>
                <p className="text-sm text-foreground/80 mb-2">Legacy competitors might bundle similar products for free to prevent churn.</p>
                <div className="bg-muted p-3 rounded-md text-sm border-l-2 border-emerald-500">
                  <span className="font-bold text-emerald-500 block mb-1">Mitigation:</span>
                  {deal.startup_name}'s workflow automation features are highly specialized and deeply embedded, making rip-and-replace extremely costly for enterprise customers.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cap Table & Returns Modeling */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Cap Table & Returns Modeling</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted p-3 rounded-md text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Pre-Money</span>
                  <span className="font-bold">${(deal.valuation ? deal.valuation / 1000000 : 50)}M</span>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Round Size</span>
                  <span className="font-bold">$12.5M</span>
                </div>
                <div className="bg-muted p-3 rounded-md text-center border border-primary/50 bg-primary/5">
                  <span className="text-xs text-primary block mb-1">Target Ownership</span>
                  <span className="font-bold text-primary">20.0%</span>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <span className="text-xs text-muted-foreground block mb-1">Post-Money</span>
                  <span className="font-bold">${(deal.valuation ? (deal.valuation / 1000000) + 12.5 : 62.5)}M</span>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-bold">Estimated Cap Table (Post-Close)</h4>
                <div className="w-full bg-muted rounded-full h-4 flex overflow-hidden">
                  <div className="bg-indigo-500 w-[45%]" title="Founders (45%)"></div>
                  <div className="bg-primary w-[20%]" title="Apex Capital (20%)"></div>
                  <div className="bg-amber-500 w-[15%]" title="Existing Investors (15%)"></div>
                  <div className="bg-rose-500 w-[20%]" title="Option Pool (20%)"></div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Founders (45%)</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-primary rounded-full"></div> Apex (20%)</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Existing (15%)</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full"></div> Option Pool (20%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sensitivity Analysis */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Sensitivity Analysis (5Y)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 rounded-tl-md">Scenario</th>
                      <th className="px-4 py-2">Exit ARR</th>
                      <th className="px-4 py-2">Exit Multiple</th>
                      <th className="px-4 py-2">Exit Val</th>
                      <th className="px-4 py-2 rounded-tr-md">MOIC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3 font-medium text-rose-500">Bear Case</td>
                      <td className="px-4 py-3">$25M</td>
                      <td className="px-4 py-3">5x</td>
                      <td className="px-4 py-3">$125M</td>
                      <td className="px-4 py-3 font-bold text-rose-500">1.2x</td>
                    </tr>
                    <tr className="bg-primary/5">
                      <td className="px-4 py-3 font-medium text-primary">Base Case</td>
                      <td className="px-4 py-3">$85M</td>
                      <td className="px-4 py-3">8x</td>
                      <td className="px-4 py-3">$680M</td>
                      <td className="px-4 py-3 font-bold text-primary">8.5x</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-emerald-500">Bull Case</td>
                      <td className="px-4 py-3">$150M</td>
                      <td className="px-4 py-3">12x</td>
                      <td className="px-4 py-3">$1.8B</td>
                      <td className="px-4 py-3 font-bold text-emerald-500">22.0x</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Public Market Comps */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Public Market Comps</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-bold text-sm">Snowflake (SNOW)</h4>
                    <p className="text-xs text-muted-foreground">High-growth data infrastructure</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block text-sm">18.4x</span>
                    <span className="text-xs text-muted-foreground">EV / NTM Rev</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-bold text-sm">Datadog (DDOG)</h4>
                    <p className="text-xs text-muted-foreground">Cloud monitoring & security</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block text-sm">14.2x</span>
                    <span className="text-xs text-muted-foreground">EV / NTM Rev</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-primary/10 p-2 rounded-md border border-primary/20">
                  <div>
                    <h4 className="font-bold text-sm text-primary">Implied Target Multiple</h4>
                    <p className="text-xs text-primary/80">Adjusted for growth & margin profile</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block text-sm text-primary">12.0x - 15.0x</span>
                    <span className="text-xs text-primary/80">EV / ARR</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" /> Deal Dynamics</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Round Size</span>
                <div className="text-xl font-light">$12.5M</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Pre-Money Valuation</span>
                <div className="text-xl font-light">${(deal.valuation ? deal.valuation / 1000000 : 50)}M</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Our Target Allocation</span>
                <div className="text-xl font-light">$5.0M <span className="text-sm text-muted-foreground">(40% ownership target)</span></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base">Partnership Votes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium">Alex (GP)</span>
                 <Badge variant="outline" className="text-emerald-500 border-emerald-500/50">Invest</Badge>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium">Sarah (Principal)</span>
                 <Badge variant="outline" className="text-emerald-500 border-emerald-500/50">Invest</Badge>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm font-medium text-muted-foreground">Marcus (GP)</span>
                 <span className="text-xs text-muted-foreground italic">Pending</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  );
}
