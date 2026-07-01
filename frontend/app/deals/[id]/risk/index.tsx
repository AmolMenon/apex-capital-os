"use client";

import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { DealRoomSkeleton } from "@/components/ui/DealRoomSkeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ShieldAlert, TrendingDown, Users, DollarSign, Target, Cpu, Activity, Scale, ChevronRight } from "lucide-react";

export default function RiskIntelligencePage() {
  const { state, loading } = useGlobalDeal();

  if (loading || !state) return <DealRoomSkeleton />;
  const { deal } = state;

  const risks = [
    {
      category: "Customer Risk",
      icon: Users,
      severity: "High",
      confidence: "High",
      description: "Extreme customer concentration. The top 3 accounts represent 45% of total ARR.",
      mitigation: "Sales pipeline has 12 late-stage enterprise deals that could dilute concentration to <25% next quarter.",
      evidence: "Verified via Stripe billing data analysis.",
      color: "rose"
    },
    {
      category: "Competitive Risk",
      icon: Target,
      severity: "Medium",
      confidence: "High",
      description: "Incumbents like Microsoft are bundling similar features into their core enterprise suites for free.",
      mitigation: "The product's workflow automation is deeply embedded. Rip-and-replace costs for enterprises are incredibly high.",
      evidence: "NDR is currently 135%, indicating low churn despite bundling threats.",
      color: "amber"
    },
    {
      category: "Technology Risk",
      icon: Cpu,
      severity: "Medium",
      confidence: "Medium",
      description: "Over-reliance on OpenAI API endpoints creates margin vulnerability and uptime dependency.",
      mitigation: "The engineering team is actively training a smaller, specialized in-house model to handle 80% of routine inference.",
      evidence: "Technical DD interview with CTO (Nov 2).",
      color: "amber"
    },
    {
      category: "Execution Risk",
      icon: Activity,
      severity: "Low",
      confidence: "High",
      description: "The product roadmap is highly ambitious and requires flawless execution to maintain lead.",
      mitigation: "Founders have a strong track record of shipping. Engineering velocity is currently top-decile.",
      evidence: "GitHub commit velocity and release cadence analyzed.",
      color: "emerald"
    },
    {
      category: "Regulatory Risk",
      icon: Scale,
      severity: "Low",
      confidence: "Medium",
      description: "Upcoming EU AI Act might restrict data processing for European customers.",
      mitigation: "The startup is pursuing SOC2 Type II compliance and data localization strategies.",
      evidence: "Legal DD preliminary report.",
      color: "emerald"
    },
    {
      category: "Capital Risk",
      icon: DollarSign,
      severity: "Low",
      confidence: "High",
      description: "Burn rate is -$240k/mo. Runway is 18 months at current spend.",
      mitigation: "This $12M Series A round will extend runway to 42 months, sufficient to reach profitability.",
      evidence: "Financial model projections.",
      color: "emerald"
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-500" />
          Risk Intelligence Panel
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Automated classification of systemic and idiosyncratic risks for {deal.startup_name}.
        </p>
      </div>

      <div className="space-y-6">
        {risks.map((risk, index) => {
          const Icon = risk.icon;
          const bgClass = risk.color === 'rose' ? 'bg-rose-500/5 border-rose-500/20' : 
                          risk.color === 'amber' ? 'bg-amber-500/5 border-amber-500/20' : 
                          'bg-emerald-500/5 border-emerald-500/20';
          const textClass = risk.color === 'rose' ? 'text-rose-500' : 
                            risk.color === 'amber' ? 'text-amber-500' : 
                            'text-emerald-500';

          return (
            <Card key={index} className={`shadow-sm transition-all hover:shadow-md ${bgClass}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  
                  {/* Left Column: Classification */}
                  <div className="w-full md:w-1/4 shrink-0 space-y-4 border-b md:border-b-0 md:border-r border-border/50 pb-4 md:pb-0 md:pr-6">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-background shadow-sm border ${textClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-foreground">{risk.category}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Severity</span>
                        <Badge variant="outline" className={`w-full justify-center ${textClass} bg-background`}>{risk.severity}</Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Confidence</span>
                        <Badge variant="outline" className="w-full justify-center text-foreground bg-background">{risk.confidence}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1 mb-1">
                        <AlertCircle className="w-3 h-3" /> The Risk
                      </span>
                      <p className="text-sm font-medium text-foreground">{risk.description}</p>
                    </div>
                    
                    <div className="bg-background rounded-md p-3 border shadow-sm">
                      <span className="text-xs uppercase font-bold text-emerald-500 tracking-wider flex items-center gap-1 mb-1">
                        <TrendingDown className="w-3 h-3" /> Mitigation Strategy
                      </span>
                      <p className="text-sm text-foreground/80">{risk.mitigation}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1 block">Evidence Link</span>
                      <p className="text-sm text-muted-foreground font-mono flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" /> {risk.evidence}
                      </p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
