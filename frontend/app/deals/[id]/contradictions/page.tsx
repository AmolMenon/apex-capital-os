"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowRightLeft, CheckCircle2, FileText, Activity } from "lucide-react"

interface ContradictionSource {
  name: string
  claim: string
  snippet: string
}

interface Contradiction {
  id: number
  severity: string
  explanation: string
  sourceA: ContradictionSource
  sourceB: ContradictionSource
  status: string
}

export default function ContradictionCenter() {
  const [loading, setLoading] = useState(true)
  const [contradictions, setContradictions] = useState<Contradiction[]>([])

  useEffect(() => {
    // Simulate progressive loading
    const timer = setTimeout(() => {
      setContradictions([
        {
          id: 1,
          severity: "HIGH",
          explanation: "The pitch deck claims a highly engaged user base with 200 enterprise customers, but the financial model only projects revenue from 35 paying customers. This suggests 165 pilots are either unpaid or churning.",
          sourceA: {
            name: "Pitch Deck - Q3 2024",
            claim: "200 active enterprise customers driving network effects.",
            snippet: "...momentum is accelerating. We currently serve 200 active enterprise customers driving massive network effects across the platform..."
          },
          sourceB: {
            name: "Financial Model v2",
            claim: "Revenue derived from 35 paying customers.",
            snippet: "...Row 45: Enterprise Licenses (Active): 35... Average Contract Value: $12,000..."
          },
          status: "OPEN"
        }
      ])
      setLoading(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-1000">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Contradiction Center</h1>
          <p className="text-muted-foreground">Auditing documents for logical inconsistencies...</p>
        </div>
        <Card className="animate-pulse bg-muted/20 h-64" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-rose-500" /> Contradiction Center
          </h1>
          <p className="text-muted-foreground text-lg mt-2">AI-driven audit of document discrepancies.</p>
        </div>
        <Badge variant="outline" className="px-4 py-2 bg-rose-500/10 text-rose-500 border-rose-500/30">
          {contradictions.filter(c => c.status === "OPEN").length} Open Flags
        </Badge>
      </div>

      <div className="space-y-8">
        {contradictions.map(contradiction => (
          <Card key={contradiction.id} className="border-rose-500/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-rose-950/10 border-b border-rose-500/20 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-rose-500 text-white font-bold">{contradiction.severity} RISK</Badge>
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Activity className="w-4 h-4" /> Detected by Auditor Agent
                    </span>
                  </div>
                  <CardTitle className="text-xl leading-relaxed">{contradiction.explanation}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Resolved
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                
                {/* Source A */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <FileText className="w-4 h-4" /> {contradiction.sourceA.name}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Claim A</div>
                    <p className="font-medium">{contradiction.sourceA.claim}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-md border text-sm font-mono text-muted-foreground leading-relaxed">
                    {contradiction.sourceA.snippet.split("200 active enterprise customers").map((part: string, i: number, arr: string[]) => 
                      <span key={i}>
                        {part}
                        {i !== arr.length - 1 && <mark className="bg-rose-500/20 text-rose-300 px-1 rounded">200 active enterprise customers</mark>}
                      </span>
                    )}
                  </div>
                </div>

                {/* Source B */}
                <div className="p-6 space-y-4 bg-muted/10">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <FileText className="w-4 h-4" /> {contradiction.sourceB.name}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Claim B</div>
                    <p className="font-medium">{contradiction.sourceB.claim}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-md border text-sm font-mono text-muted-foreground leading-relaxed">
                    {contradiction.sourceB.snippet.split("35").map((part: string, i: number, arr: string[]) => 
                      <span key={i}>
                        {part}
                        {i !== arr.length - 1 && <mark className="bg-rose-500/20 text-rose-300 px-1 rounded">35</mark>}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </CardContent>
            <div className="bg-background p-3 text-center border-t border-rose-500/10">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-500/70 flex justify-center items-center gap-2">
                <ArrowRightLeft className="w-3 h-3" /> Direct Conflict Detected
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
