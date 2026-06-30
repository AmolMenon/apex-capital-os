"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrainCircuit, Search, ChevronRight, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react"

export default function CommitteeView() {
  const [loading, setLoading] = useState(true)
  const [agents, setAgents] = useState<any[]>([])
  const [moderator, setModerator] = useState<any>(null)
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null)

  useEffect(() => {
    // Simulate progressive streaming from the backend API
    const timer = setTimeout(() => {
      setAgents([
        {
          role: "Founder Agent",
          recommendation: "INVEST",
          confidence: 85,
          observations: ["Repeat founder", "Domain expertise in AI"],
          evidenceCount: 2
        },
        {
          role: "Market Agent",
          recommendation: "WAIT",
          confidence: 60,
          observations: ["TAM is expanding", "But highly fragmented"],
          evidenceCount: 4
        },
        {
          role: "Financial Agent",
          recommendation: "PASS",
          confidence: 90,
          observations: ["Burn rate unsustainable", "CAC payback > 24mo"],
          evidenceCount: 3
        }
      ])
      
      setModerator({
        recommendation: "WAIT",
        confidence: 75,
        why: "Strong team but unit economics do not support Series A velocity.",
        comparedToWhat: "Similar to FinStack (failed 2024) due to high CAC.",
        evidence: [
          { claim: "CAC payback > 24mo", source: "Financial Model", confidence: 95, id: 1 },
          { claim: "Highly fragmented market", source: "Pitch Deck", confidence: 80, id: 2 }
        ]
      })
      setLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-1000">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Investment Committee</h1>
          <p className="text-muted-foreground">Synthesizing multi-agent intelligence...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <Card className="animate-pulse bg-muted/20 h-48" />
            <Card className="animate-pulse bg-muted/20 h-48" />
            <Card className="animate-pulse bg-muted/20 h-48" />
            <Card className="animate-pulse bg-muted/20 h-48" />
          </div>
          <Card className="animate-pulse bg-muted/20 h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 relative overflow-hidden flex h-full">
      <div className="flex-1 space-y-8 overflow-y-auto pr-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">AI Investment Committee</h1>
          <p className="text-muted-foreground text-lg mt-2">Unbiased, multi-disciplinary deal analysis.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subagents Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-primary" /> Specialist Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent, idx) => (
                <Card key={idx} className="hover:border-primary/50 transition-all cursor-default">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg">{agent.role}</CardTitle>
                      <CardDescription>Confidence: {agent.confidence}%</CardDescription>
                    </div>
                    {agent.recommendation === "INVEST" && <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">INVEST</Badge>}
                    {agent.recommendation === "PASS" && <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/30">PASS</Badge>}
                    {agent.recommendation === "WAIT" && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/30">WAIT</Badge>}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 mb-4">
                      {agent.observations.map((obs: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-primary/50 shrink-0" /> {obs}
                        </li>
                      ))}
                    </ul>
                    <Badge variant="secondary" className="text-xs font-normal">
                      <Search className="w-3 h-3 mr-1" /> {agent.evidenceCount} Citations
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Moderator Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
              <CheckCircle2 className="w-5 h-5" /> Moderator Synthesis
            </h2>
            <Card className="border-indigo-500/30 shadow-lg shadow-indigo-500/5 bg-indigo-950/10">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <CardTitle className="text-2xl text-indigo-400">Final Verdict</CardTitle>
                  <Badge className="bg-amber-500 text-black font-extrabold text-sm px-3 py-1">{moderator.recommendation}</Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Why</div>
                    <p className="text-sm leading-relaxed">{moderator.why}</p>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Compared To What</div>
                    <p className="text-sm leading-relaxed text-emerald-400/90">{moderator.comparedToWhat}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="pt-4 border-t border-indigo-500/20">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Evidence Trail</div>
                  <div className="space-y-3">
                    {moderator.evidence.map((ev: any) => (
                      <button 
                        key={ev.id}
                        onClick={() => setSelectedEvidence(ev)}
                        className="w-full text-left p-3 rounded-md bg-background/50 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30 transition-all text-sm group"
                      >
                        <div className="font-medium mb-1 group-hover:text-indigo-300 transition-colors">{ev.claim}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {ev.source}</span>
                          <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="w-3 h-3" /> {ev.confidence}% Match</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Evidence Explorer Panel */}
      {selectedEvidence && (
        <div className="w-96 border-l bg-card shadow-2xl p-6 absolute right-0 top-0 bottom-0 animate-in slide-in-from-right duration-300 z-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" /> Evidence Explorer
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setSelectedEvidence(null)}>
              <XCircle className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Claim</div>
              <div className="p-3 bg-muted rounded-md text-sm border-l-2 border-primary">
                {selectedEvidence.claim}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Source Document Extraction</div>
              <div className="p-4 bg-background border rounded-md text-sm leading-relaxed relative">
                <div className="absolute -top-3 left-3 bg-card px-2 text-xs text-muted-foreground font-mono">
                  {selectedEvidence.source} (Page 14)
                </div>
                "...based on our current projections, the <mark className="bg-emerald-500/30 text-emerald-200 px-1 rounded">CAC payback &gt; 24mo</mark> assumption holds true given the enterprise sales cycle length..."
              </div>
            </div>
            
            <Button className="w-full">
              Open Document Viewer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
