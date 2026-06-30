"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrainCircuit, AlertTriangle, TrendingUp, TrendingDown, ArrowRight, Activity, ShieldAlert, BookOpen } from "lucide-react"

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

export default function InvestmentCommandCenter() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDeals() {
      try {
        const { api } = await import("@/lib/api");
        const data = await api.getDeals();
        
        // Map the backend/mock data to the UI format
        const mappedDeals = data.map((d: any) => ({
          id: d.id,
          name: d.startup_name || d.name || `Deal ${d.id}`,
          stage: d.stage || "Unknown",
          conviction_score: d.analysis?.overall_score || d.conviction_score || 50,
          conviction_change: "+0", // Placeholder until historical memory API is integrated
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
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Investment Command Center</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-pulse bg-muted/20"><CardContent className="h-32" /></Card>
          <Card className="animate-pulse bg-muted/20"><CardContent className="h-32" /></Card>
          <Card className="animate-pulse bg-muted/20"><CardContent className="h-32" /></Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Investment Command Center</h1>
          <p className="text-muted-foreground text-lg mt-2">Live AI Intelligence & Portfolio Sentinels</p>
        </div>
        <Badge variant="outline" className="px-4 py-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" /> Live Analysis Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-emerald-950/20 border-emerald-500/30 shadow-lg shadow-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-500 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> AI Committee Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">Completed today</p>
          </CardContent>
        </Card>
        
        <Card className="bg-rose-950/20 border-rose-500/30 shadow-lg shadow-rose-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Contradictions Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Requires human review</p>
          </CardContent>
        </Card>

        <Card className="bg-indigo-950/20 border-indigo-500/30 shadow-lg shadow-indigo-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Avg Conviction Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+2.4</div>
            <p className="text-xs text-muted-foreground mt-1">Across active pipeline</p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-950/20 border-amber-500/30 shadow-lg shadow-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-500 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Partner Overrides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">Pending IC discussion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Active Pipeline Sentinels
          </h2>
          
          <div className="space-y-4">
            {deals.map(deal => (
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
                          <AlertTriangle className="w-3 h-3" /> {deal.contradictions} Contradiction{deal.contradictions > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 border-l pl-8 border-border/50">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Conviction</div>
                      <div className="text-2xl font-bold flex items-center gap-2 justify-center">
                        {deal.conviction_score}
                        {deal.conviction_change.startsWith('+') ? (
                          <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> {deal.conviction_change}
                          </span>
                        ) : (
                          <span className="text-xs text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full flex items-center">
                            <TrendingDown className="w-3 h-3 mr-1" /> {deal.conviction_change}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Link href={`/deals/${deal.id}/committee`}>
                      <Button variant="default" size="sm" className="font-bold">
                        View Intelligence <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-b pb-2">Recent Overrides</h2>
          <Card className="bg-background/50 backdrop-blur">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">FinStack</span>
                  <Badge variant="outline" className="text-xs text-rose-500 border-rose-500/30">AI: PASS</Badge>
                </div>
                <div className="text-sm bg-muted/50 p-3 rounded text-muted-foreground border-l-2 border-primary">
                  Partner Amol Menon marked as INVEST.
                  <br/><span className="text-xs opacity-70">&quot;AI over-penalized CAC, founders have organic distribution.&quot;</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
