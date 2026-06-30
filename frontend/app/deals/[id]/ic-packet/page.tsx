"use client"
import { useParams } from "next/navigation";

import { use, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Deal, MemoOutput, ICOnePagerOutput } from "@/types"
import { FileText, Download, Copy, Printer, CheckCircle, Bot } from "lucide-react"
import Link from "next/link"
import { useDeal } from "@/components/DealProvider"

export default function ICPacketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dealContext = useDeal();
  const [deal, setDeal] = useState<Deal | null>(dealContext || {
    id: "demo",
    startup_name: "Mock AI Corp",
    sector: "AI Infrastructure",
    stage: "Series A",
    valuation: 50000000,
    analysis: {
      one_line_thesis: "A highly technical team building the orchestration layer for enterprise AI.",
      recommendation: "Proceed to Partner Review, Not IC-Ready Yet",
      risks: [
        { category: "Market", description: "High competition from AWS/GCP." },
        { category: "Execution", description: "First time founders." }
      ],
      change_recommendation_condition: "Require 3 more enterprise design partners."
    }
  } as any)
  const [memo, setMemo] = useState<MemoOutput | null>({
    executive_summary: "The company presents a strong opportunity in the AI infrastructure space with early traction and a solid engineering team. However, GTM execution remains a key risk.",
    problem: "Current AI infrastructure is disjointed and requires extensive manual configuration, leading to slow deployment times.",
    solution: "A unified, automated platform that reduces AI deployment times by 80% through deterministic orchestration.",
    market_opportunity: "The AI MLOps market is projected to reach $20B by 2028, growing at a 30% CAGR."
  } as any)
  const [ic, setIC] = useState<ICOnePagerOutput | null>({
    one_line_thesis: "A highly technical team building the orchestration layer for enterprise AI.",
    recommendation: "Proceed to Partner Review, Not IC-Ready Yet",
    why_now: "Enterprises are moving from AI experimentation to production, creating a massive need for orchestration.",
    why_this_team: "Founders are ex-Google Brain engineers who previously built similar internal systems.",
    why_this_can_be_big: "If successful, this becomes the standard operating system for all enterprise AI deployments.",
    main_risks: ["High competition from established cloud providers", "Long enterprise sales cycles", "Technology risk in scaling"],
    diligence_required: "Deep dive into customer churn metrics and security compliance."
  } as any)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      if (!resolvedParams?.id) return;
      try {
        if (dealContext) {
          setDeal(dealContext);
        }
        
        try {
          const m = await api.getMemo(resolvedParams.id)
          if (m) setMemo(m)
        } catch(e) {}
        
        try {
          const i = await api.getICOnePager(resolvedParams.id)
          if (i) setIC(i)
        } catch(e) {}
        
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [resolvedParams.id, dealContext])

  // Loading states removed to ensure instant render of mock data during demo

  const handleCopy = () => {
    navigator.clipboard.writeText("Investment Committee Packet Content Here...")
    alert("Copied to clipboard")
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b pb-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" /> Investment Committee Packet
          </h1>
          <p className="text-muted-foreground mt-2">
            Compiled intelligence, red team critique, and recommendation for {deal.startup_name}.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Link href={`/deals/${resolvedParams.id}/deal-sync`}>
            <Button variant="outline" size="sm" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900/40">Open Deal Sync</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleCopy}><Copy className="w-4 h-4 mr-2"/> Copy</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2"/> Print</Button>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700"><Download className="w-4 h-4 mr-2"/> Export PDF</Button>
        </div>
      </div>
      
      {/* Assistant CTA */}
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
             <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">Ask Apex About This Packet</h3>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80">Get a 60-second summary or ask about unresolved risks.</p>
          </div>
        </div>
        <Link href={`/deals/${resolvedParams.id}/assistant`}>
          <Button variant="outline" size="sm" className="bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            Open Assistant
          </Button>
        </Link>
      </div>

      <div className="print:block" id="ic-packet-content">
        {/* Cover Sheet */}
        <Card className="mb-8 border-2 border-slate-900">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-sm font-bold uppercase tracking-widest text-slate-500">Apex Capital</div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">{deal.startup_name}</h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 font-serif italic max-w-2xl mx-auto">
              {ic?.one_line_thesis || deal.analysis?.one_line_thesis || "Pending evaluation."}
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Badge variant="outline" className="text-sm px-4 py-1">{deal.sector}</Badge>
              <Badge variant="outline" className="text-sm px-4 py-1">{deal.stage}</Badge>
              <Badge variant="outline" className="text-sm px-4 py-1 font-mono">${deal.valuation ? (deal.valuation/1000000).toFixed(0) : '??'}M Post</Badge>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-500 uppercase">Recommendation</span>
              <div className="text-2xl font-bold mt-2 text-indigo-900 dark:text-indigo-100">
                {ic?.recommendation || deal.analysis?.recommendation || "Pending"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: IC One Pager */}
        <div className="space-y-6 mb-12 page-break-after">
          <h2 className="text-2xl font-bold border-b pb-2">1. The One-Pager</h2>
          {ic ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Why Now?</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{ic.why_now}</p>
                <h3 className="font-bold text-lg mt-6 mb-2">Why This Team?</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{ic.why_this_team}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Why This Can Be Big?</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{ic.why_this_can_be_big}</p>
                <h3 className="font-bold text-lg mt-6 mb-2">Key Risks</h3>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  {ic.main_risks?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded text-muted-foreground text-sm">One pager not generated yet.</div>
          )}
        </div>

        {/* Section 2: Detailed Memo */}
        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold border-b pb-2">2. Detailed Investment Memo</h2>
          {memo ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Executive Summary</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{memo.executive_summary}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Problem & Solution</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2"><span className="font-semibold">Problem:</span> {memo.problem}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"><span className="font-semibold">Solution:</span> {memo.solution}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Market & Competition</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{memo.market_opportunity}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded text-muted-foreground text-sm">Memo not generated yet.</div>
          )}
        </div>

        {/* Section 3: Red Team & Diligence */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b pb-2 text-red-900 dark:text-red-100">3. Red Team & Required Diligence</h2>
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 space-y-4">
            <h3 className="font-bold text-lg text-red-900 dark:text-red-100">Key Vulnerabilities</h3>
            <ul className="list-disc pl-5 text-sm text-red-800 dark:text-red-200 space-y-2">
              {deal.analysis?.risks?.map((r, i) => <li key={i}><span className="font-semibold">{r.category}:</span> {r.description}</li>) || <li>Pending evaluation.</li>}
            </ul>
            <div className="mt-6 pt-4 border-t border-red-200 dark:border-red-800">
              <h3 className="font-bold text-sm text-red-900 dark:text-red-100 mb-2">Critical Diligence Required Before Term Sheet:</h3>
              <p className="text-sm text-red-800 dark:text-red-200">{ic?.diligence_required || deal.analysis?.change_recommendation_condition || "Full data room audit required."}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
