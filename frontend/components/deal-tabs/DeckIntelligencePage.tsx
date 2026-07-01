"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, AlertTriangle, Sparkles } from "lucide-react"
import { 
  DeckQualityScoreCard, 
  ClaimVerificationTable, 
  MissingInfoTable, 
  ExtractedSectionCard 
} from "@/components/deck/DeckComponents"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"
import { useGlobalDeal } from "@/components/GlobalDealProvider"
import { LoadingState } from "@/components/ui/LoadingState"
import { EmptyState } from "@/components/ui/EmptyState"

export default function DeckIntelligencePage() {
  const { state, loading } = useGlobalDeal()

  if (loading || !state) {
    return <LoadingState message="Extracting claims from Pitch Deck..." />
  }

  const deckAnalysis = state.deck

  if (!deckAnalysis || Object.keys(deckAnalysis).length === 0) {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <EmptyState 
          title="Pitch Deck Not Found"
          description="The autonomous agent could not locate a pitch deck in the data room. Once uploaded, the AI will automatically parse metrics and claims."
          primaryActionLabel="Upload to Data Room"
          onPrimaryAction={() => {}}
        />
      </div>
    )
  }

  const aiMeta = deckAnalysis._ai_metadata;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pitch Deck Intelligence</h2>
          <p className="text-muted-foreground">Automated parsing of claims, metrics, and narrative.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {aiMeta && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1.5">
              {aiMeta.fallback_used ? (
                <AlertTriangle className="w-3 h-3 text-amber-500" />
              ) : (
                <Sparkles className="w-3 h-3 text-primary" />
              )}
              <span className="capitalize">{aiMeta.provider_used} Model</span>
              {aiMeta.fallback_used && <span className="text-amber-500 ml-1">(Fallback)</span>}
            </Badge>
          )}
        </div>
      </div>

      <PageHelpBanner 
        title="Deck Intelligence" 
        explanation="This tool parses the pitch deck, extracts key claims, and checks for missing information before you write the memo."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DeckQualityScoreCard title="Deck Quality Score" score={deckAnalysis.deck_quality_score} />
        <DeckQualityScoreCard title="Investor Readiness" score={deckAnalysis.investor_readiness_score} />
        <DeckQualityScoreCard title="Evidence Strength" score={deckAnalysis.readiness_breakdown?.evidence_strength_score || 0} />
        <DeckQualityScoreCard title="Narrative Clarity" score={deckAnalysis.readiness_breakdown?.narrative_clarity_score || 0} />
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2">Deck Summary</h3>
          <p className="text-sm leading-relaxed">{deckAnalysis.deck_summary}</p>
          
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-sm font-medium">Verdict:</span>
            <span className="font-bold text-primary">{deckAnalysis.readiness_breakdown?.verdict}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="claims" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="claims">Extracted Claims</TabsTrigger>
          <TabsTrigger value="missing">Missing Info</TabsTrigger>
          <TabsTrigger value="sections">Parsed Sections</TabsTrigger>
          <TabsTrigger value="data">Traction & Financials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="claims" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Deck Claims & Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <ClaimVerificationTable claims={deckAnalysis.key_claims} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="missing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Missing Investor-Critical Information</CardTitle>
            </CardHeader>
            <CardContent>
              <MissingInfoTable missing={deckAnalysis.missing_sections} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sections" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deckAnalysis.extracted_sections.map((sec: any, i: number) => (
              <ExtractedSectionCard key={i} section={sec} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traction & Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted-foreground">ARR / Revenue</div>
                <div className="font-semibold mt-1">{deckAnalysis.traction?.arr || deckAnalysis.traction?.revenue || "Not Found"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Customers</div>
                <div className="font-semibold mt-1">{deckAnalysis.traction?.customers || "Not Found"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Retention</div>
                <div className="font-semibold mt-1">{deckAnalysis.traction?.retention || "Not Found"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">CAC</div>
                <div className="font-semibold mt-1">{deckAnalysis.traction?.cac || "Not Found"}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Financials & Ask</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Fundraising Ask</div>
                <div className="font-semibold mt-1">{deckAnalysis.financials?.fundraising_ask || "Not Found"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Burn Rate</div>
                <div className="font-semibold mt-1 text-red-500">{deckAnalysis.financials?.burn_rate || "Unknown"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Runway</div>
                <div className="font-semibold mt-1">{deckAnalysis.financials?.runway || "Unknown"}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-rose-500/20 bg-rose-500/5">
            <CardHeader>
              <CardTitle className="text-rose-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5"/> Identified Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {deckAnalysis.risks?.map((risk: any, i: number) => (
                  <li key={i} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="font-medium flex items-center gap-2">
                      {risk.risk}
                      <Badge variant="destructive" className="text-[10px] uppercase tracking-wider">{risk.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{risk.explanation}</p>
                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3 rotate-180"/> Action: {risk.diligence_action}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
