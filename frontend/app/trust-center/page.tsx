"use client"
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Server, AlertCircle, FileCheck, CheckCircle, CircleX } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TrustCenterPage() {
  const [status, setStatus] = useState<any>(null)
  const [scores, setScores] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [gates, setGates] = useState<any[]>([])
  const [provenance, setProvenance] = useState<any[]>([])

  useEffect(() => {
    api.getTrustStatus().then(setStatus).catch(console.error)
    api.getTrustScores().then(res => setScores(res.scores)).catch(console.error)
    api.getClaims().then(res => setClaims(res.claims)).catch(console.error)
    api.getGates().then(res => setGates(res.gates)).catch(console.error)
    api.getProvenance().then(res => setProvenance(res.provenance)).catch(console.error)
  }, [])

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><ShieldCheck className="text-emerald-500 w-8 h-8"/> Trust Center</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Enterprise-grade observability, claim auditing, and deterministic gating. We don't hide behind black boxes. Every claim, assumption, and generated output is audited here.</p>
        </div>
        <Link href="/trust-center/review-queue">
          <Button variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">Open Human Review Queue</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-t-4 border-t-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> {status ? status.trust_audit_status : '...'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Global Audit State</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Claims Audited</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground flex items-center gap-2">
               <FileCheck className="w-5 h-5 text-blue-500" /> {status ? status.claims_audited : '...'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Facts & assumptions verified</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Gate Failures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500 flex items-center gap-2">
               <AlertCircle className="w-5 h-5" /> {status ? status.gate_failures : '...'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Outputs blocked by determinism</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-indigo-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Review Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
               <Server className="w-5 h-5" /> {status ? status.review_queue_count : '...'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting Partner sign-off</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="claims" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="claims">Claim Audits</TabsTrigger>
          <TabsTrigger value="gates">Deterministic Gates</TabsTrigger>
          <TabsTrigger value="scores">Trust Scores</TabsTrigger>
          <TabsTrigger value="provenance">Data Provenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="claims" className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Fact & Assumption Audits</h2>
          <div className="bg-white dark:bg-neutral-900 border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3">Claim Text</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {claims.map((c, i) => (
                  <tr key={i} className="bg-white dark:bg-neutral-900 hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium text-foreground">{c.claim_text}</td>
                    <td className="px-6 py-4"><Badge variant="outline">{c.claim_type}</Badge></td>
                    <td className="px-6 py-4 text-muted-foreground">{c.source}</td>
                    <td className="px-6 py-4">
                      {c.verification_status.includes("Verified") ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4"/> {c.verification_status}</span>
                      ) : (
                        <span className="text-amber-600 font-medium flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {c.verification_status}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={c.risk_if_wrong === 'High' ? 'destructive' : 'secondary'}>{c.risk_if_wrong}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="gates" className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Deterministic Gate Failures</h2>
          <div className="bg-white dark:bg-neutral-900 border rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3">Gate Name</th>
                  <th className="px-6 py-3">Result</th>
                  <th className="px-6 py-3">Affected Output</th>
                  <th className="px-6 py-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {gates.map((g, i) => (
                  <tr key={i} className="bg-white dark:bg-neutral-900 hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium text-foreground">{g.gate_name}</td>
                    <td className="px-6 py-4">
                      {g.result === "Passed" ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Passed</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{g.affected_output}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={g.reason}>{g.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="scores" className="space-y-4">
           <h2 className="text-xl font-bold mb-4">Entity Trust Scores</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {scores.map((s, i) => (
               <Card key={i} className="shadow-sm">
                 <CardHeader className="border-b pb-4 bg-muted/10">
                   <div className="flex justify-between items-start">
                     <div>
                       <CardTitle className="text-lg">{s.entity_id}</CardTitle>
                       <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.entity_type}</p>
                     </div>
                     <div className="text-center">
                       <span className={`text-3xl font-black ${s.overall_trust_score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{s.overall_trust_score}</span>
                       <span className="block text-[10px] text-muted-foreground font-bold uppercase">Score</span>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent className="pt-4 space-y-4">
                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                       <span className="block text-muted-foreground mb-1">Evidence Quality</span>
                       <span className="font-semibold">{s.evidence_quality_score}/100</span>
                     </div>
                     <div>
                       <span className="block text-muted-foreground mb-1">Grounding Score</span>
                       <span className="font-semibold">{s.grounding_score}/100</span>
                     </div>
                   </div>
                   <div className="pt-4 border-t">
                     <span className="block text-xs font-semibold text-muted-foreground uppercase mb-2">Reasons</span>
                     <ul className="list-disc pl-4 space-y-1 text-sm">
                       {s.reasons.map((r: string, idx: number) => <li key={idx} className="text-foreground">{r}</li>)}
                     </ul>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </TabsContent>

        <TabsContent value="provenance" className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Data Provenance Trace</h2>
          <div className="space-y-4">
            {provenance.map((p, i) => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{p.output_id}</h3>
                      <p className="text-sm text-muted-foreground">Context: {p.context}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Badge variant="outline" className="mr-2">Model: {p.model_provider_used}</Badge>
                      <Badge variant="outline">Prompt: {p.prompt_version}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Sources Used</h4>
                      <ul className="list-disc pl-4 text-sm space-y-1">
                        {p.source_inputs_used.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Deterministic Rules Applied</h4>
                      <ul className="list-disc pl-4 text-sm space-y-1">
                        {p.deterministic_rules_applied.map((r: string, idx: number) => <li key={idx}>{r}</li>)}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
