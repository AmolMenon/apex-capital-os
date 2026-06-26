import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertTriangle, ShieldCheck, CircleHelp, CircleX, FileText, Activity, Link as LinkIcon, Database } from "lucide-react"

export function WebResearchModeBadge({ mode }: { mode: string }) {
  const colors: Record<string, string> = {
    mock: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400",
    search_api: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    llm_grounded: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
  }
  return <Badge variant="outline" className={colors[mode] || colors.mock}>Mode: {mode}</Badge>
}

export function SourceQualityCard({ score }: { score: number }) {
  let color = "text-green-600 dark:text-green-400"
  if (score < 70) color = "text-yellow-600 dark:text-yellow-400"
  if (score < 50) color = "text-red-600 dark:text-red-400"
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground uppercase font-bold">Source Quality Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-black ${color}`}>{score}/100</div>
        <p className="text-xs text-muted-foreground mt-1">Based on domain authority and official vs media sources.</p>
      </CardContent>
    </Card>
  )
}

export function PublicDataConfidenceCard({ confidence }: { confidence: string }) {
  let color = "text-green-600 dark:text-green-400 bg-green-500/10"
  if (confidence === "Medium") color = "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10"
  if (confidence === "Low") color = "text-red-600 dark:text-red-400 bg-red-500/10"
  
  return (
    <Card className={color}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase font-bold opacity-80">Public Data Confidence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold`}>{confidence}</div>
        <p className="text-xs opacity-70 mt-1">Reliability of the public footprint.</p>
      </CardContent>
    </Card>
  )
}

export function ExtractedClaimsTable({ claims }: { claims: any[] }) {
  if (!claims || claims.length === 0) return <div className="p-4 border rounded text-sm text-muted-foreground">No claims extracted.</div>
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Claim</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((c, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{c.claim_text}</TableCell>
              <TableCell><Badge variant="outline">{c.claim_type}</Badge></TableCell>
              <TableCell>
                <a href={c.source_url} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center gap-1 hover:underline">
                  {c.source_title} <LinkIcon className="w-3 h-3" />
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={c.confidence === "High" ? "default" : "secondary"}>{c.confidence}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function UnknownMetricsGrid({ metrics }: { metrics: any[] }) {
  if (!metrics || metrics.length === 0) return null
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <Card key={i} className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CircleHelp className="w-4 h-4 text-amber-500" />
              {m.metric}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <p className="text-xs text-amber-700 dark:text-amber-400/80">{m.diligence_required}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function EvidenceGraphPanel({ evidence }: { evidence: any[] }) {
  if (!evidence || evidence.length === 0) return <div className="text-sm text-muted-foreground p-4 border rounded">No evidence graph generated.</div>
  
  return (
    <div className="space-y-4">
      {evidence.map((e, i) => (
        <Card key={i} className="shadow-sm">
          <CardHeader className="py-3 bg-muted/20 border-b">
            <CardTitle className="text-base flex items-center justify-between">
              <span>{e.fact}</span>
              <Badge>{e.confidence} Confidence</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500"/> Supporting Sources</h4>
                <ul className="text-sm space-y-1">
                  {e.supporting_sources.map((s: any, idx: number) => (
                    <li key={idx}><a href={s.url} className="text-blue-600 hover:underline">{s.title}</a></li>
                  ))}
                </ul>
              </div>
              {e.conflicting_sources && e.conflicting_sources.length > 0 && (
                <div className="flex-1 border-l pl-6 border-red-200">
                  <h4 className="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Conflicting Sources</h4>
                  <ul className="text-sm space-y-1">
                    {e.conflicting_sources.map((s: any, idx: number) => (
                      <li key={idx}><a href={s.url} className="text-red-600 hover:underline">{s.title}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
