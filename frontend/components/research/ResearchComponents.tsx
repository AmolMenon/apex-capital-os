import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, Database, Search, Users, Activity, BarChart, ShieldAlert } from "lucide-react"

export function ResearchConfidenceBadge({ level }: { level: string }) {
  const variant = level === 'High' ? 'default' : level === 'Medium' ? 'secondary' : 'destructive'
  return <Badge variant={variant}>{level} Confidence</Badge>
}

export function EvidenceGradeBadge({ grade }: { grade: string }) {
  const colorMap: Record<string, string> = {
    'A': 'bg-green-500/10 text-green-500 border-green-500/20',
    'B': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'C': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'D': 'bg-red-500/10 text-red-500 border-red-500/20',
    'Unknown': 'bg-muted text-muted-foreground',
  }
  return <span className={`px-2 py-1 rounded border text-xs font-bold ${colorMap[grade] || colorMap['Unknown']}`}>{grade}</span>
}

export function TAMChart({ tam, sam, som }: { tam: string, sam: string, som: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 relative">
      <div className="w-64 h-64 rounded-full border-4 border-muted flex items-center justify-center relative bg-muted/5">
        <div className="absolute -top-6 text-sm text-muted-foreground font-mono">TAM: {tam.split(' ')[0]}</div>
        
        <div className="w-48 h-48 rounded-full border-4 border-primary/20 flex items-center justify-center relative bg-primary/5">
          <div className="absolute -top-6 text-sm text-primary/70 font-mono">SAM: {sam.split(' ')[0]}</div>
          
          <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center relative bg-primary/20 shadow-lg shadow-primary/20">
            <div className="text-center">
              <div className="text-sm text-primary font-bold font-mono">{som.split(' ')[0]}</div>
              <div className="text-[10px] text-primary/70 font-semibold uppercase tracking-wider">SOM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CustomerPersonaCard({ persona }: { persona: any }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Users className="h-4 w-4"/> {persona.role}</div>
        <CardTitle className="text-lg">{persona.name}</CardTitle>
        <div className="text-sm font-medium">{persona.company_type}</div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 text-sm">
        <div>
          <span className="font-semibold text-foreground/80">Pain Points:</span>
          <ul className="list-disc pl-4 mt-1 text-muted-foreground">
            {persona.pain_points.map((p: string, i: number) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div><span className="font-semibold text-foreground/80">Current Workaround:</span> <span className="text-muted-foreground">{persona.current_workaround}</span></div>
        <div><span className="font-semibold text-foreground/80">WTP:</span> <span className="text-primary font-medium">{persona.willingness_to_pay}</span></div>
        <div><span className="font-semibold text-foreground/80">Trigger:</span> <span className="text-muted-foreground">{persona.buying_trigger}</span></div>
        <div className="flex gap-4 pt-2 border-t">
          <div className="flex-1"><span className="text-green-500 font-semibold text-xs uppercase tracking-wider">Why Adopt</span><p className="text-muted-foreground text-xs mt-1">{persona.why_adopt}</p></div>
          <div className="flex-1"><span className="text-red-500 font-semibold text-xs uppercase tracking-wider">Why Not</span><p className="text-muted-foreground text-xs mt-1">{persona.why_not_adopt}</p></div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SourceRegistryTable({ sources }: { sources: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Module</TableHead>
          <TableHead>Source Type</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((s, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{s.module}</TableCell>
            <TableCell className="text-muted-foreground"><div className="flex items-center gap-2"><Database className="h-3 w-3"/>{s.source_type}</div></TableCell>
            <TableCell><ResearchConfidenceBadge level={s.confidence} /></TableCell>
            <TableCell>
              {s.verification_status === 'Verified' ? <Badge variant="outline" className="text-green-500 border-green-500/30"><CheckCircle className="mr-1 h-3 w-3"/> Verified</Badge> :
               s.verification_status === 'Unverified' ? <Badge variant="outline" className="text-red-500 border-red-500/30"><AlertCircle className="mr-1 h-3 w-3"/> Unverified</Badge> :
               <Badge variant="outline" className="text-yellow-500 border-yellow-500/30"><Search className="mr-1 h-3 w-3"/> {s.verification_status}</Badge>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
