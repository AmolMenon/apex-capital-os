"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, AlertTriangle, TrendingUp, DollarSign, Crosshair, HelpCircle, Briefcase } from "lucide-react";
import { calculateDealHealth } from "@/lib/deal-logic";

export function PartnerView({ deal, analysis }: { deal: any, analysis: any }) {
  const health = calculateDealHealth(deal);
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Level Recommendation */}
      <Card className="border-primary/30 bg-primary/5 shadow-sm overflow-hidden">
        <div className="bg-primary text-primary-foreground py-2 px-6 flex justify-between items-center text-sm font-bold uppercase tracking-widest">
          <span>Investment Committee Recommendation</span>
          <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Apex AI Generated</span>
        </div>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-center md:text-left md:border-r border-border/50 md:pr-8">
              <h2 className="text-4xl font-extrabold text-foreground mb-2">
                {analysis?.recommendation === "Invest" ? "STRONG BUY" : "PASS"}
              </h2>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                Confidence: {deal.evidence_confidence || 'High'}
              </Badge>
            </div>
            <p className="text-lg font-medium leading-relaxed flex-1">
              {analysis?.recommendation === "Invest" 
                ? "The team possesses exceptional domain expertise with top-decile capital efficiency (7mo CAC payback). Despite customer concentration risks, the technological moat and switching costs justify the $50M post-money valuation."
                : "While the team is capable, unit economics are fundamentally broken and market is saturated. The path to a venture-scale return is highly improbable."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deal Dynamics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Expected Return</span>
            <span className="text-2xl font-bold text-emerald-500">12x</span>
            <span className="text-xs text-muted-foreground block mt-1">Base Case</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Target Ownership</span>
            <span className="text-2xl font-bold">20.0%</span>
            <span className="text-xs text-muted-foreground block mt-1">Lead Series A</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Capital Required</span>
            <span className="text-2xl font-bold">$10.0M</span>
            <span className="text-xs text-muted-foreground block mt-1">From Apex Fund III</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm bg-muted/10">
          <CardContent className="p-4 text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Portfolio Fit</span>
            <span className="text-2xl font-bold text-indigo-500">High</span>
            <span className="text-xs text-muted-foreground block mt-1">Synergy with Acme Corp</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bull vs Bear */}
        <Card className="shadow-sm border-border/50 overflow-hidden">
          <div className="bg-emerald-500/10 py-3 px-4 border-b border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
            <Target className="w-5 h-5" /> The Bull Case
          </div>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/50 text-sm">
              <li className="p-4 flex gap-3">
                <span className="text-emerald-500 font-bold">1.</span> 
                <span className="font-medium">Unprecedented net retention (135%) proves extreme stickiness.</span>
              </li>
              <li className="p-4 flex gap-3">
                <span className="text-emerald-500 font-bold">2.</span> 
                <span className="font-medium">Upcoming SOC2 compliance unlocks $1B+ TAM in banking sector.</span>
              </li>
              <li className="p-4 flex gap-3">
                <span className="text-emerald-500 font-bold">3.</span> 
                <span className="font-medium">Founders have previously scaled infrastructure from 0 to $100M ARR.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 overflow-hidden">
          <div className="bg-rose-500/10 py-3 px-4 border-b border-rose-500/20 text-rose-700 dark:text-rose-400 font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> The Bear Case
          </div>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/50 text-sm">
              <li className="p-4 flex gap-3">
                <span className="text-rose-500 font-bold">1.</span> 
                <span className="font-medium">Gross margins could compress if OpenAI raises API pricing.</span>
              </li>
              <li className="p-4 flex gap-3">
                <span className="text-rose-500 font-bold">2.</span> 
                <span className="font-medium">Top 2 customers account for 45% of revenue. Churn would be fatal.</span>
              </li>
              <li className="p-4 flex gap-3">
                <span className="text-rose-500 font-bold">3.</span> 
                <span className="font-medium">Incumbents could easily bundle this feature into existing suites.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exit Scenarios */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /> Exit Scenarios (5-Year Horizon)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h4 className="font-bold text-sm">IPO / Mega-Scale</h4>
                <p className="text-xs text-muted-foreground">$2B+ Valuation (10% Probability)</p>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">40x Return</Badge>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h4 className="font-bold text-sm">Strategic Acquisition</h4>
                <p className="text-xs text-muted-foreground">e.g. Snowflake, Databricks (45% Probability)</p>
              </div>
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500">8x - 12x Return</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm">Acqui-hire / Failure</h4>
                <p className="text-xs text-muted-foreground">Team absorbed by FAANG (45% Probability)</p>
              </div>
              <Badge variant="outline" className="bg-rose-500/10 text-rose-500">0x - 1x Return</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Key Questions Before Investing */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base flex items-center gap-2"><HelpCircle className="w-4 h-4 text-primary" /> Key Questions Before Investing</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="bg-muted p-3 rounded-md text-sm border-l-2 border-primary">
              <span className="font-bold text-primary block mb-1">To Founder:</span>
              How does the GTM motion evolve when selling to traditional non-tech enterprises who don't have specialized DevOps teams?
            </div>
            <div className="bg-muted p-3 rounded-md text-sm border-l-2 border-primary">
              <span className="font-bold text-primary block mb-1">To Founder:</span>
              Walk us through the mitigation plan if Microsoft copies the core routing logic into Azure tomorrow.
            </div>
            <div className="bg-muted p-3 rounded-md text-sm border-l-2 border-primary">
              <span className="font-bold text-primary block mb-1">Internal (IC):</span>
              Are we comfortable taking 20% ownership at $50M post, or do we hold firm at $40M post?
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
