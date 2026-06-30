"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"

const SCENARIOS = {
  "Base": {
    name: "Base Case",
    color: "primary",
    revenue: "$2.5M",
    burn: "$100k/mo",
    runway: "15 months",
    valuation: "$15M",
    exit: "40%",
    recommendation: "INVEST",
    description: "Assumes current sales velocity holds and CAC remains steady."
  },
  "Bull": {
    name: "Bull Case",
    color: "emerald-500",
    revenue: "$5.0M",
    burn: "$80k/mo",
    runway: "24+ months",
    valuation: "$30M",
    exit: "75%",
    recommendation: "STRONG INVEST",
    description: "Assumes enterprise pilot conversions hit 80% and NRR expands."
  },
  "Bear": {
    name: "Bear Case",
    color: "amber-500",
    revenue: "$1.2M",
    burn: "$150k/mo",
    runway: "8 months",
    valuation: "$8M",
    exit: "15%",
    recommendation: "WAIT",
    description: "Assumes 50% churn on current pilots and extended sales cycles."
  },
  "Shock": {
    name: "Macro Shock",
    color: "rose-500",
    revenue: "$600k",
    burn: "$200k/mo",
    runway: "3 months",
    valuation: "Bridge Round",
    exit: "< 5%",
    recommendation: "PASS",
    description: "Assumes SaaS spending freezes. High risk of zero-recovery."
  }
}

export default function ScenarioLab() {
  const [activeScenario, setActiveScenario] = useState<keyof typeof SCENARIOS>("Base")
  
  const current = SCENARIOS[activeScenario]

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 min-h-screen">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary" /> Scenario Lab
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Quantitative risk modeling and stress testing.</p>
      </div>

      <Card className="bg-muted/10 border-border/50">
        <CardContent className="p-2 flex flex-wrap gap-2">
          {Object.keys(SCENARIOS).map((key) => (
            <Button 
              key={key}
              variant={activeScenario === key ? "default" : "ghost"}
              className={`flex-1 min-w-[120px] transition-all duration-300 ${activeScenario === key ? `bg-${SCENARIOS[key as keyof typeof SCENARIOS].color} shadow-lg shadow-${SCENARIOS[key as keyof typeof SCENARIOS].color}/20` : ''}`}
              onClick={() => setActiveScenario(key as keyof typeof SCENARIOS)}
            >
              {SCENARIOS[key as keyof typeof SCENARIOS].name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-border/50 shadow-2xl relative">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-${current.color} transition-colors duration-500`} />
            <CardHeader className="bg-background/50 backdrop-blur-sm border-b pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl tracking-tight mb-2 transition-all duration-300">{current.name} Impact</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">{current.description}</CardDescription>
                </div>
                <Badge className={`bg-${current.color}/10 text-${current.color} border-${current.color}/30 text-lg px-4 py-1 uppercase tracking-widest font-extrabold`}>
                  {current.recommendation}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8 bg-muted/5 relative">
              <div className="space-y-2">
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Year 1 ARR</div>
                <div className="text-3xl font-extrabold animate-in slide-in-from-bottom-2 duration-300">{current.revenue}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Net Burn</div>
                <div className="text-3xl font-extrabold animate-in slide-in-from-bottom-2 duration-300 delay-75">{current.burn}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cash Runway</div>
                <div className="text-3xl font-extrabold animate-in slide-in-from-bottom-2 duration-300 delay-150">{current.runway}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Exit Prob.</div>
                <div className="text-3xl font-extrabold animate-in slide-in-from-bottom-2 duration-300 delay-200 text-primary">{current.exit}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background/50 border-border/50">
             <CardHeader>
               <CardTitle className="text-lg">AI Scenario Modeler Log</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> Ingesting latest financial model v2.xlsx...</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500"/> Extracting COGS and Headcount assumptions...</div>
                  <div className="flex items-center gap-2"><Activity className="w-3 h-3 text-primary animate-pulse"/> Applying stochastic perturbation (+/- 30% pipeline shock)...</div>
                  <div className="text-primary mt-2">Model generation complete. Matrix populated.</div>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="bg-muted/10 border-border/50 h-full">
             <CardHeader>
                <CardTitle>Implied Valuation</CardTitle>
                <CardDescription>Based on scenario exit probability</CardDescription>
             </CardHeader>
             <CardContent className="flex flex-col items-center justify-center py-12">
               <div className={`text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-${current.color} to-background transition-all duration-500`}>
                 {current.valuation}
               </div>
               <div className="mt-8 text-center text-sm text-muted-foreground max-w-[200px]">
                 If this scenario materializes, Apex Capital ownership would be valued at approximately 10% of this figure.
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
}
