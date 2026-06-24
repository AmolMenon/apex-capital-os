"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, HelpCircle, CheckCircle, Clock, AlertTriangle, FileText, FileSearch, UserCheck, MessageSquare, Phone, Activity } from "lucide-react"

export function DiligenceStatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
  if (status === "Not Started") variant = "secondary"
  else if (status === "In Progress" || status === "Under Review") variant = "default"
  else if (status === "Blocked" || status === "Missing" || status === "Insufficient") variant = "destructive"
  else if (status === "Complete" || status === "Verified" || status === "Resolved") variant = "default"
  else if (status === "Requested") variant = "outline"
  
  return <Badge variant={variant}>{status}</Badge>
}

export function ICReadinessCard({ score, verdict, blockers, nextAction }: { score: number, verdict: string, blockers: string[], nextAction: string }) {
  const isReady = score >= 85
  const colorClass = isReady ? "text-green-500" : score >= 70 ? "text-yellow-500" : "text-destructive"

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isReady ? <ShieldCheck className="h-5 w-5 text-green-500" /> : <ShieldAlert className="h-5 w-5 text-destructive" />}
          IC Readiness Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="text-center">
            <div className={`text-6xl font-black ${colorClass}`}>{score}</div>
            <div className="text-sm font-medium mt-2">{verdict}</div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">Blockers</h4>
              {blockers.length > 0 ? (
                <ul className="space-y-1">
                  {blockers.map((b, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> No blockers
                </div>
              )}
            </div>
            <div className="bg-muted/50 p-3 rounded border">
              <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Next Best Action</h4>
              <p className="text-sm">{nextAction}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DiligenceTaskTable({ tasks, dealId }: { tasks: any[], dealId: number }) {
  const [localTasks, setLocalTasks] = useState(tasks)

  const updateStatus = async (taskId: string, newStatus: string) => {
    setLocalTasks(localTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    await fetch(`http://127.0.0.1:8000/diligence/${dealId}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Priority Diligence Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {localTasks.map((t) => (
            <div key={t.id} className="border p-4 rounded-lg bg-card space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-2 items-center mb-1">
                    <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    <Badge variant={t.priority === 'Critical' ? 'destructive' : 'secondary'} className="text-[10px]">{t.priority} Priority</Badge>
                  </div>
                  <h4 className="font-bold">{t.task}</h4>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select 
                    className="text-xs bg-background border rounded px-2 py-1"
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value)}
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Blocked</option>
                    <option>Complete</option>
                  </select>
                  <DiligenceStatusBadge status={t.status} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                <div><span className="text-muted-foreground">Objective:</span> {t.objective}</div>
                <div><span className="text-muted-foreground">Evidence Required:</span> {t.evidence_required}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ClaimVerificationTable({ claims }: { claims: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileSearch className="h-4 w-4 text-primary" /> Claim Verification</CardTitle>
        <CardDescription>Statements extracted from the deck requiring validation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {claims.map((c) => (
            <div key={c.id} className="border-l-2 border-l-destructive pl-4 py-2 space-y-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline">{c.claim_type}</Badge>
                <Badge variant="destructive">Evidence: {c.current_evidence_level}</Badge>
              </div>
              <p className="font-medium text-sm italic">"{c.claim_text}"</p>
              <div className="text-xs space-y-1">
                <div><span className="text-muted-foreground">Required Evidence:</span> {c.evidence_required}</div>
                <div><span className="text-muted-foreground">Founder Q:</span> {c.founder_question}</div>
                {c.customer_question && <div><span className="text-muted-foreground">Customer Q:</span> {c.customer_question}</div>}
              </div>
            </div>
          ))}
          {claims.length === 0 && <p className="text-sm text-muted-foreground">No critical unverified claims.</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function EvidenceTrackerTable({ items, dealId }: { items: any[], dealId: number }) {
  const [localItems, setLocalItems] = useState(items)

  const updateStatus = async (itemId: string, newStatus: string) => {
    setLocalItems(localItems.map(i => i.id === itemId ? { ...i, verification_status: newStatus } : i))
    await fetch(`http://127.0.0.1:8000/diligence/${dealId}/evidence/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Evidence Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Evidence Item</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Impact</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {localItems.map((item) => (
                <tr key={item.id} className="bg-card hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{item.evidence_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.evidence_type}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{item.impact_on_recommendation}</Badge></td>
                  <td className="px-4 py-3">
                    <select 
                      className="text-xs bg-background border rounded px-2 py-1"
                      value={item.verification_status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                    >
                      <option>Missing</option>
                      <option>Requested</option>
                      <option>Received</option>
                      <option>Verified</option>
                      <option>Insufficient</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function FounderFollowupCards({ followups }: { followups: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Founder Follow-ups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {followups.map((f) => (
            <div key={f.id} className="bg-primary/5 border border-primary/10 p-4 rounded-lg">
              <Badge variant="outline" className="mb-2 bg-background">{f.category}</Badge>
              <h4 className="font-semibold text-sm mb-2">{f.question}</h4>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Why it matters:</span> {f.why_it_matters}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function CustomerReferenceCards({ references }: { references: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> Customer Reference Call Script</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {references.map((r) => (
            <div key={r.id} className="border p-4 rounded-lg">
              <Badge variant="secondary" className="mb-2">{r.category}</Badge>
              <h4 className="font-semibold text-sm mb-2">{r.question}</h4>
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Listen for:</span> {r.what_to_listen_for}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DataRoomRequestTable({ requests }: { requests: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Data Room Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="flex justify-between items-center border-b pb-2 last:border-0">
              <div>
                <div className="font-medium text-sm">{r.document_requested}</div>
                <div className="text-xs text-muted-foreground">{r.why_it_matters}</div>
              </div>
              <Badge variant={r.priority === 'Critical' ? 'destructive' : 'outline'}>{r.priority}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RiskResolutionTable({ risks, dealId }: { risks: any[], dealId: number }) {
  const [localRisks, setLocalRisks] = useState(risks)

  const updateStatus = async (riskId: string, newStatus: string) => {
    setLocalRisks(localRisks.map(r => r.id === riskId ? { ...r, current_status: newStatus } : r))
    await fetch(`http://127.0.0.1:8000/diligence/${dealId}/risks/${riskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Risk Resolution Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {localRisks.map((r) => (
            <div key={r.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">{r.risk_name}</h4>
                <select 
                  className="text-xs bg-background border rounded px-2 py-1 ml-2"
                  value={r.current_status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                >
                  <option>Open</option>
                  <option>Under Review</option>
                  <option>Evidence Requested</option>
                  <option>Partially Resolved</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3">
                <div><span className="text-muted-foreground">Action:</span> {r.diligence_action}</div>
                <div><span className="text-muted-foreground">Resolution Cond:</span> {r.resolution_condition}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ConversationContradictionsTable({ contradictions }: { contradictions: any[] }) {
  if (!contradictions || contradictions.length === 0) return null

  return (
    <Card className="border-red-900/30 bg-red-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-500"><AlertTriangle className="h-4 w-4" /> Conversation-Derived Diligence</CardTitle>
        <CardDescription className="text-red-400">Contradictions identified between pitch deck and founder interviews requiring immediate resolution.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contradictions.map((c: any, i: number) => (
            <div key={i} className="border border-red-900/30 p-4 rounded-lg bg-red-950/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm text-red-400">{c.contradiction_title}</h4>
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">{c.severity} Severity</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs mt-3 bg-background/50 p-2 rounded">
                <div><span className="text-muted-foreground uppercase font-bold text-[10px]">Source A:</span> <span className="text-foreground">{c.source_A}</span></div>
                <div><span className="text-muted-foreground uppercase font-bold text-[10px]">Source B:</span> <span className="text-foreground">{c.source_B}</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3">
                <div><span className="text-muted-foreground block mb-1">Impact:</span> {c.decision_impact}</div>
                <div><span className="text-muted-foreground block mb-1">Required Action:</span> <span className="text-foreground font-medium">{c.recommended_diligence_action}</span></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ICDecisionLogCard({ dealId, onLogSubmit }: { dealId: number, onLogSubmit: () => void }) {
  const [decision, setDecision] = useState("More Diligence")
  const [rationale, setRationale] = useState("")

  const submitLog = async () => {
    await fetch(`http://127.0.0.1:8000/deals/${dealId}/ic-decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision, rationale, conditions: "", concerns: "", next_step: ""
      })
    })
    onLogSubmit()
  }

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-primary" /> IC Decision Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground">Verdict</label>
            <select className="w-full mt-1 bg-background border p-2 rounded text-sm" value={decision} onChange={e=>setDecision(e.target.value)}>
              <option>Invest</option>
              <option>More Diligence</option>
              <option>Watchlist</option>
              <option>Pass</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-muted-foreground">Rationale</label>
            <textarea 
              className="w-full mt-1 bg-background border p-2 rounded text-sm h-24" 
              placeholder="Why this decision..."
              value={rationale}
              onChange={e=>setRationale(e.target.value)}
            />
          </div>
          <Button onClick={submitLog} className="w-full">Log IC Decision</Button>
        </div>
      </CardContent>
    </Card>
  )
}
