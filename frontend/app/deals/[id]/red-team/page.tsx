"use client"
import { useParams } from "next/navigation";

import { use, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Deal, FullAnalysisOutput } from "@/types"
import { ShieldAlert, TrendingDown, Target, HelpCircle, CheckCircle } from "lucide-react"

export default function RedTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useParams() as any;
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const d = await api.getDeal(resolvedParams.id)
        setDeal(d)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [resolvedParams.id])

  if (loading) return <div className="p-8 text-center animate-pulse">Summoning Red Team...</div>
  if (!deal) return <div className="p-8 text-center text-red-500">Deal not found.</div>

  const analysis: FullAnalysisOutput | null = deal.analysis || null

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="border-b border-red-200 dark:border-red-800 pb-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-red-900 dark:text-red-100">
          <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" /> Red Team Room
        </h1>
        <p className="text-red-800/80 mt-2">
          Skeptical partner analysis. We actively try to kill the deal here to find its breaking points.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-red-200 dark:border-red-800 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-900 dark:text-red-100">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" /> Primary Deal Killers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis?.risks?.map((risk, i) => (
              <div key={i} className="border-b border-red-200 dark:border-red-800 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-red-900 dark:text-red-100 text-sm">{risk.category}</span>
                  <Badge className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800">{risk.severity}</Badge>
                </div>
                <p className="text-sm text-red-900/80">{risk.description}</p>
                <div className="mt-2 text-xs bg-red-100/50 p-2 rounded text-red-900 dark:text-red-100">
                  <span className="font-semibold">Required Mitigation: </span>{risk.mitigation}
                </div>
              </div>
            )) || (
              <div className="text-sm text-red-800 dark:text-red-200">No critical risks identified yet. Run Agent Workflow.</div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Hype & Valuation Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-900/90 leading-relaxed">
                The current valuation implies massive forward growth that is completely unproven.
                Assuming a conservative 10x ARR multiple, the company would need to scale revenue by 400% YoY for the next 3 years just to grow into the proposed post-money valuation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <HelpCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" /> Partner Pushback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm space-y-2 text-slate-700 dark:text-slate-300">
                {analysis?.partner_pushback?.map((q, i) => (
                  <li key={i}>{q.question || q}</li>
                )) || (
                  <>
                    <li>"If this space is so hot, why hasn't a major incumbent replicated the core feature?"</li>
                    <li>"What is the actual switching cost once a customer integrates?"</li>
                    <li>"How do we underwrite a 100x return from this entry price?"</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> What Would Change Our Mind?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-900/90 leading-relaxed">
            {analysis?.change_recommendation_condition || 
              "We would flip to a Strong Yes if the founders can definitively prove >130% Net Dollar Retention among enterprise accounts and secure a lead investor who can validate the technical moat."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
