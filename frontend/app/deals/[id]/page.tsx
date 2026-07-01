"use client";

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { 
  Target, AlertTriangle, Sparkles, Globe, Cpu, Users, 
  Banknote, LineChart, PieChart, ShieldAlert, Zap, TrendingUp, CheckCircle, Crosshair, MessageSquare
} from "lucide-react"
import { useGlobalDeal } from "@/components/GlobalDealProvider"
import { DealRoomSkeleton } from "@/components/ui/DealRoomSkeleton"
import { TooltipHelper } from "@/components/ui/TooltipHelper"
import { Separator } from "@/components/ui/separator"
import { InvestorJudgmentCard } from "@/components/ui/InvestorJudgmentCard"
import { DealHealthEngine } from "@/components/ui/DealHealthEngine"
import { calculateDealHealth } from "@/lib/deal-logic"
import { DealTimeline } from "@/components/ui/DealTimeline"
import { PartnerView } from "@/components/ui/PartnerView"
import { motion } from "framer-motion"
import { ConvictionHistoryGraph } from "@/components/ui/ConvictionHistoryGraph"

export default function DealRoomOverview() {
  const { state, loading, isPartnerMode } = useGlobalDeal();

  if (loading || !state) return <DealRoomSkeleton />;

  const { deal, analysis } = state;
  
  // Opinionated AI Outputs
  const recommendationText = analysis?.opinionated_recommendation || 
    (analysis?.recommendation === "Invest" 
      ? `Although market size is highly attractive and early traction is promising, customer concentration (Top 3 account for 45% of revenue) introduces significant downside risk. However, their unique technological moat justifies the valuation. Strongly recommend proceeding to deep Technical Diligence.`
      : `Market is heavily saturated. While the team is strong, the GTM motion is unproven and unit economics do not support a venture-scale return profile in the current macro environment. Pass.`);
  
  const confidenceLevel = analysis?.confidence || "Medium";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 bg-background min-h-screen p-6 rounded-xl pb-24"
    >
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight">{deal.startup_name}</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">{deal.stage || 'Seed'}</Badge>
            <TooltipHelper content="The AI has verified all claims against public benchmarks and resolved all major diligence flags. Ready for final partner vote.">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-help">IC Ready</Badge>
            </TooltipHelper>
          </div>
          <p className="text-xl text-muted-foreground">{deal.description || "Building the intelligence layer for enterprise infrastructure."}</p>
          <div className="flex items-center gap-4 mt-4 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {deal.website || "www.example.com"}</span>
            <span className="flex items-center gap-1.5"><Target className="w-4 h-4" /> {deal.sector || "Enterprise AI"}</span>
            <span className="flex items-center gap-1.5"><Banknote className="w-4 h-4" /> Asking $12M at $50M Post</span>
          </div>
        </div>
      </div>

      {/* Deal Timeline Component */}
      <div className="bg-card/30 border border-border/50 rounded-lg p-2 shadow-sm mb-6">
        <DealTimeline currentStageIndex={6} />
      </div>

      {isPartnerMode ? (
        <PartnerView deal={deal} analysis={analysis} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Summary & AI Opinion */}
          <Card className="border-border/40 bg-card shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" /> Platform Synthesis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Summary</h4>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {recommendationText}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 p-3 rounded-md border border-emerald-500/20">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-1">Supporting Evidence</h4>
                  <ul className="text-xs space-y-1 mt-2 text-foreground/80">
                    <li>• Customer reference transcripts (3)</li>
                    <li>• Verified NRR &gt; 120% in Q2</li>
                    <li>• Founder background verification</li>
                  </ul>
                </div>
                <div className="bg-red-500/5 p-3 rounded-md border border-red-500/20">
                  <h4 className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest mb-1">Contradictory Evidence</h4>
                  <ul className="text-xs space-y-1 mt-2 text-foreground/80">
                    <li>• High customer concentration (Top 2 = 40%)</li>
                    <li>• Pricing model undercuts margin</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/10">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Confidence</h4>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 cursor-help" title="Confidence is moderate due to unverified churn data. Requires further technical diligence.">
                    <CheckCircle className="w-4 h-4"/> {confidenceLevel}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Missing Info</h4>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Churn data for Q3 is unverified.</p>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md border border-border/50 flex justify-between items-center">
                 <div>
                   <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recommended Next Action</h4>
                   <p className="text-sm font-medium mt-1">Deep-dive on OpenAI inference costs</p>
                 </div>
                 <Link prefetch={true} href={`/deals/${deal.id}/diligence`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Execute <TrendingUp className="w-3 h-3"/></Link>
              </div>
            </CardContent>
          </Card>

          {/* Deal Health Engine with Historical Conviction */}
          <div>
            {deal && <DealHealthEngine factors={calculateDealHealth(deal).healthFactors || []} />}
            <div className="bg-card/30 border border-border/50 rounded-b-lg p-4 -mt-2 shadow-sm relative z-0">
               <ConvictionHistoryGraph baseScore={deal.conviction_score || 85} />
            </div>
          </div>

          {/* Business Model & Traction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Revenue & Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">ARR</span>
                  <TooltipHelper content="Extracted from Q3 financials via Data Room. Reconciled against Stripe billing exports.">
                    <span className="text-lg font-bold cursor-help border-b border-dashed border-muted-foreground/50">${deal.arr ? (deal.arr/1000000).toFixed(1) + 'M' : '1.2M'}</span>
                  </TooltipHelper>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Growth (YoY)</span>
                  <TooltipHelper content="Trailing 12-month calculated growth. Adjusted for seasonality.">
                    <span className="text-lg font-bold text-emerald-500 cursor-help border-b border-dashed border-emerald-500/50">+145%</span>
                  </TooltipHelper>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Gross Margin</span>
                  <TooltipHelper content="Non-GAAP gross margin excluding one-time cloud migration costs.">
                    <span className="text-lg font-bold cursor-help border-b border-dashed border-muted-foreground/50">82%</span>
                  </TooltipHelper>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">Burn Rate</span>
                  <TooltipHelper content="3-month rolling average. Assumes headcount remains flat.">
                    <span className="text-lg font-bold text-red-500 cursor-help border-b border-dashed border-red-500/50">-$240k/mo</span>
                  </TooltipHelper>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/50">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-base flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-500" /> Market & Competition</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">TAM</span>
                  <TooltipHelper content="Calculated using bottom-up analysis: (Target Companies) x (ACV)">
                    <p className="text-sm font-medium mt-0.5 cursor-help border-b border-dashed border-muted-foreground/50 w-fit">$14.2B (growing 22% CAGR)</p>
                  </TooltipHelper>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Competitors</span>
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    <Badge variant="outline" className="bg-muted">Rippling</Badge>
                    <Badge variant="outline" className="bg-muted">Deel</Badge>
                    <Badge variant="outline" className="bg-muted">Gusto</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Moat</span>
                  <p className="text-sm font-medium mt-0.5">Proprietary dataset & high switching costs.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SWOT Analysis */}
          <Card className="shadow-sm border-border/50 overflow-hidden">
            <CardHeader className="pb-0 border-b bg-muted/20">
              <div className="flex gap-4 border-b border-border/50 px-6 pt-4">
                <div className="pb-3 border-b-2 border-primary font-semibold text-sm">SWOT & Theses</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-x divide-y divide-border/50">
                <div className="p-6 bg-emerald-500/5">
                  <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2"><Target className="w-4 h-4"/> Bull Case (Strengths)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span> Top-decile net retention (135%) indicates immense product stickiness.</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">•</span> Founders have deep domain expertise from Stripe and Plaid.</li>
                  </ul>
                </div>
                <div className="p-6 bg-red-500/5">
                  <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Bear Case (Weaknesses)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span> Highly concentrated customer base. Loss of top 2 accounts halves revenue.</li>
                    <li className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span> Heavy reliance on OpenAI API creates margin vulnerability.</li>
                  </ul>
                </div>
                <div className="p-6 bg-blue-500/5">
                  <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2"><Zap className="w-4 h-4"/> Catalysts (Opportunities)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Upcoming SOC2 Type II compliance will unlock enterprise tier deals.</li>
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Expanding into European markets post Series A.</li>
                  </ul>
                </div>
                <div className="p-6 bg-amber-500/5">
                  <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Key Risks (Threats)</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">•</span> Incumbents like Microsoft bundling similar features for free.</li>
                    <li className="flex items-start gap-2"><span className="text-amber-500 mt-1">•</span> Regulatory changes in AI data privacy could halt European expansion.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Founder Profile */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3 border-b bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Founding Team</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {deal.founder_name ? deal.founder_name.split(' ').map((n: string) => n[0]).join('') : 'F'}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{deal.founder_name || "Unknown Founder"}</h3>
                  <p className="text-xs text-muted-foreground mb-1">CEO & Co-founder</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px] bg-muted/50">Ex-Stripe</Badge>
                    <Badge variant="outline" className="text-[10px] bg-muted/50">Stanford CS</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Founder Market Fit</span>
                  <span className="font-medium text-emerald-500">92/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Previous Exits</span>
                  <span className="font-medium">1 ($45M)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collaboration: Activity & Comments */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3 border-b bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Activity & Comments</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 max-h-[300px] overflow-y-auto">
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent pt-2 pb-2">
                <div className="relative flex gap-4 items-start group">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm z-10 relative">
                    <span className="absolute inset-0 rounded-full border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300"></span>
                    AL
                  </div>
                  <div className="space-y-1.5 flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Alex (GP)</span>
                      <span className="text-[10px] text-muted-foreground font-mono">2h ago</span>
                    </div>
                    <p className="text-sm text-foreground bg-muted/40 p-3 rounded-lg border border-border/50 shadow-sm relative before:absolute before:w-2 before:h-2 before:bg-muted/40 before:border-l before:border-t before:border-border/50 before:-left-1.5 before:top-3 before:-rotate-45">
                      I'm concerned about the <span className="font-semibold text-primary">@OpenAI</span> dependency. <span className="font-semibold text-indigo-500">@Sarah</span> can you run a deep dive on their inference costs?
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 items-start group">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm z-10 relative">
                    <span className="absolute inset-0 rounded-full border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300"></span>
                    SA
                  </div>
                  <div className="space-y-1.5 flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Sarah (Principal)</span>
                      <span className="text-[10px] text-muted-foreground font-mono">1h ago</span>
                    </div>
                    <p className="text-sm text-foreground bg-muted/40 p-3 rounded-lg border border-border/50 shadow-sm relative before:absolute before:w-2 before:h-2 before:bg-muted/40 before:border-l before:border-t before:border-border/50 before:-left-1.5 before:top-3 before:-rotate-45">
                      On it. Adding it to the <Link prefetch={true} href="diligence" className="text-primary hover:underline font-medium">Technical Diligence</Link> pipeline.
                    </p>
                  </div>
                </div>
                
                <div className="relative flex gap-4 items-start group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-sm z-10 relative">
                    <span className="absolute inset-0 rounded-full border border-primary/30 group-hover:scale-110 transition-transform duration-300"></span>
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-primary">Apex AI System</span>
                      <span className="text-[10px] text-muted-foreground font-mono">10m ago</span>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 shadow-sm relative before:absolute before:w-2 before:h-2 before:bg-primary/5 before:border-l before:border-t before:border-primary/20 before:-left-1.5 before:top-3 before:-rotate-45">
                      <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                        Updated the Living Thesis with 2 new risk factors based on <Link prefetch={true} href="research" className="text-primary hover:underline">Recent News Analysis</Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-3 border-t bg-muted/5">
               <input type="text" placeholder="Add a comment or @mention..." className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </CardFooter>
          </Card>

          {/* Founders */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Founding Team</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0">
                  {deal.founder_name ? deal.founder_name.charAt(0) : 'A'}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{deal.founder_name || "Alice Smith"}</h4>
                  <p className="text-xs text-muted-foreground">CEO & Co-founder</p>
                  <p className="text-xs mt-1">Ex-Stripe Product Lead. Built internal ledger system.</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shrink-0">B</div>
                <div>
                  <h4 className="font-bold text-sm">Bob Johnson</h4>
                  <p className="text-xs text-muted-foreground">CTO & Co-founder</p>
                  <p className="text-xs mt-1">Ex-Palantir Engineer. 2x YC Alumni.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deal Dynamics */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Funding History</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="relative pl-4 border-l-2 border-border/50 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background"></div>
                  <h4 className="text-sm font-bold">Series A (Current)</h4>
                  <p className="text-xs text-muted-foreground">$12M at $50M Post-Money</p>
                </div>
                <div className="relative opacity-60">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-muted-foreground ring-4 ring-background"></div>
                  <h4 className="text-sm font-bold">Seed (2023)</h4>
                  <p className="text-xs text-muted-foreground">$3M at $15M Post • Led by Sequoia</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Questions for Founder */}
          <Card className="border-border/40 bg-card shadow-sm">
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="text-sm flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Crosshair className="w-4 h-4" /> Questions for Founder
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-xs font-medium bg-background/50 p-2.5 rounded-md border border-indigo-500/20">
                "How do you plan to decouple from OpenAI to improve gross margins over the next 18 months?"
              </p>
              <p className="text-xs font-medium bg-background/50 p-2.5 rounded-md border border-indigo-500/20">
                "If customer X (30% of revenue) churns, what is the contingency plan for runaway burn?"
              </p>
            </CardContent>
          </Card>

          </div>
        </div>
      )}
    </motion.div>
  )
}
