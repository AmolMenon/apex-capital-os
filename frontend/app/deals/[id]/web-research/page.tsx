"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Globe, Search, RefreshCw, Activity, ShieldCheck, HelpCircle } from "lucide-react"
import Link from "next/link"
import { 
  WebResearchModeBadge, 
  SourceQualityCard, 
  PublicDataConfidenceCard,
  ExtractedClaimsTable,
  EvidenceGraphPanel,
  UnknownMetricsGrid
} from "@/components/web-research/WebResearchComponents"
import { api } from "@/lib/api"

export default function WebResearchPage() {
  const params = useParams()
  const dealId = params.id as string
  const numericId = parseInt(dealId.replace("deal-", ""))
  
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const result = await api.getWebResearch(numericId)
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [numericId])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await api.runWebResearch(numericId)
      await fetchData()
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return <div className="p-8 max-w-7xl mx-auto flex justify-center"><RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" /></div>
  }

  if (!data) {
    return <div className="p-8 max-w-7xl mx-auto">No web research data available for this deal.</div>
  }

  const synthesis = data.vc_synthesis || {}

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/deals/${dealId}/deal-room`} className="text-sm text-muted-foreground flex items-center hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Deal Room
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{data.company_name} — Web Research</h1>
            <WebResearchModeBadge mode={data.research_mode} />
          </div>
          <p className="text-muted-foreground mt-1">VC-grade evaluation based on publicly available data and news.</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Run Fresh Research
        </Button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SourceQualityCard score={data.source_quality_score} />
        <PublicDataConfidenceCard confidence={data.public_data_confidence} />
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground uppercase font-bold">VC Benchmark Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground">{synthesis.vc_benchmark_conclusion || "Pending"}</div>
            <p className="text-xs text-muted-foreground mt-1">Based entirely on public sentiment and facts.</p>
          </CardContent>
        </Card>
      </div>

      {/* Synthesis Section */}
      <Card className="border-slate-300">
        <CardHeader className="bg-muted/20 border-b border-border/50">
          <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5"/> Public Market Synthesis</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-2">What Public Data Supports</h3>
              <p className="text-sm">{synthesis.what_public_data_supports}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-2">What Remains Unknown</h3>
              <p className="text-sm text-amber-700">{synthesis.what_remains_unknown}</p>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Hype vs Evidence</h3>
            <p className="text-sm">{synthesis.hype_vs_evidence}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Private Diligence Questions Generated</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {(synthesis.private_diligence_questions || []).map((q: string, i: number) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Missing/Private Metrics */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Unknown Private Metrics
        </h2>
        <p className="text-sm text-muted-foreground">These critical metrics could not be verified via public sources and require private diligence.</p>
        <UnknownMetricsGrid metrics={data.unknown_private_metrics} />
      </div>

      {/* Evidence Graph */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Evidence Graph
        </h2>
        <EvidenceGraphPanel evidence={data.evidence_graph} />
      </div>

      {/* Extracted Claims */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Extracted Claims
        </h2>
        <ExtractedClaimsTable claims={data.claims_extracted} />
      </div>

    </div>
  )
}
