"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Presentation, 
  LayoutDashboard, 
  FileText, 
  ShieldAlert, 
  Database, 
  Server, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Activity, 
  Search, 
  LineChart, 
  Scale,
  Target
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-emerald-900/5 to-indigo-900/5 selection:bg-emerald-500/30">
      {/* 1. Hero */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center space-y-10 pt-20 pb-20 relative overflow-hidden">
        
        {/* Subtle glowing ambient lights behind hero */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-6 max-w-4xl relative z-10">
          <h1 className="text-6xl font-extrabold tracking-tighter lg:text-8xl text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Apex Capital
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">
            An agentic VC analyst operating system for evidence-backed startup evaluation.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
            Apex Capital moves startups from first look to investment judgment through analysis, research intelligence, pitch deck review, diligence planning, founder conversation analysis, fund-fit assessment, memo generation, and IC readiness.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-8 relative z-10">
          <Link href="/demo">
            <Button size="lg" className="h-14 px-8 font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 hover:shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Presentation className="mr-2 h-5 w-5" /> Launch Demo
            </Button>
          </Link>
          <Link href="/command-center">
            <Button size="lg" variant="outline" className="h-14 px-8 font-bold text-lg border-primary/20 hover:bg-primary/5 transition-all shadow-sm">
              <LayoutDashboard className="mr-2 h-5 w-5" /> Open Command Center
            </Button>
          </Link>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="ghost" className="h-14 px-8 font-bold text-lg text-muted-foreground hover:text-foreground transition-all">
              <FileText className="mr-2 h-5 w-5" /> View Case Study
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Product Workflow */}
      <section className="py-24 border-y border-border/50 bg-background/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">The Investment Workflow</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A systematic pipeline from raw founder narrative to verified investment judgment.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm md:text-base font-medium">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-muted/50 border border-border/50">Deal Intake</Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-muted/50 border border-border/50">Analysis</Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-muted/50 border border-border/50">Research</Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-muted/50 border border-border/50">Deck Review</Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-muted/50 border border-border/50">Diligence</Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <Badge variant="secondary" className="px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20">Conversations</Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-muted/50 border border-border/50">Fund Fit</Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-muted/50 border border-border/50">Memo</Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]">Investment Committee</Badge>
          </div>
        </div>
      </section>

      {/* 3. Why It Exists */}
      <section className="py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <Scale className="w-16 h-16 text-emerald-600/80 mx-auto drop-shadow-md" />
          <h2 className="text-4xl font-extrabold tracking-tight">Why This Matters</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Most startup evaluation tools stop at the pitch deck. <strong className="text-foreground font-semibold">Apex Capital also evaluates evidence quality, founder responses, unresolved risks, fund fit, and IC readiness.</strong>
          </p>
        </div>
      </section>

      {/* 4. What It Does */}
      <section className="py-24 border-y border-border/50 bg-background/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Core Operating Modules</h2>
            <p className="text-muted-foreground text-lg">Every phase of the venture lifecycle, augmented.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Deal Intake", desc: "Ingest structured startup data into the system." },
              { icon: Activity, title: "VC Scorecard", desc: "Evaluate team, market, product, and traction." },
              { icon: Search, title: "Research Intelligence", desc: "Automate market and competitor validation." },
              { icon: Layers, title: "Pitch Deck Intelligence", desc: "Extract and verify claims from founder decks." },
              { icon: ShieldAlert, title: "Diligence Command Center", desc: "Auto-generate risk resolution plans." },
              { icon: Cpu, title: "Decision Engine", desc: "Compute final IC readiness and next steps." },
              { icon: LineChart, title: "Fund Strategy", desc: "Simulate ownership and return requirements." },
              { icon: Presentation, title: "IC One-Pager", desc: "Generate deterministic memos for committee review." },
            ].map((feature, i) => (
              <Card key={i} className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 hover:border-emerald-500/30 group">
                <CardHeader className="pb-2">
                  <feature.icon className="w-8 h-8 text-primary mb-2 opacity-80 group-hover:text-emerald-500 transition-colors" />
                  <CardTitle className="text-lg font-bold tracking-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground font-medium">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Flagship Demo Deal & 6. Credibility */}
      <section className="py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">Evidence-Backed Judgment</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Apex Capital does not blindly recommend investments based on hype. A high company score can still be heavily downgraded by weak evidence, unresolved risks, low IC readiness, or poor fund fit.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              It enforces discipline, requiring founders to back up their claims before moving to the investment committee.
            </p>
            <Link href="/deals/1" className="inline-block mt-4">
              <Button variant="outline" className="h-12 px-6 border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm">
                Open NeuralDesk Deal Room <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Card className="border-emerald-500/20 shadow-2xl shadow-emerald-500/10 bg-background/80 backdrop-blur-md overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Target className="w-48 h-48" />
            </div>
            <div className="bg-emerald-500/10 px-6 py-4 border-b border-emerald-500/10 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold shadow-inner">N</div>
                <h3 className="font-bold text-lg text-foreground">NeuralDesk</h3>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 font-semibold">B2B SaaS • Seed</Badge>
            </div>
            <CardContent className="p-6 space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Apex Score</p>
                  <p className="text-3xl font-bold text-emerald-600">82<span className="text-lg text-muted-foreground/50">/100</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Evidence Score</p>
                  <p className="text-3xl font-bold text-amber-600">65<span className="text-lg text-muted-foreground/50">/100</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">IC Readiness</p>
                  <p className="text-3xl font-bold text-primary">50%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Recommendation</p>
                  <p className="text-xl font-bold text-foreground pt-1">Watchlist</p>
                </div>
              </div>
              <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/20 space-y-2">
                <p className="text-sm font-bold text-destructive flex items-center tracking-tight uppercase"><ShieldAlert className="w-4 h-4 mr-2"/> Main Blocker</p>
                <p className="text-sm text-foreground/80 font-medium">Pitch deck claims have not been extracted and graded for verification.</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* 7. Architecture Snapshot */}
      <section className="py-24 border-y border-border/50 bg-background/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">System Architecture</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">Built on a modular, model-agnostic foundation designed for scale.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-5 py-3 text-sm bg-background/80 backdrop-blur-sm border-border/50 shadow-sm flex items-center gap-2 font-medium">
              <LayoutDashboard className="w-4 h-4 text-primary" /> Next.js 15 Frontend
            </Badge>
            <Badge variant="outline" className="px-5 py-3 text-sm bg-background/80 backdrop-blur-sm border-border/50 shadow-sm flex items-center gap-2 font-medium">
              <Server className="w-4 h-4 text-emerald-500" /> FastAPI Backend
            </Badge>
            <Badge variant="outline" className="px-5 py-3 text-sm bg-background/80 backdrop-blur-sm border-border/50 shadow-sm flex items-center gap-2 font-medium">
              <Cpu className="w-4 h-4 text-blue-500" /> Modular Python Engines
            </Badge>
            <Badge variant="outline" className="px-5 py-3 text-sm bg-background/80 backdrop-blur-sm border-border/50 shadow-sm flex items-center gap-2 font-medium">
              <Database className="w-4 h-4 text-purple-500" /> Model-Agnostic Router
            </Badge>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-32 text-center px-6 relative z-10">
        <h2 className="text-4xl font-bold tracking-tight mb-8">Ready to explore the OS?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/demo">
            <Button size="lg" className="h-14 px-8 font-bold text-lg shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform bg-emerald-600 hover:bg-emerald-700 text-white">
              Start Guided Demo
            </Button>
          </Link>
          <Link href="/command-center">
            <Button size="lg" variant="outline" className="h-14 px-8 font-bold text-lg shadow-sm">
              Open Command Center
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
