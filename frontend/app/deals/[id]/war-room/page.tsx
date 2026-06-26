"use client"
import { OperationsPanel } from "@/components/OperationsPanel";
import { useDeal } from "@/components/DealProvider";
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { DealWarRoom, Deal } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentThesisPanel } from "@/components/war-room/InvestmentThesisPanel"
import { AntiThesisPanel } from "@/components/war-room/AntiThesisPanel"
import { WhatMustBeTrueTable } from "@/components/war-room/WhatMustBeTrueTable"
import { ConvictionDashboard } from "@/components/war-room/ConvictionDashboard"
import { PartnerPersonaGrid } from "@/components/war-room/PartnerPersonaGrid"
import { ICSimulationPanel } from "@/components/war-room/ICSimulationPanel"
import { FundMathPanel } from "@/components/war-room/FundMathPanel"
import { ChangeOurMindPanel } from "@/components/war-room/ChangeOurMindPanel"
import { ArrowLeft, PlayCircle, Loader2, FileText, CheckCircle, Users, Cpu } from "lucide-react"
import Link from "next/link"

import { useParams } from "next/navigation"

export default function WarRoomPage() {
  const params = useParams()
  const id = params.id as string
  const deal = useDeal()
  const [warRoom, setWarRoom] = useState<DealWarRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const wrData = await api.getWarRoom(id)
        setWarRoom(wrData)
      } catch (e) {
        console.warn("War Room data not found yet.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const runWarRoom = async () => {
    setRunning(true)
    try {
      const data = await api.runWarRoom(id)
      setWarRoom(data)
    } catch (error) {
      console.error(error)
      alert("Failed to run War Room Engine.")
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" /> Loading War Room...</div>
  }

  if (!deal) {
    return <div className="p-12 text-center text-muted-foreground">Deal not found.</div>
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto space-y-6 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href={`/deals/${id}/deal-room`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Deal Room
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{deal.startup_name}</h1>
            {deal.is_public_benchmark && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Public Benchmark</Badge>}
            <Badge variant="outline" className="uppercase tracking-widest text-[10px]">War Room</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Autonomous Deal War Room & IC Simulator. Translating evidence into investment conviction, partner debate, and fund math.
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/deals/${id}/ic-one-pager`}>
            <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> IC Packet</Button>
          </Link>
          <Button onClick={runWarRoom} disabled={running}>
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
            {warRoom ? "Re-Run War Room" : "Run War Room"}
          </Button>
        </div>
      </div>

      {/* Top Status Bar */}
      {warRoom && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="bg-muted/30 p-4 rounded-lg border">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Recommendation</div>
            <div className="font-bold text-sm">{warRoom.final_recommendation.recommendation}</div>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg border">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Conviction Score</div>
            <div className="font-bold text-sm text-primary">{warRoom.conviction_score.overall_score}/100</div>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg border hidden lg:block">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Conviction Level</div>
            <div className="font-bold text-sm">{warRoom.conviction_score.conviction_level}</div>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg border hidden md:block">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Committee View</div>
            <div className="font-bold text-sm">{warRoom.ic_simulation.committee_decision}</div>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg border">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">War Room Status</div>
            <div className="font-bold text-sm text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {warRoom.war_room_status.replace(/_/g, " ")}</div>
          </div>
        </div>
      )}
      
      {warRoom && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-200">Partner Questions You Can Ask Apex</h3>
          </div>
          <p className="text-sm text-blue-800/80 dark:text-blue-300/80 mb-4">Click any question to ask the Partner Copilot using the War Room's generated context.</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Why would the Fund Math Partner oppose?",
              "What is the strongest case for this company?",
              "What is the strongest case against?",
              "Which partner would block this deal?",
              "What must be true for this to return the fund?",
              "What would change the IC decision?"
            ].map(q => (
              <Link key={q} href={`/deals/${id}/copilot`}>
                <Badge variant="outline" className="bg-white dark:bg-neutral-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 py-1.5 px-3 cursor-pointer transition-colors">
                  {q}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Tabs */}
      {!warRoom ? (
        <div className="py-24 text-center border rounded-lg bg-muted/10 border-dashed">
          <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">Deal War Room is Empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Run the Autonomous Deal War Room to simulate an investment committee debate, calculate conviction, and model fund returns.
          </p>
          <Button size="lg" onClick={runWarRoom} disabled={running}>
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
            Start War Room Simulation
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="conviction" className="w-full">
          <TabsList className="w-full justify-start h-auto flex-wrap bg-transparent border-b rounded-none px-0 gap-4 mb-6">
            <TabsTrigger value="conviction" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">Conviction</TabsTrigger>
            <TabsTrigger value="thesis" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">Thesis & Anti-Thesis</TabsTrigger>
            <TabsTrigger value="what-must-be-true" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">What Must Be True</TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">Partner Personas</TabsTrigger>
            <TabsTrigger value="ic-sim" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">IC Simulation</TabsTrigger>
            <TabsTrigger value="fund-math" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">Fund Math</TabsTrigger>
            <TabsTrigger value="change-mind" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2">Change Our Mind</TabsTrigger>
          </TabsList>

          <TabsContent value="conviction" className="mt-0">
            <ConvictionDashboard score={warRoom.conviction_score} />
          </TabsContent>
          
          <TabsContent value="thesis" className="mt-0 space-y-6">
            <InvestmentThesisPanel thesis={warRoom.thesis} />
            <AntiThesisPanel antiThesis={warRoom.anti_thesis} />
          </TabsContent>

          <TabsContent value="what-must-be-true" className="mt-0">
            <WhatMustBeTrueTable items={warRoom.what_must_be_true || []} />
          </TabsContent>

          <TabsContent value="partners" className="mt-0">
            <PartnerPersonaGrid personas={warRoom.partner_personas || []} />
          </TabsContent>

          <TabsContent value="ic-sim" className="mt-0">
            <ICSimulationPanel simulation={warRoom.ic_simulation} />
          </TabsContent>

          <TabsContent value="fund-math" className="mt-0">
            <FundMathPanel 
              valuationSensitivity={warRoom.valuation_sensitivity} 
              ownershipScenarios={warRoom.ownership_scenarios} 
              fundReturnScenarios={warRoom.fund_return_scenarios} 
            />
          </TabsContent>

          <TabsContent value="change-mind" className="mt-0">
            <ChangeOurMindPanel conditions={warRoom.change_our_mind || []} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

