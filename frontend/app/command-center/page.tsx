"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import { LayoutDashboard, ArrowRight, Zap, AlertTriangle, ShieldAlert, FileText, CheckCircle2, FlaskConical, Target, Cpu, Activity, Presentation, Bot, Database, Map, Radar, PieChart, Network, Users, BookOpen, Play, CheckSquare, Plus } from "lucide-react"
import { OperationsPanel } from "@/components/OperationsPanel"

export default function VCAnalystHome() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [pipeline, setPipeline] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [data, p] = await Promise.all([
          api.getDeals(),
          api.getSourcingPipeline()
        ])
        setDeals(data)
        setPipeline(p)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-center animate-pulse text-muted-foreground">Loading Desk...</div>

  // Mock categorizations for demo purposes
  const sarvam = deals.find(d => d.startup_name === "Sarvam AI") || deals[0]
  const mistral = deals.find(d => d.startup_name === "Mistral AI") || deals[1]
  const zepto = deals.find(d => d.startup_name === "Zepto") || deals[2]
  const publicBenchmarks = deals.filter(d => ["Sarvam AI", "Zepto", "Mistral AI", "TrueFan AI", "Integra Robotics"].includes(d.startup_name))
  
  return (
    <div className="bg-gradient-to-br from-background to-emerald-500/5 dark:to-emerald-900/10 min-h-screen pt-8 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" /> VC Analyst Home
          </h1>
          <p className="text-muted-foreground text-lg mt-2">Your highest priority deals, blocked workflows, and IC-ready memos.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/deals/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"><Plus className="w-4 h-4 mr-2" /> Add New Deal</Button>
          </Link>
          <Link href="/demo-control-center">
            <Button variant="outline" className="font-semibold shadow-sm"><Presentation className="w-4 h-4 mr-2" /> Open Demo Control Center</Button>
          </Link>
        </div>
      </div>

      {/* Main Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
        {/* Global Copilot Card */}
        <Card className="border-blue-500/20 bg-blue-500/5 backdrop-blur-md shadow-lg col-span-1 md:col-span-2 lg:col-span-3 transition-all hover:shadow-blue-500/10">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full shrink-0">
                 <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">Ask Apex Across the Fund</h3>
                <p className="text-sm text-blue-800/80 dark:text-blue-300/80 max-w-2xl">Use the Cross-Deal Copilot to compare startups, find the strongest public signals, identify the weakest evidence, and determine which deal needs attention first.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="bg-white/50 dark:bg-neutral-800/50 text-blue-700 dark:text-blue-300">Which deal has the highest IC readiness?</Badge>
                  <Badge variant="outline" className="bg-white/50 dark:bg-neutral-800/50 text-blue-700 dark:text-blue-300">Which deal fails fund math?</Badge>
                </div>
              </div>
            </div>
            <Link href="/copilot" className="shrink-0">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
                Open Cross-Deal Copilot <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Sourcing Radar Snapshot */}
        <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-lg col-span-1 md:col-span-2 lg:col-span-3 transition-all hover:shadow-emerald-500/10">
          <CardHeader className="pb-3 border-b border-emerald-100 dark:border-emerald-900/30">
            <CardTitle className="flex items-center gap-2 text-emerald-900 dark:text-emerald-400">
              <Radar className="w-5 h-5" /> Sourcing Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-500 mb-2">Top Thesis Tracker</h4>
                <p className="font-semibold dark:text-zinc-200">India AI Infrastructure</p>
                <Link href="/sourcing/theses/india_ai_infra">
                  <Button variant="link" className="px-0 text-emerald-600 dark:text-emerald-400 h-auto py-1">Discover Companies <ArrowRight className="w-3 h-3 ml-1" /></Button>
                </Link>
              </div>
              <div>
                <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-500 mb-2">Highest Priority Lead</h4>
                {pipeline.length > 0 ? (
                  <>
                    <p className="font-semibold dark:text-zinc-200">{pipeline[0].company_name}</p>
                    <Link href={`/sourcing/companies/${pipeline[0].company_id}`}>
                      <Button variant="link" className="px-0 text-emerald-600 dark:text-emerald-400 h-auto py-1">Draft Outreach <ArrowRight className="w-3 h-3 ml-1" /></Button>
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No leads found.</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-500 mb-2">Market Signals</h4>
                <p className="font-semibold dark:text-zinc-200">Spike in Indic LLM Tooling</p>
                <Link href="/market-radar">
                  <Button variant="link" className="px-0 text-emerald-600 dark:text-emerald-400 h-auto py-1">Refresh Market Radar <ArrowRight className="w-3 h-3 ml-1" /></Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md shadow-lg transition-all hover:shadow-indigo-500/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Highest Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{sarvam?.startup_name}</span>
                <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800">IC Ready</Badge>
              </div>
              <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80">Agentic workflow complete. Red Team risks mitigated. Ready for partner review.</p>
              <div className="flex gap-2 w-full">
                <Link href={`/deals/${sarvam?.id}/ic-packet`} className="w-1/2 block">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">IC Packet <ArrowRight className="w-3 h-3 ml-1" /></Button>
                </Link>
                <Link href={`/deals/${sarvam?.id}/war-room`} className="w-1/2 block">
                  <Button variant="outline" className="w-full border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-white">War Room <ArrowRight className="w-3 h-3 ml-1" /></Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-md shadow-lg transition-all hover:shadow-amber-500/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Biggest Blocker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{mistral?.startup_name}</span>
                <Badge className="bg-amber-200 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700">Data Missing</Badge>
              </div>
              <p className="text-sm text-amber-900/80 dark:text-amber-100/80">Web research returned conflicting private valuation metrics. Manual intervention needed.</p>
              <Link href={`/deals/${mistral?.id}/evidence-center`} className="block w-full">
                <Button variant="outline" className="w-full border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:bg-amber-900/40">Resolve Conflict <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-500/20 bg-slate-500/5 backdrop-blur-md shadow-lg transition-all hover:shadow-slate-500/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <FlaskConical className="w-5 h-5 text-slate-600 dark:text-slate-400" /> Newest Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{zepto?.startup_name}</span>
                <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">Evaluating</Badge>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">Public benchmark initiated. Waiting for 12-agent loop to complete execution.</p>
              <Link href={`/deals/${zepto?.id}/agent-workflow`} className="block w-full">
                <Button variant="outline" className="w-full">View Live Trace <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Portfolio Intelligence Snapshot */}
      <div className="grid grid-cols-1 mb-8">
        <Card className="bg-gradient-to-r from-zinc-900 to-indigo-950 border-indigo-900/50">
          <CardHeader>
            <CardTitle className="text-xl font-light text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-400" />
              Portfolio Intelligence Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Active Portfolio</p>
                <div className="text-2xl font-semibold text-white">6 Companies</div>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1" title="Weighted aggregate of active portfolio company health scores (0-100)">Portfolio Health</p>
                <div className="text-2xl font-semibold text-emerald-400">85 <span className="text-sm text-emerald-600/70">/ 100</span></div>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Follow-On Ready</p>
                <div className="text-2xl font-semibold text-amber-400">2 Candidates</div>
              </div>
              <div className="flex items-center">
                <Link href="/portfolio" className="w-full">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Open Portfolio HQ</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <OperationsPanel entityType="fund" entityId="apex_fund" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        
        {/* Public Benchmark Queue */}
        <Card className="shadow-lg bg-background/80 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-slate-500" /> Public Benchmark Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {publicBenchmarks.slice(0,4).map((deal, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{deal.startup_name}</span>
                  {i === 0 && <Badge className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200">Primary Demo</Badge>}
                </div>
                <Link href={`/deals/${deal.id}/deal-room`}>
                  <Button variant="ghost" size="sm" className="text-xs">Open <ArrowRight className="w-3 h-3 ml-1" /></Button>
                </Link>
              </div>
            ))}
            <Link href="/real-benchmarks" className="block pt-2">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">View All Benchmarks</span>
            </Link>
          </CardContent>
        </Card>

        {/* Agentic Workflow Queue */}
        <Card className="shadow-lg bg-background/80 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="w-5 h-5 text-indigo-500" /> Agentic Workflow Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-semibold">{sarvam?.startup_name}</td>
                  <td className="py-3"><Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200">Completed</Badge></td>
                  <td className="py-3 text-xs text-muted-foreground">12/12 Agents</td>
                  <td className="py-3 text-right">
                    <Link href={`/deals/${sarvam?.id}/agent-workflow`}><Button variant="ghost" size="sm">Trace</Button></Link>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-semibold">{zepto?.startup_name}</td>
                  <td className="py-3"><Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 animate-pulse">Running</Badge></td>
                  <td className="py-3 text-xs text-muted-foreground">4/12 Agents</td>
                  <td className="py-3 text-right">
                    <Link href={`/deals/${zepto?.id}/agent-workflow`}><Button variant="ghost" size="sm">Trace</Button></Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">{mistral?.startup_name}</td>
                  <td className="py-3"><Badge className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">Fallback Used</Badge></td>
                  <td className="py-3 text-xs text-muted-foreground">12/12 Agents</td>
                  <td className="py-3 text-right">
                    <Link href={`/deals/${mistral?.id}/agent-workflow`}><Button variant="ghost" size="sm">Trace</Button></Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Evidence & Memos */}
        <Card className="shadow-lg bg-background/80 backdrop-blur-md border-red-500/20">
          <CardHeader className="bg-red-500/5 pb-3 border-b border-red-500/10">
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200"><ShieldAlert className="w-5 h-5" /> Evidence Risk Watchlist</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="font-semibold block">{zepto?.startup_name}</span>
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">Missing private unit economics</span>
              </div>
              <Link href={`/deals/${zepto?.id}/evidence-center`}><Button variant="ghost" size="sm">Audit</Button></Link>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold block">{mistral?.startup_name}</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Source conflicts on ARR multiple</span>
              </div>
              <Link href={`/deals/${mistral?.id}/evidence-center`}><Button variant="ghost" size="sm">Audit</Button></Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-background/80 backdrop-blur-md border-emerald-500/20">
          <CardHeader className="bg-emerald-500/5 pb-3 border-b border-emerald-500/10">
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200"><FileText className="w-5 h-5" /> Memo Readiness</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <span className="font-semibold flex items-center gap-2">{sarvam?.startup_name} <CheckCircle2 className="w-4 h-4 text-emerald-500"/></span>
                <span className="text-xs text-muted-foreground">IC One-Pager Generated</span>
              </div>
              <Link href={`/deals/${sarvam?.id}/ic-packet`}><Button variant="outline" size="sm" className="border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">Open Packet</Button></Link>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold flex items-center gap-2">{zepto?.startup_name}</span>
                <span className="text-xs text-muted-foreground">Awaiting Partner Review</span>
              </div>
              <Link href={`/deals/${zepto?.id}/partner-review`}><Button variant="ghost" size="sm">Review</Button></Link>
            </div>
          </CardContent>
        </Card>

      </div>

        <Card className="shadow-lg bg-background/80 backdrop-blur-md border-border/50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg dark:bg-emerald-900/30">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Private Data Room Demo</h2>
              <p className="text-sm text-neutral-500">Showcase diligence parsing vs public benchmark.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm">Use <strong>NeuralDesk</strong> to show how Apex parses private diligence materials, extracts metrics, detects contradictions, and upgrades IC readiness.</p>
            <p className="text-sm">Use <strong>Sarvam AI</strong> to show public benchmark analysis where private data is missing, keeping IC readiness capped.</p>
            
            <div className="flex flex-col space-y-2 mt-4">
              <Link href="/deals/1/data-room">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Open NeuralDesk Data Room</Button>
              </Link>
              <Link href="/deals/2/data-room">
                <Button variant="outline" className="w-full">Open Sarvam Benchmark Contrast</Button>
              </Link>
            </div>
          </div>
        </Card>

    </div>
  )
}
