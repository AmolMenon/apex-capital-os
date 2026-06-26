"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import { Target, Search, Cpu, FileText, ArrowRight, ShieldAlert, CheckCircle, FlaskConical, Map } from "lucide-react"

export default function RealBenchmarksPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDeals()
        setDeals(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-center animate-pulse text-muted-foreground">Loading Benchmarks...</div>

  // Filter only the benchmark deals
  const publicBenchmarks = deals.filter(d => ["Sarvam AI", "Zepto", "Mistral AI", "TrueFan AI", "Integra Robotics"].includes(d.startup_name))

  const getSourceQualityBadge = (company: string) => {
    if (company === "Sarvam AI") return <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800">High Trust (Public)</Badge>
    if (company === "Zepto") return <Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800">Mixed Signals</Badge>
    if (company === "Mistral AI") return <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800">High Trust (Public)</Badge>
    return <Badge variant="outline">Unverified</Badge>
  }

  const getBenchmarkConclusion = (company: string) => {
    if (company === "Sarvam AI") return "Strong technical moat, high execution speed. Cap at $1B valuation. Deep diligence on retention required."
    if (company === "Zepto") return "Massive market scale, brutal unit economics. Diligence needed on retention and dark store burn."
    if (company === "Mistral AI") return "World-class team, open-weight pioneer. Expensive entry price. Need access to private commercial metrics."
    return "Pending 12-agent loop evaluation."
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:bg-blue-900/40 mb-2 font-mono">PUBLIC SIGNAL ANALYSIS</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Target className="w-9 h-9 text-indigo-600 dark:text-indigo-400" /> Real Startup Benchmarks
          </h1>
          <p className="text-muted-foreground text-lg mt-2 max-w-3xl">
            A showcase of publicly funded startups evaluated by Apex. We scrape public data to form a baseline thesis, identifying exactly what private diligence must uncover before we write a check.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/compare">
            <Button variant="outline" className="font-semibold shadow-sm"><Map className="w-4 h-4 mr-2"/> Compare Top 3</Button>
          </Link>
          <Link href="/demo-control-center">
            <Button className="bg-slate-900 hover:bg-slate-800 font-semibold shadow-sm">Demo Dashboard <ArrowRight className="w-4 h-4 ml-2"/></Button>
          </Link>
        </div>
      </div>

      {/* Flagship Notice */}
      <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-full">
            <FlaskConical className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-bold text-lg text-indigo-950">How Apex Handles Public Data</h3>
            <p className="text-sm text-indigo-900/80 leading-relaxed">
              LLMs love to hallucinate "Invest" recommendations for famous companies. Apex uses deterministic gating. For companies in this benchmark queue, the Decision Engine is hardcoded to output <strong>"Deeper Diligence Required"</strong> because public data alone can never justify a term sheet.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {publicBenchmarks.map((deal) => (
          <Card key={deal.id} className="hover:border-indigo-400 transition-all shadow-sm hover:shadow-md flex flex-col group overflow-hidden border-2 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-4 bg-slate-50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800/50 relative">
              {deal.startup_name === "Sarvam AI" && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  PRIMARY DEMO
                </div>
              )}
              <div className="flex justify-between items-start mb-1">
                <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:text-indigo-300 transition-colors">{deal.startup_name}</CardTitle>
              </div>
              <CardDescription className="flex gap-2 text-sm font-medium text-slate-500">
                <span>{deal.sector}</span> • <span>{deal.stage}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col space-y-6 bg-white">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Known Funding</span>
                  <span className="font-bold text-lg text-slate-800 dark:text-slate-200">${deal.funding_raised ? (deal.funding_raised / 1000000).toFixed(0) : '??'}M</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Source Truth</span>
                  {getSourceQualityBadge(deal.startup_name)}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-sm flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 block flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Agent Conclusion
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{getBenchmarkConclusion(deal.startup_name)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                <Link href={`/deals/${deal.id}/web-research`}>
                  <Button variant="outline" size="sm" className="w-full text-xs h-9 bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-100 dark:bg-slate-900/40 hover:text-indigo-700 dark:text-indigo-300 transition-colors"><Search className="w-3 h-3 mr-1.5"/> Research</Button>
                </Link>
                <Link href={`/deals/${deal.id}/agent-workflow`}>
                  <Button variant="outline" size="sm" className="w-full text-xs h-9 bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-100 dark:bg-slate-900/40 hover:text-indigo-700 dark:text-indigo-300 transition-colors"><Cpu className="w-3 h-3 mr-1.5"/> AI Loop</Button>
                </Link>
                <Link href={`/deals/${deal.id}/deal-room`} className="col-span-2">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-xs h-10 shadow-sm"><Target className="w-4 h-4 mr-2"/> Enter Deal Room</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
