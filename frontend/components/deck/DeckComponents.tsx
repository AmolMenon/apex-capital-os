"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, FileText, UploadCloud, XCircle, AlertCircle } from "lucide-react"

export function DeckQualityScoreCard({ title, score }: { title: string, score: number }) {
  let color = "text-red-500"
  if (score >= 85) color = "text-green-500"
  else if (score >= 70) color = "text-blue-500"
  else if (score >= 55) color = "text-yellow-500"
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${color}`}>{score}<span className="text-lg text-muted-foreground">/100</span></div>
        <Progress value={score} className="mt-3" />
      </CardContent>
    </Card>
  )
}

export function ClaimVerificationTable({ claims }: { claims: any[] }) {
  if (!claims || claims.length === 0) return <div className="text-sm text-muted-foreground p-4">No claims extracted.</div>
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Claim</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Evidence Level</TableHead>
          <TableHead>Diligence Question</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.map((claim, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium text-sm">{claim.claim_text}</TableCell>
            <TableCell><Badge variant="outline">{claim.claim_type}</Badge></TableCell>
            <TableCell>
              {claim.evidence_level === "Unsupported" ? (
                <Badge variant="destructive" className="flex items-center gap-1 w-fit"><XCircle className="w-3 h-3"/> Unsupported</Badge>
              ) : claim.evidence_level === "Weak" ? (
                <Badge variant="secondary" className="text-orange-500 border-orange-500/20 bg-orange-500/10">Weak</Badge>
              ) : (
                <Badge variant="secondary" className="text-green-500 border-green-500/20 bg-green-500/10">Medium/Strong</Badge>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{claim.diligence_question}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function MissingInfoTable({ missing }: { missing: any[] }) {
  if (!missing || missing.length === 0) return <div className="text-sm text-green-500 p-4 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> All critical investor information is present.</div>
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Missing Section</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Why It Matters</TableHead>
          <TableHead>Suggested Fix</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {missing.map((m, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium text-sm">{m.section_name}</TableCell>
            <TableCell>
              {m.severity === "Critical" ? (
                <Badge variant="destructive" className="flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3"/> Critical</Badge>
              ) : m.severity === "High" ? (
                <Badge variant="secondary" className="text-orange-500 border-orange-500/20 bg-orange-500/10">High</Badge>
              ) : (
                <Badge variant="outline">Medium</Badge>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{m.why_it_matters}</TableCell>
            <TableCell className="text-sm">{m.suggested_fix}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function ExtractedSectionCard({ section }: { section: any }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{section.section_type}</CardTitle>
        {section.investor_relevance === "High" && <Badge variant="secondary" className="bg-primary/10 text-primary">High Relevance</Badge>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{section.extracted_text}</p>
        <div className="text-xs bg-muted p-2 rounded flex items-start gap-2">
          <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>{section.quality_note}</span>
        </div>
      </CardContent>
    </Card>
  )
}
