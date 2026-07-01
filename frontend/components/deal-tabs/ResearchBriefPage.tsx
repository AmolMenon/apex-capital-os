"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, ShieldAlert, Database, Search, Sparkles, Activity, TrendingUp } from "lucide-react"
import { 
  ResearchConfidenceBadge, 
  EvidenceGradeBadge, 
  TAMChart, 
  CustomerPersonaCard, 
  SourceRegistryTable 
} from "@/components/research/ResearchComponents"
import { EvaluateResearchButton } from "@/components/research/EvaluateResearchButton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/EmptyState"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { useGlobalDeal } from "@/components/GlobalDealProvider"

export default function ResearchBriefPage() {
  const { state, loading, simulateAutonomous } = useGlobalDeal();

  if (loading || !state) return <LoadingState />;

  const research = state.research;
  const deal = state.deal;

  if (!research || Object.keys(research).length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <EmptyState 
          title="Research Not Found" 
          description="Research brief has not been generated yet. The autonomous pipeline will generate this."
          icon={Search}
          primaryActionLabel="Run Autonomous Pipeline"
          onPrimaryAction={simulateAutonomous}
        />
      </div>
    )
  }

  const {
    market_research,
    competitor_research,
    customer_personas,
    pricing_research,
    gtm_research,
    tam_sam_som,
    evidence_grade,
    source_registry,
    research_gaps,
    research_backed_recommendation
  } = research;

  const aiMeta = market_research?._ai_metadata || competitor_research?._ai_metadata || customer_personas?._ai_metadata;

  return (
    <div className="space-y-12">
      <PageHelpBanner 
        title="Research Intelligence" 
        explanation="Apex Capital separates thesis quality from evidence quality. This page grades the startup's market claims against available data."
      />

      {aiMeta && (
        <div className="flex justify-end -mt-6">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5">
            {aiMeta.fallback_used ? (
              <AlertTriangle className="w-3 h-3 text-amber-500" />
            ) : (
              <Sparkles className="w-3 h-3 text-primary" />
            )}
            <span className="capitalize">{aiMeta.provider_used} Model</span>
            {aiMeta.fallback_used && <span className="text-amber-500 ml-1">(Fallback)</span>}
          </Badge>
        </div>
      )}
      
      {/* Evidence Stats Strip */}
      {evidence_grade && (
        <div className="flex gap-4 p-4 bg-muted/20 border rounded-lg">
          <div className="bg-card border rounded px-4 py-2 text-sm flex-1">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Evidence Score</div>
            <div className="font-mono font-bold text-xl">{evidence_grade.overall_score}/100</div>
          </div>
          <div className="bg-card border rounded px-4 py-2 text-sm flex-1">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Source Confidence</div>
            <div><ResearchConfidenceBadge level={evidence_grade.confidence_level} /></div>
          </div>
          <div className="bg-card border rounded px-4 py-2 text-sm flex-[2]">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Recommendation</div>
            <div className="font-semibold text-primary truncate" title={research_backed_recommendation}>{research_backed_recommendation}</div>
          </div>
        </div>
      )}

      {evidence_grade?.narrative_warning && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-bold">Analyst Warning: {evidence_grade.narrative_warning}</h4>
            <p className="text-sm mt-1">The provided narrative outpaces the verified evidence. Downgrading conviction until research gaps are closed.</p>
          </div>
        </div>
      )}

      {/* 1. Market & TAM */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Database className="h-5 w-5" /> Market Sizing & Attractiveness</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">TAM / SAM / SOM</CardTitle>
            </CardHeader>
            <CardContent>
              <TAMChart tam={tam_sam_som?.tam || 'Unknown'} sam={tam_sam_som?.sam || 'Unknown'} som={tam_sam_som?.som || 'Unknown'} />
              <div className="text-xs text-muted-foreground space-y-2 mt-4">
                <p><strong>TAM:</strong> {tam_sam_som?.tam || 'Unknown'}</p>
                <p><strong>SAM:</strong> {tam_sam_som?.sam || 'Unknown'}</p>
                <p><strong>SOM:</strong> {tam_sam_som?.som || 'Unknown'}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Market Dynamics</CardTitle>
                <Badge variant="secondary">{market_research.maturity}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Why Now Analysis</h4>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  {(market_research?.why_now_analysis || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Tailwinds</h4>
                  <ul className="list-disc pl-5 mt-2 text-sm text-green-500/80 space-y-1">
                    {(market_research?.drivers || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Headwinds</h4>
                  <ul className="list-disc pl-5 mt-2 text-sm text-red-500/80 space-y-1">
                    {(market_research?.constraints || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Customer Personas */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Customer Personas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(customer_personas || []).map((persona: any, i: number) => (
            <CustomerPersonaCard key={i} persona={persona} />
          ))}
        </div>
      </section>

      {/* 3. Competitors */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Competitive Intelligence</h2>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Threat Matrix</CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Intensity Score:</span>
                <span className="font-mono font-bold text-lg">{competitor_research?.competitive_intensity_score || 0}/100</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Competitor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Why Customers Choose Them</TableHead>
                  <TableHead>Why They Switch to Us</TableHead>
                  <TableHead>Threat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(competitor_research?.competitors || []).map((c: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-bold">{c.name}</TableCell>
                    <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.why_choose}</TableCell>
                    <TableCell className="text-foreground text-sm">{c.why_switch}</TableCell>
                    <TableCell><Badge variant={c.threat_level === 'Critical' ? 'destructive' : 'secondary'}>{c.threat_level}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6 bg-muted/20 p-4 rounded-lg space-y-2">
              <div><span className="font-semibold text-sm">White Space:</span> <span className="text-sm text-muted-foreground">{competitor_research?.white_space_analysis || 'N/A'}</span></div>
              <div><span className="font-semibold text-sm">Incumbent Risk:</span> <span className="text-sm text-muted-foreground">{competitor_research?.incumbent_response_risk || 'N/A'}</span></div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. GTM & Pricing */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>GTM Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Primary Motion</span>
              <span className="font-medium">{gtm_research?.primary_motion || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">First Wedge</span>
              <span className="font-medium text-right max-w-[200px]">{gtm_research?.first_wedge || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Sales Cycle</span>
              <span className="font-medium">{gtm_research?.sales_cycle_estimate || 'N/A'}</span>
            </div>
            <div className="pt-2">
              <span className="font-semibold block mb-1">Recommended Next 90 Days:</span>
              <span className="text-muted-foreground">{gtm_research?.next_90_days_proof || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Current vs Suggested</span>
              <span className="font-medium">{pricing_research?.current_model || 'N/A'} → {pricing_research?.suggested_model || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Margin Implication</span>
              <span className="font-medium text-right max-w-[200px]">{pricing_research?.gross_margin_implication || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Benchmark</span>
              <span className="font-mono">{pricing_research?.benchmark_pricing || 'N/A'}</span>
            </div>
            <div className="pt-2">
              <span className="font-semibold block mb-1">Pricing Risk:</span>
              <span className="text-destructive/80 font-medium">{pricing_research?.pricing_risk || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 5. Evidence Grading */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Evidence Grader</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Explanation</TableHead>
                  <TableHead>How to Validate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(evidence_grade?.categories || []).map((c: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{c.category}</TableCell>
                    <TableCell><EvidenceGradeBadge grade={c.grade} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.explanation}</TableCell>
                    <TableCell className="text-xs text-primary/80">{c.how_to_validate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dynamic Tracked Competitors */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" /> Active Competitor Tracking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-indigo-500/5 border-indigo-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-indigo-500">
                  <span className="flex items-center"><Search className="w-4 h-4 mr-2" /> Website Changes (30d)</span>
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="text-sm bg-background/80 p-3 rounded border border-border/50">
                    <span className="font-bold">Competitor A</span> completely revamped their pricing page. Removed "freemium" tier.
                 </div>
                 <div className="text-sm bg-background/80 p-3 rounded border border-border/50">
                    <span className="font-bold">Competitor B</span> updated their hero messaging to focus on "Enterprise AI" instead of "Workflow Automation".
                 </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-emerald-500">
                  <span className="flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> Hiring Velocity</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="text-sm bg-background/80 p-3 rounded border border-border/50">
                    <span className="font-bold">Competitor A</span> opened 15 new roles in Sales, indicating a shift towards enterprise GTM.
                 </div>
                 <div className="text-sm bg-background/80 p-3 rounded border border-border/50">
                    <span className="font-bold">Competitor B</span> hiring slowed by 40% QoQ. Key engineering leaders departed.
                 </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between text-amber-500">
                  <span className="flex items-center"><Sparkles className="w-4 h-4 mr-2" /> Feature Releases</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Live</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <div className="text-sm bg-background/80 p-3 rounded border border-border/50">
                    <span className="font-bold">Competitor A</span> launched SOC2 compliance and SSO, closing the gap for enterprise readiness.
                 </div>
                 <div className="text-sm bg-background/80 p-3 rounded border border-border/50">
                    <span className="font-bold">Competitor B</span> shipped an AI copilot feature (beta). Sentiment on Twitter is mixed.
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Source Registry & Gaps */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Source Registry</CardTitle>
            <CardDescription>Lineage of truth for all data points.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <SourceRegistryTable sources={source_registry} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Research Gaps</CardTitle>
            <CardDescription>What we don't know.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(research_gaps || []).map((gap: string, i: number) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-6" />
            <div>
              <h4 className="font-bold text-sm mb-2">Research-Backed Conclusion:</h4>
              <p className="text-sm font-medium text-primary">{research_backed_recommendation}</p>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  )
}
