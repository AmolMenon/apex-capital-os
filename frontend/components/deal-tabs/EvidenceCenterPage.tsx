"use client"
import { useParams } from "next/navigation";

import { use, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, FileText, Globe, AlertTriangle, Link as LinkIcon, Database, Cpu } from "lucide-react"
import { api } from "@/lib/api"
import { Deal } from "@/types"

import { useGlobalDeal } from "@/components/GlobalDealProvider"

export default function EvidenceCenterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useParams() as any;
  const { state } = useGlobalDeal();
  const deal = state?.deal;
  const [loading, setLoading] = useState(true)
  const [research, setResearch] = useState<any>(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    async function loadData() {
      try {
        try { 
          const r = await api.getWebResearch(resolvedParams.id); 
          setResearch(r); 
        } catch(e) { console.error('Failed to load web research', e); }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [resolvedParams.id])

  if (loading) {
    return <div className="p-8 text-center animate-pulse text-muted-foreground">Loading Evidence Center...</div>
  }

  if (!deal) {
    return <div className="p-8 text-center text-red-500">Failed to load deal data.</div>
  }

  // Parse public profile if available
  let publicProfile = research;

  const isPublic = true; // Use research data directly

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold tracking-tight">Evidence Center: {deal.startup_name}</h1>
          {isPublic ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Public Benchmark Data</Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Private Data Room</Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1">
          A centralized view of all verified facts, media claims, and source conflicts extracted during diligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Known Truths & Verified Facts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {publicProfile?.verified_public_facts ? (
                publicProfile.verified_public_facts.map((fact: string, i: number) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-3">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium text-sm">{fact}</span>
                        </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 border-b pb-3">
                     <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                     <div>
                       <span className="font-medium text-sm block">Current Revenue: ${deal.revenue?.toLocaleString()}</span>
                       <span className="text-xs text-muted-foreground">Source: Data Room - Financials_2024.xlsx</span>
                     </div>
                  </div>
                  <div className="flex items-start gap-3 border-b pb-3">
                     <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                     <div>
                       <span className="font-medium text-sm block">Gross Margin: {deal.gross_margin}%</span>
                       <span className="text-xs text-muted-foreground">Source: Data Room - Management_Presentation.pdf</span>
                     </div>
                  </div>
                  <div className="flex items-start gap-3 border-b pb-3">
                     <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                     <div>
                       <span className="font-medium text-sm block">Funds Raised: ${deal.funding_raised?.toLocaleString()}</span>
                       <span className="text-xs text-muted-foreground">Source: Pitch Deck - Slide 12</span>
                     </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Source Conflicts & Unverified Claims
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {publicProfile?.source_conflicts?.length > 0 ? (
                publicProfile.source_conflicts.map((conflict: any, i: number) => (
                <div key={i} className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                  <h4 className="font-bold text-amber-900 text-sm mb-2">{conflict.topic}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold block text-amber-800 mb-1">Source A</span>
                      <p className="text-amber-900/80">{conflict.source_a}</p>
                    </div>
                    <div>
                      <span className="font-semibold block text-amber-800 mb-1">Source B</span>
                      <p className="text-amber-900/80">{conflict.source_b}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-200 flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-amber-700 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">Agent System Resolution:</span>
                      <span className="text-xs text-amber-900/80">{conflict.resolution_strategy}</span>
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                  <h4 className="font-bold text-amber-900 text-sm mb-2">Churn Rate Discrepancy</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold block text-amber-800 mb-1">Pitch Deck (Slide 8)</span>
                      <p className="text-amber-900/80">Claims Net Revenue Retention (NRR) of 130% and zero logo churn.</p>
                    </div>
                    <div>
                      <span className="font-semibold block text-amber-800 mb-1">Raw Cohort Data</span>
                      <p className="text-amber-900/80">Shows 2 early enterprise customers dropped off in Q3.</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-200 flex items-start gap-2">
                    <Cpu className="w-4 h-4 text-amber-700 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">Agent System Resolution:</span>
                      <span className="text-xs text-amber-900/80">Flagged for Founder Call. Need to understand if these were paid pilots or full ARR contracts.</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" /> Missing Data / Founder Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-sm text-slate-700 mb-2">
                {isPublic 
                  ? "The following metrics are missing from public data and must be requested:"
                  : "The following metrics are missing from the Data Room:"}
              </p>
              <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700">
                {publicProfile?.unknown_private_metrics ? (
                  publicProfile.unknown_private_metrics.map((m: any, i: number) => (
                    <li key={i}><strong>{m.metric}:</strong> {m.diligence_required}</li>
                  ))
                ) : (
                  <>
                    <li>Detailed breakdown of CAC by channel</li>
                    <li>Enterprise vs SMB revenue split</li>
                    <li>Next 12 months pipeline coverage</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
          
          {isPublic && publicProfile?.analyst_assumptions && (
            <Card>
              <CardHeader className="pb-3 border-b bg-slate-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" /> System Assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Used for Fund Math</p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700">
                  {publicProfile.analyst_assumptions.map((m: string, i: number) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3 border-b bg-slate-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" /> Source Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                {isPublic ? (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="truncate">TechCrunch / Media</span>
                      <Badge className="bg-emerald-100 text-emerald-800">High Trust</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="truncate">Company Blog / PR</span>
                      <Badge className="bg-blue-100 text-blue-800">1st Party</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="truncate">Twitter / Rumors</span>
                      <Badge className="bg-slate-100 text-slate-800">Low Trust</Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="truncate">Stripe Billing Export</span>
                      <Badge className="bg-emerald-100 text-emerald-800">Verified API</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="truncate">Pitch Deck (PDF)</span>
                      <Badge className="bg-blue-100 text-blue-800">Founder Claim</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="truncate">Data Room Excel</span>
                      <Badge className="bg-amber-100 text-amber-800">Needs Audit</Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
