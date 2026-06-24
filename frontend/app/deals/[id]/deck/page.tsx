"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, PlayCircle, PlusCircle, CheckCircle, AlertTriangle, Sparkles } from "lucide-react"
import { 
  DeckQualityScoreCard, 
  ClaimVerificationTable, 
  MissingInfoTable, 
  ExtractedSectionCard 
} from "@/components/deck/DeckComponents"
import { PageHelpBanner } from "@/components/ui/PageHelpBanner"

export default function DeckIntelligencePage() {
  const params = useParams()
  const router = useRouter()
  const [dealId, setDealId] = useState<string | null>(null)
  
  const [deckAnalysis, setDeckAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [rawText, setRawText] = useState("")
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (params.id) {
      setDealId(params.id as string)
      fetchDeckAnalysis(params.id as string)
    }
  }, [params.id])

  const fetchDeckAnalysis = async (id: string) => {
    try {
      const res = await fetch(`${"http://127.0.0.1:8000"}/decks/${id}`)
      if (res.ok) {
        const data = await res.json()
        setDeckAnalysis(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!rawText.trim()) return
    setAnalyzing(true)
    try {
      const res = await fetch(`${"http://127.0.0.1:8000"}/decks/analyze/${dealId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deck_name: "Pasted Deck",
          raw_text: rawText
        })
      })
      if (res.ok) {
        const data = await res.json()
        setDeckAnalysis(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  const applyToDeal = async () => {
    try {
      await fetch(`${"http://127.0.0.1:8000"}/decks/${dealId}/apply-to-deal`, {
        method: "PATCH"
      })
      alert("Deck metrics applied to deal profile!")
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="p-8 flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> Loading deck intelligence...</div>
  }

  const aiMeta = deckAnalysis?._ai_metadata;

  return (
    <div className="container py-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pitch Deck Intelligence</h2>
          <p className="text-muted-foreground">Upload and parse a pitch deck to verify claims and extract metrics.</p>
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
          {deckAnalysis && (
            <Button onClick={applyToDeal} className="gap-2">
              <CheckCircle className="w-4 h-4" /> Apply Extracted Metrics to Deal
            </Button>
          )}
        </div>
      </div>

      <PageHelpBanner 
        title="Deck Intelligence" 
        explanation="This tool parses the pitch deck, extracts key claims, and checks for missing information before you write the memo."
      />

      {!deckAnalysis ? (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>Paste Deck Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">No pitch deck has been analyzed yet. Upload or paste deck text to extract claims, missing sections, deck quality, and investor readiness.</p>
            <Textarea 
              className="min-h-[300px] font-mono text-sm" 
              placeholder="Paste deck text here... e.g.&#10;&#10;Problem: B2B sales is broken...&#10;Solution: Our AI platform automates...&#10;Traction: $1M ARR...&#10;Financials: Raising $3M at $15M post..." 
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            <Button onClick={handleAnalyze} disabled={analyzing || !rawText.trim()}>
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PlayCircle className="w-4 h-4 mr-2" />}
              Analyze Deck
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          
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
                    <div className="font-semibold mt-1 text-red-400">{deckAnalysis.financials?.burn_rate || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Runway</div>
                    <div className="font-semibold mt-1">{deckAnalysis.financials?.runway || "Unknown"}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-red-500 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5"/> Identified Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {deckAnalysis.risks?.map((risk: any, i: number) => (
                      <li key={i} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                        <div className="font-medium flex items-center gap-2">
                          {risk.risk}
                          <Badge variant="outline" className="text-xs">{risk.severity}</Badge>
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
      )}
    </div>
  )
}
