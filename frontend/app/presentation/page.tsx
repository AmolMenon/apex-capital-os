"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TerminalSquare, Database, Network, Building2, CheckCircle, ShieldAlert } from "lucide-react"

export default function PresentationPage() {
  const copyPitch = () => {
    navigator.clipboard.writeText("Apex Capital is an agentic VC analyst OS that turns raw startup inputs into a structured investment workflow. It evaluates the company, creates a VC scorecard, separates thesis quality from evidence quality, reviews pitch deck claims, builds a diligence plan, tracks IC readiness, and produces an investment memo and IC one-pager.")
    alert("Pitch copied to clipboard!")
  }

  const copyWalkthrough = () => {
    navigator.clipboard.writeText("1. Intake deal. 2. Auto-run analysis. 3. AI conducts Research and reads Deck. 4. Risks are converted into Diligence requests. 5. Fund Strategy calculates ownership. 6. Final Memo and IC One-Pager generated deterministically.")
    alert("Walkthrough copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-50 selection:bg-primary/30">
      {/* 1. Opening */}
      <section className="min-h-screen flex flex-col justify-center px-8 max-w-5xl mx-auto py-20 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            <TerminalSquare className="mr-2 h-4 w-4" /> Agentic VC OS
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
            Apex Capital
          </h1>
          <p className="text-2xl md:text-3xl text-slate-400 font-medium max-w-3xl leading-snug">
            An agentic VC analyst operating system that moves startups from first look to IC readiness.
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mt-4 leading-relaxed">
            Apex Capital turns raw startup information, pitch deck claims, research gaps, and diligence blockers into structured, evidence-backed investment judgment.
          </p>
          
          <div className="pt-10 flex flex-wrap gap-4">
            <Link href="/">
              <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] transition-all">
                Open Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/deals/1000/deal-room">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-white/5 border-white/10 hover:bg-white/10 text-white">
                View NeuralDesk Deal
              </Button>
            </Link>
          </div>
          
          <div className="pt-8 flex gap-4 border-t border-white/10 mt-12 w-fit">
            <Button variant="ghost" onClick={copyPitch} className="text-slate-400 hover:text-white">
              Copy 30-Second Pitch
            </Button>
            <Button variant="ghost" onClick={copyWalkthrough} className="text-slate-400 hover:text-white">
              Copy 2-Minute Walkthrough
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Problem & 3. Thesis */}
      <section className="py-32 bg-black border-y border-white/5">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-red-400 mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> The Problem
            </h2>
            <h3 className="text-3xl font-bold mb-6">Fragmented Judgment</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Early-stage investment analysis is fragmented across pitch decks, messy spreadsheets, scattered research notes, unstructured founder calls, and manual diligence trackers. It relies too heavily on intuition and lacks deterministic rigor.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-emerald-400 mb-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> The Product Thesis
            </h2>
            <h3 className="text-3xl font-bold mb-6">Unified Intelligence</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Apex Capital brings this entire workflow into a single, cohesive system. By treating the investment process as a structured data pipeline, we combine the qualitative reasoning of LLMs with deterministic mathematical models.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Workflow */}
      <section className="py-32 px-8 max-w-5xl mx-auto">
        <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-4 flex items-center gap-2">
          <Network className="h-4 w-4" /> System Workflow
        </h2>
        <h3 className="text-4xl font-bold mb-12">The 8-Step Pipeline</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "1. Deal Intake", "2. Analysis Engine", "3. Research Intelligence", "4. Deck Intelligence",
            "5. Diligence Command", "6. Fund Strategy Fit", "7. Investment Memo", "8. IC One-Pager"
          ].map((step, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl relative group hover:bg-white/10 transition-colors">
              <div className="text-primary/50 text-4xl font-black absolute top-2 right-4 opacity-20">{i+1}</div>
              <div className="font-bold text-lg mt-4">{step.split('. ')[1]}</div>
              {i < 7 && <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 text-white/20 hidden md:block" />}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Flagship Deal & 6. Credibility */}
      <section className="py-32 bg-white/5 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Flagship Deal
            </h2>
            <h3 className="text-4xl font-bold mb-6">NeuralDesk (Series A)</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              To demonstrate the platform, we use a live Series A enterprise SaaS deal. Apex Capital separates the core thesis from the available evidence, ensuring we don't blindly trust the founder's pitch.
            </p>
            
            <div className="bg-black border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-slate-400 font-medium">Apex Score</span>
                <span className="text-2xl font-bold text-white">82</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-slate-400 font-medium">IC Readiness</span>
                <span className="text-2xl font-bold text-amber-400">71%</span>
              </div>
              <div className="pt-2">
                <span className="block text-xs uppercase tracking-wider text-slate-500 mb-2">Recommendation</span>
                <span className="inline-flex bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded text-sm font-bold">
                  Watchlist / Proceed to Diligence
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-xl font-bold mb-2">Why It Is Credible</h4>
              <p className="text-slate-400 leading-relaxed">
                A high score alone does not force an "Invest" recommendation. The system explicitly flags missing evidence, unresolved risks, and IC blockers, downgrading the final recommendation if the deal isn't fully proven.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Portfolio Construction</h4>
              <p className="text-slate-400 leading-relaxed">
                Even if a deal is great, it must fit the fund math. Apex runs power-law simulations and reserve calculations to ensure target ownership aligns with the firm's mandate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Architecture */}
      <section className="py-32 px-8 max-w-5xl mx-auto">
        <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-4 flex items-center gap-2">
          <Database className="h-4 w-4" /> Technical Architecture
        </h2>
        <h3 className="text-4xl font-bold mb-12">Production Ready</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card/50 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
            <h4 className="font-bold text-lg mb-3 text-white">Full-Stack Framework</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>• Next.js 14 Frontend</li>
              <li>• React & Tailwind CSS</li>
              <li>• shadcn/ui Design System</li>
              <li>• FastAPI (Python) Backend</li>
            </ul>
          </div>
          
          <div className="bg-card/50 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
            <h4 className="font-bold text-lg mb-3 text-white">Model-Agnostic Router</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>• Intelligent API Routing</li>
              <li>• Cost/Capability Optimization</li>
              <li>• Future-proof against churn</li>
              <li>• Structured JSON Enforcement</li>
            </ul>
          </div>
          
          <div className="bg-card/50 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
            <h4 className="font-bold text-lg mb-3 text-white">Mock Fallback Mode</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>• 100% Deterministic Fallback</li>
              <li>• Zero-dependency live demos</li>
              <li>• Guaranteed stability</li>
              <li>• Seeded mock data scenarios</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Demo Launch */}
      <section className="py-32 bg-black border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-6">Begin the Walkthrough</h2>
          <p className="text-slate-400 text-xl mb-12">
            Explore the flagship NeuralDesk deal through the eyes of an investment committee.
          </p>
          
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <Link href="/deals/1000/deal-room">
              <Button size="lg" className="w-full h-14 text-lg justify-between px-6 bg-primary hover:bg-primary/90">
                1. Open Deal Room <ArrowRight className="h-5 w-5 opacity-70" />
              </Button>
            </Link>
            <Link href="/deals/1000/research">
              <Button size="lg" variant="outline" className="w-full h-14 text-lg justify-between px-6 bg-white/5 border-white/10 hover:bg-white/10">
                2. Open Research Brief <ArrowRight className="h-5 w-5 opacity-50" />
              </Button>
            </Link>
            <Link href="/deals/1000/deck">
              <Button size="lg" variant="outline" className="w-full h-14 text-lg justify-between px-6 bg-white/5 border-white/10 hover:bg-white/10">
                3. Open Deck Intelligence <ArrowRight className="h-5 w-5 opacity-50" />
              </Button>
            </Link>
            <Link href="/deals/1000/diligence">
              <Button size="lg" variant="outline" className="w-full h-14 text-lg justify-between px-6 bg-white/5 border-white/10 hover:bg-white/10">
                4. Open Diligence Command <ArrowRight className="h-5 w-5 opacity-50" />
              </Button>
            </Link>
            <Link href="/deals/1000/memo">
              <Button size="lg" variant="outline" className="w-full h-14 text-lg justify-between px-6 bg-white/5 border-white/10 hover:bg-white/10">
                5. Open Investment Memo <ArrowRight className="h-5 w-5 opacity-50" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
