"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, AlertTriangle, ArrowRight, Activity, Clock, BarChart3, Database } from "lucide-react"

interface Deal {
  id: number
  name: string
  stage: string
  conviction_score: number
  contradictions: number
  last_analysis: string
  status: string
  next_action: string
  risk: string
}

export default function CommandCenter() {
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
          name: d.subject?.name || d.title || d.startup_name || d.name || `Deal ${d.id}`,
          stage: d.subject?.metadata_json ? JSON.parse(d.subject.metadata_json).stage : (d.stage || "Unknown"),
          conviction_score: d.analysis?.overall_score || d.conviction_score || 50,
          contradictions: d.contradictions || 0,
          last_analysis: "Just now",
          status: d.id === 9999 ? "BLOCKED" : "ACTIVE",
          next_action: d.id === 9999 ? "Resolve Evidence Conflict" : "Proceed to IC",
          risk: d.id === 9999 ? "Management Claim Conflict" : "None"
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
      <div className="flex flex-col h-full items-center justify-center bg-slate-950 text-slate-400">
        <Activity className="w-8 h-8 animate-pulse text-blue-500 mb-4" />
        <p className="font-medium tracking-wide">Compiling Command Center...</p>
      </div>
    )
  }

  const blockedDeals = deals.filter(d => d.status === "BLOCKED").length;
  const activeDeals = deals.length;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto bg-slate-950 text-slate-100">
      <div className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Command Center</h1>
          <p className="text-slate-400 text-lg mt-1">Apex Fund II Active Pipeline</p>
        </div>
      </div>

      {/* Row 1: High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-blue-400" /> Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">{activeDeals}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-400" /> Decisions Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">2</div>
            <p className="text-xs text-slate-500 mt-1">Pending final IC vote</p>
          </CardContent>
        </Card>

        <Card className="bg-rose-950/20 border-rose-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-rose-400 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Blocked Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-rose-200">{blockedDeals}</div>
            <p className="text-xs text-rose-400/80 mt-1">Material evidence conflicts detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Column 1 & 2: Actionable Pipeline */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-2">Prioritized Deal Queue</h2>
          
          <div className="space-y-4">
            {deals.slice(0, 4).map(deal => {
              const evidenceStrength = deal.conviction_score > 80 ? "Strong" : deal.conviction_score > 60 ? "Moderate" : "Weak";
              const strengthColor = evidenceStrength === "Strong" ? "text-emerald-400" : evidenceStrength === "Moderate" ? "text-amber-400" : "text-rose-400";
              const isBlocked = deal.status === "BLOCKED";

              return (
                <Card key={deal.id} className={`overflow-hidden transition-colors ${isBlocked ? 'bg-rose-950/10 border-rose-900/30' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex flex-col md:flex-row p-5 gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{deal.name}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{deal.stage}</span>
                        {isBlocked && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Blocked
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Evidence Strength</div>
                          <div className={`text-sm font-medium ${strengthColor}`}>{evidenceStrength}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Key Risk</div>
                          <div className="text-sm font-medium text-slate-300">{deal.risk}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Required Action</div>
                        <div className={`text-sm font-bold ${isBlocked ? 'text-rose-400' : 'text-slate-300'}`}>{deal.next_action}</div>
                      </div>
                      
                      <Link href={`/decisions/${deal.id}`}>
                        <Button variant={isBlocked ? "destructive" : "secondary"} size="sm" className="w-full font-bold hover:bg-slate-700">
                          Open Workspace <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
        
        {/* Column 3: Intelligence Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold border-b border-slate-800 pb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" /> Intelligence Feed
          </h2>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-800">
                <div className="p-4 flex items-start gap-3 hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="mt-0.5 bg-rose-500/10 p-1.5 rounded text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Material Conflict Detected</h4>
                    <p className="text-xs text-slate-400 mt-1">Nexus Data Systems management claim ($8.0M) contradicts evidence ($5.4M).</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">10 minutes ago</span>
                  </div>
                </div>
                
                <div className="p-4 flex items-start gap-3 hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="mt-0.5 bg-blue-500/10 p-1.5 rounded text-blue-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Targeted Review Initiated</h4>
                    <p className="text-xs text-slate-400 mt-1">Reviewing deferred professional services revenue in Nexus Series A.</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">12 minutes ago</span>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-3 hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <div className="mt-0.5 bg-emerald-500/10 p-1.5 rounded text-emerald-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">IC Decision Recorded</h4>
                    <p className="text-xs text-slate-400 mt-1">Project Apollo approved with conditions. Persisted to Institutional Memory.</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">2 hours ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
