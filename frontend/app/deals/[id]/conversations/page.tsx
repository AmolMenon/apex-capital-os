"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { motion } from "framer-motion"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Search, 
  ThumbsUp, 
  ThumbsDown,
  BrainCircuit,
  MessageCircleQuestion,
  Lightbulb,
  FileText,
  User,
  Activity
} from "lucide-react"
import { ExplanationPopover } from "@/components/ui/ExplanationPopover"

export default function ConversationsPage() {
  const params = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.getConversationIntelligence(params.id as string)
        setData(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <BrainCircuit className="h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">Synthesizing conversation intelligence...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <Card className="border-destructive/20 bg-destructive/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p>Failed to load conversation data.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-[1200px] pb-12">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            Conversation Intelligence
          </h1>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-sm py-1">
              Score: {data.overall_conversation_score}/100
            </Badge>
            <Badge variant="outline" className="bg-muted text-muted-foreground text-sm py-1">
              {data.conversation_rounds?.length || 0} Rounds Parsed
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          AI synthesis of all founder-investor communications. Extracts evidence, identifies contradictions, and assesses founder response quality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Context Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1: Conversation Summary */}
          <Card className="shadow-sm border-t-4 border-t-primary">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-lg text-foreground">1. Conversation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-foreground leading-relaxed text-sm">
                {data.summary}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                <div>
                  <ExplanationPopover title="Credibility" explanation="Measures consistency with market facts and absence of exaggerated claims.">
                    <div className="text-xs text-muted-foreground uppercase cursor-help mb-1">Credibility</div>
                  </ExplanationPopover>
                  <div className="text-2xl font-bold text-foreground">{data.credibility_score}/100</div>
                </div>
                <div>
                  <ExplanationPopover title="Responsiveness" explanation="Measures directness in answering hard questions vs. evading or deflecting.">
                    <div className="text-xs text-muted-foreground uppercase cursor-help mb-1">Responsiveness</div>
                  </ExplanationPopover>
                  <div className="text-2xl font-bold text-foreground">{data.responsiveness_score}/100</div>
                </div>
                <div>
                  <ExplanationPopover title="Contradiction Risk" explanation="High score means the founder contradicted earlier statements or pitch deck claims.">
                    <div className="text-xs text-muted-foreground uppercase cursor-help mb-1">Contradiction Risk</div>
                  </ExplanationPopover>
                  <div className={`text-2xl font-bold ${data.contradiction_risk_score > 50 ? 'text-destructive' : 'text-foreground'}`}>{data.contradiction_risk_score}/100</div>
                </div>
                <div>
                  <ExplanationPopover title="Open Follow-ups" explanation="Critical items the founder promised to get back to us on.">
                    <div className="text-xs text-muted-foreground uppercase cursor-help mb-1">Open Follow-ups</div>
                  </ExplanationPopover>
                  <div className="text-2xl font-bold text-foreground">{data.open_followups?.length || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Contradiction Review */}
          <Card className="shadow-sm border-t-4 border-t-destructive">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                2. Contradiction Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {data.contradictions?.length > 0 ? (
                data.contradictions.map((c: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <h4 className="font-semibold text-foreground mb-3">{c.contradiction_title}</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded bg-background border">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Source A</span>
                        <p className="text-sm text-foreground mt-1">{c.source_A}</p>
                      </div>
                      <div className="p-3 rounded bg-background border">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Source B</span>
                        <p className="text-sm text-foreground mt-1">{c.source_B}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-background rounded border text-sm">
                        <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Why It Matters</span>
                        <p className="text-foreground">{c.why_it_matters}</p>
                      </div>
                      <div className="p-3 bg-background rounded border text-sm">
                        <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">Required Diligence Action</span>
                        <p className="text-foreground">{c.recommended_diligence_action}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm mt-4">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">{c.severity} Severity</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No contradictions found.</p>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Founder Response Quality */}
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-lg text-foreground">3. Founder Response Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {data.scorecard && Object.entries(data.scorecard).slice(0, 4).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-muted-foreground font-mono">{String(value)}/100</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${Number(value) > 80 ? 'bg-emerald-500' : Number(value) > 60 ? 'bg-primary' : 'bg-amber-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {data.scorecard && Object.entries(data.scorecard).slice(4).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-muted-foreground font-mono">{String(value)}/100</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${Number(value) > 80 ? 'bg-emerald-500' : Number(value) > 60 ? 'bg-primary' : 'bg-amber-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t">
                <div className="bg-emerald-500/5 p-4 rounded border border-emerald-500/20">
                  <span className="text-xs text-emerald-600 uppercase font-bold flex items-center gap-2 mb-2"><ThumbsUp className="h-4 w-4"/> Strongest Answers</span>
                  <ul className="text-sm text-foreground list-disc pl-4 space-y-1">
                    {data.founder_analysis?.strongest_answers?.map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div className="bg-destructive/5 p-4 rounded border border-destructive/20">
                  <span className="text-xs text-destructive uppercase font-bold flex items-center gap-2 mb-2"><ThumbsDown className="h-4 w-4"/> Weakest Answers</span>
                  <ul className="text-sm text-foreground list-disc pl-4 space-y-1">
                    {data.founder_analysis?.weakest_answers?.map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Investor Questions Tracker */}
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <MessageCircleQuestion className="h-5 w-5 text-purple-500" />
                4. Investor Questions Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {data.investor_questions?.map((q: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg bg-background border">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-foreground text-sm">Q: {q.question_text}</p>
                    <Badge variant="outline" className="bg-muted text-muted-foreground whitespace-nowrap ml-2">
                      {q.category} • {q.importance}
                    </Badge>
                  </div>
                  <div className="pl-4 border-l-2 border-primary mt-3">
                    <p className="text-sm text-foreground">A: {q.linked_answer}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-xs">
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Status: {q.answered_status}
                    </Badge>
                    <Badge variant="outline" className={
                      q.answer_quality === 'Strong' ? 'text-emerald-600 border-emerald-500/30 bg-emerald-500/5' :
                      q.answer_quality === 'Evasive' ? 'text-destructive border-destructive/30 bg-destructive/5' :
                      'text-amber-600 border-amber-500/30 bg-amber-500/5'
                    }>
                      {q.answer_quality} Response
                    </Badge>
                    {q.followup_required && (
                      <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/5">
                        Follow-up Required
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">

          {/* Section 5: Decision Impact */}
          <Card className="shadow-sm border-t-4 border-t-emerald-500">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                5. Decision Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 text-sm">
              <div className="p-3 bg-background rounded border">
                <span className="block text-muted-foreground mb-1">Recommendation Adjustment</span>
                <span className={`font-bold text-lg ${data.decision_impact?.recommendation_adjustment === 'Downgrade' ? 'text-destructive' : 'text-foreground'}`}>
                  {data.decision_impact?.recommendation_adjustment}
                </span>
              </div>
              <div className="space-y-3 text-foreground">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-medium">Evidence Score Impact</span>
                  <span className="font-semibold">{data.decision_impact?.evidence_score_impact}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-medium">IC Readiness Impact</span>
                  <span className="font-semibold">{data.decision_impact?.ic_readiness_impact}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground font-medium">Confidence Impact</span>
                  <span className="font-semibold">{data.decision_impact?.confidence_impact}</span>
                </div>
              </div>
              
              <div className="p-3 bg-muted/30 rounded border mt-4 text-sm">
                <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">Final Explanation</span>
                <p className="text-foreground">{data.decision_impact?.final_explanation}</p>
              </div>

              {data.decision_impact?.decision_gates_triggered?.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-muted-foreground uppercase font-bold block mb-2">Gates Triggered</span>
                  <div className="flex flex-wrap gap-2">
                    {data.decision_impact.decision_gates_triggered.map((g: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-destructive/5 text-destructive border-destructive/20">{g}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 6: Follow-Up Tracker */}
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                6. Follow-Up Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {data.open_followups?.length > 0 ? (
                <div className="space-y-3">
                  {data.open_followups.map((f: any, idx: number) => (
                    <div key={idx} className="p-3 bg-background rounded border text-sm">
                      <span className="font-semibold text-foreground block mb-2">{f.followup_item}</span>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                        <span>Owner: {f.promised_by}</span>
                        <Badge variant="secondary">{f.status}</Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-xs text-muted-foreground uppercase font-bold block mb-1">Impact if Unresolved</span>
                        <p className="text-foreground text-xs">{f.impact_if_unresolved}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No open follow-ups.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Section 7: Evidence Extracted */}
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                7. Evidence Extracted
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {data.evidence_extracted?.length > 0 ? (
                data.evidence_extracted.map((e: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-background border flex flex-col gap-2">
                    <h4 className="font-medium text-sm text-foreground leading-snug">{e.evidence_text}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge variant="outline" className={e.supports_or_weakens === 'Supports' ? 'text-emerald-600 border-emerald-500/30' : 'text-destructive border-destructive/30'}>
                        {e.supports_or_weakens} Case
                      </Badge>
                      <Badge variant="secondary">
                        {e.verification_status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No new evidence extracted from conversations.</p>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}
