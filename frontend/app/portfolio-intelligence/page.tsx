"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Activity, AlertTriangle, ArrowRightLeft, Users, Building, Globe } from "lucide-react";
import { PageHelpBanner } from "@/components/ui/PageHelpBanner";

export default function PortfolioIntelligence() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Network className="w-8 h-8 text-indigo-500" />
          Portfolio Intelligence
        </h1>
        <p className="text-muted-foreground mt-1">Cross-portfolio graph analysis identifying concentration risks, overlapping customers, and strategic introductions.</p>
      </div>

      <PageHelpBanner 
        title="Network Effects" 
        explanation="Apex Capital maps the entire portfolio as a living graph. We automatically identify when one of our portfolio companies should sell to another, or when they are competing for the same customers."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-red-500">
              <AlertTriangle className="w-4 h-4 mr-2" /> Concentration Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">High Exposure</div>
            <p className="text-xs text-muted-foreground mt-1">4 companies heavily reliant on OpenAI API. Consider hedging with open-source infrastructure plays.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-emerald-500">
              <Users className="w-4 h-4 mr-2" /> Overlapping Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12 Shared Accounts</div>
            <p className="text-xs text-muted-foreground mt-1">DataDog and Snowflake are common enterprise customers across the portfolio.</p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-500/5 border-indigo-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-indigo-500">
              <ArrowRightLeft className="w-4 h-4 mr-2" /> Introduction Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5 High Conviction</div>
            <p className="text-xs text-muted-foreground mt-1">Identified 5 potential vendor relationships between our Series A and Seed companies.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-indigo-500" /> Strategic Introductions
            </CardTitle>
            <CardDescription>AI-identified synergistic relationships within the portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-border/50">
             <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 text-center sm:text-right border border-border/50 p-4 rounded-lg bg-muted/20 w-full sm:w-auto">
                   <div className="font-bold">NeuralDesk (Fund III)</div>
                   <div className="text-xs text-muted-foreground">Selling Enterprise AI Agents</div>
                </div>
                <div className="shrink-0 flex flex-col items-center">
                   <Badge className="bg-indigo-500 text-white mb-2">Sell To</Badge>
                   <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 text-center sm:text-left border border-border/50 p-4 rounded-lg bg-muted/20 w-full sm:w-auto">
                   <div className="font-bold">Acme Corp (Fund II)</div>
                   <div className="text-xs text-muted-foreground">Looking to automate CS workflows</div>
                </div>
             </div>
             <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 text-center sm:text-right border border-border/50 p-4 rounded-lg bg-muted/20 w-full sm:w-auto">
                   <div className="font-bold">DataFlow (Fund IV)</div>
                   <div className="text-xs text-muted-foreground">Data Integration API</div>
                </div>
                <div className="shrink-0 flex flex-col items-center">
                   <Badge className="bg-indigo-500 text-white mb-2">Partner With</Badge>
                   <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 text-center sm:text-left border border-border/50 p-4 rounded-lg bg-muted/20 w-full sm:w-auto">
                   <div className="font-bold">ModelOps (Fund IV)</div>
                   <div className="text-xs text-muted-foreground">ML Deployment Platform</div>
                </div>
             </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
           <Card>
             <CardHeader className="border-b border-border/50">
               <CardTitle className="flex items-center gap-2">
                 <Building className="w-5 h-5 text-emerald-500" /> Sector Exposure Matrix
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="font-medium">Applied AI & Agents</span>
                      <span className="text-emerald-500">45%</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[45%]" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="font-medium">Developer Tools</span>
                      <span className="text-indigo-500">30%</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[30%]" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="font-medium">B2B Fintech</span>
                      <span className="text-amber-500">15%</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[15%]" />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                      <span className="font-medium">Digital Health</span>
                      <span className="text-muted-foreground">10%</span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-muted-foreground w-[10%]" />
                   </div>
                </div>
             </CardContent>
           </Card>

           <Card className="bg-primary/5 border-primary/20">
             <CardHeader className="pb-3 border-b border-primary/10">
               <CardTitle className="flex items-center gap-2 text-sm text-primary">
                 <Globe className="w-4 h-4" /> Market Event Blast Radius
               </CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-3 text-sm">
                <p className="text-muted-foreground leading-relaxed">
                   <strong>Event:</strong> Nvidia announces new Blackwell architecture.
                </p>
                <div className="bg-background border border-border/50 p-3 rounded-md">
                   <strong>Impact:</strong> 3 portfolio companies (Compute AI, ModelOps, ScaleGraph) will see a 20% reduction in training costs if they migrate. Recommending technical advisory session with founders.
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
