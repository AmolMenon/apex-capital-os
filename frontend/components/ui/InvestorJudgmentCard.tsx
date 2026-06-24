"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, AlertTriangle, Scale, Target, ShieldAlert, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { api } from "@/lib/api"

interface InvestorJudgmentCardProps {
  recommendation: string
  whyNotInvest: string
  mainRisk: string
  whatWouldChange: string[]
  nextAction: string
  nextActionHref: string
  dealId?: string
}

export function InvestorJudgmentCard({
  recommendation,
  whyNotInvest,
  mainRisk,
  whatWouldChange,
  nextAction,
  nextActionHref,
  dealId
}: InvestorJudgmentCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!dealId) return
    setIsGenerating(true)
    try {
      await api.analyzeDeal(dealId)
      window.location.reload()
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }
  
  const isInvest = recommendation.toLowerCase().includes("invest") && !recommendation.toLowerCase().includes("watchlist")
  const statusColor = isInvest ? "bg-emerald-500/20 text-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-amber-500/10 text-amber-500 border-amber-500/50"
  const icon = isInvest ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Scale className="w-5 h-5 text-amber-500" />
  const cardGlow = isInvest ? "shadow-[0_0_25px_rgba(16,185,129,0.15)] border-emerald-500/30" : "border-primary/20"

  return (
    <Card className={`bg-background/80 backdrop-blur-md shadow-xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${cardGlow}`}>
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none transition-transform duration-700 hover:scale-110">
        <Target className="w-48 h-48" />
      </div>
      
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Investor Judgment Snapshot
            </CardTitle>
            <CardDescription className="mt-1">
              Deterministic recommendation based on thesis and evidence scoring.
            </CardDescription>
          </div>
          <Badge variant="outline" className={`px-4 py-2 text-sm font-bold border-2 flex items-center gap-2 transition-all duration-300 ${statusColor}`}>
            {icon}
            {recommendation}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Why Not Automatically &quot;Invest&quot;?
            </h4>
            <p className="text-sm font-medium leading-relaxed p-3 bg-muted/50 rounded-md border-l-4 border-amber-400">
              {whyNotInvest}
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Primary Diligence Risk
            </h4>
            <p className="text-sm font-medium leading-relaxed p-3 bg-destructive/5 rounded-md border-l-4 border-destructive/50 text-destructive">
              {mainRisk}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              What Would Change The Recommendation
            </h4>
            <ul className="space-y-2">
              {whatWouldChange.map((item, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="font-medium text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Required Next Action
            </h4>
            {nextAction === "Generate initial analysis" && dealId ? (
              <Button className="w-full shadow-md font-semibold hover:scale-[1.02] transition-transform duration-300" size="lg" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? <ArrowRight className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isGenerating ? "Generating Analysis..." : nextAction}
                {!isGenerating && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            ) : (
              <Link href={nextActionHref}>
                <Button className="w-full shadow-md font-semibold hover:scale-[1.02] transition-transform duration-300 group" size="lg">
                  {nextAction} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
