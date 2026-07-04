"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrainCircuit, AlertTriangle, TrendingUp, TrendingDown, ArrowRight, Activity, ShieldAlert, BookOpen, DollarSign, PieChart, Star, Clock } from "lucide-react"
import { AnimatedScore } from "@/components/ui/AnimatedScore"

interface Deal {
  id: number
  name: string
  stage: string
  conviction_score: number
  conviction_change: string
  last_analysis: string
  contradictions: number
  pending_override: boolean
}

export default function ExecutiveDashboard() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDeals() {
      try {
        const { api } = await import("@/lib/api");
        let data = await api.getDeals();
        
        if (data.length === 0) {
          const { extendedDeals } = await import("@/data/extended_deals");
          data = extendedDeals as any;
        }
        
        const mappedDeals = data.map((d: any) => ({
          id: d.id,
          name: d.startup_name || d.name || `Deal ${d.id}`,
          stage: d.stage || "Unknown",
          conviction_score: d.analysis?.overall_score || d.conviction_score || 50,
          conviction_change: "+0",
          last_analysis: "Just now",
          contradictions: d.contradictions || 0,
          pending_override: false
        }));
        
        setDeals(mappedDeals);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 font-medium tracking-wide">Compiling Pipeline Overview...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Executive Summary</h1>
          <p className="text-muted-foreground text-lg mt-2">60-second snapshot of Apex Fund II</p>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="px-4 py-2 bg-primary/10 text-primary border-primary/30 font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" /> Live OS Sync
          </Badge>
        </div>
      </div>

      {/* Row 1: High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-emerald-950/20 border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-500 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Capital Deployed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$142M</div>
            <p className="text-xs text-muted-foreground mt-1">45% of Fund II (Target: 50% by Q4)</p>
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-950/20 border-indigo-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-500 flex items-center gap-2">
              <PieChart className="w-4 h-4" /> Portfolio Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.8x</div>
            <p className="text-xs text-muted-foreground mt-1">Gross MOIC • Top quartile</p>
          </CardContent>
        </Card>

        <Card className="bg-rose-950/20 border-rose-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Top Risks (Active)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Founders missing Q3 targets</p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-950/20 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-500 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Deals Near Decision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">IC votes required this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1 & 2: Actionable Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Active Pipeline
          </h2>
          
          <div className="space-y-4">
            {deals.slice(0, 4).map(deal => (
              <Card key={deal.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{deal.name}</h3>
                      <Badge variant="secondary">{deal.stage}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> Updated {deal.last_analysis}</span>
                      {deal.contradictions > 0 && (
                        <span className="flex items-center gap-1 text-rose-500 font-medium">
                          <AlertTriangle className="w-3 h-3" /> Needs Human Review
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 border-l pl-8 border-border/50">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">AI Conviction</div>
                      <div className="text-2xl font-bold flex items-center gap-2 justify-center">
                        <AnimatedScore value={deal.conviction_score} />
                      </div>
                    </div>
                    
                    <Link href={`/decisions/${deal.id}`}>
                      <Button variant="default" size="sm" className="font-bold">
                        Executive Overview <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Column 3: Insights & Follow-ups */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-b pb-2">AI Market Synthesis</h2>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-5 space-y-4">
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-emerald-500" /> Enterprise AI Adoption</h4>
                <p className="text-sm text-muted-foreground">Competitor pricing dropping across the board due to Llama 3 open source. Avoid thin wrappers.</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-2 mb-1"><TrendingDown className="w-4 h-4 text-rose-500" /> B2B SaaS Multiples</h4>
                <p className="text-sm text-muted-foreground">Public market multiples compressed by 12% in Q3. Adjust valuation targets accordingly.</p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold border-b pb-2 mt-8">Companies to Watch</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> Anthropic (PortCo)</h4>
                  <p className="text-xs text-muted-foreground mt-1">Exceeding revenue targets by 40%</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">View</Button>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-rose-500" /> Acme Corp (PortCo)</h4>
                  <p className="text-xs text-muted-foreground mt-1">Runway under 6 months</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">View</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
