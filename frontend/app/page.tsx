import Link from "next/link";
import { ArrowRight, BarChart3, ShieldAlert, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight">Apex</div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#problem" className="hover:text-foreground transition-colors">The Problem</Link>
            <Link href="#solution" className="hover:text-foreground transition-colors">How it Works</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/onboarding">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/onboarding">
              <Button>Run Diligence on My Deck</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-32 px-6 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Know exactly how VCs will evaluate you.<br />
            <span className="text-muted-foreground">Before you pitch.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Apex runs a brutally honest, mathematically sound diligence simulation on your pitch deck and data room. Fix your weak points. Raise your next round with confidence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/onboarding">
              <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
                Run Diligence on My Deck <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          {/* Security & Privacy Promise */}
          <div className="mt-16 pt-8 border-t border-border/40 max-w-2xl mx-auto text-left flex flex-col md:flex-row items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Bank-grade Confidentiality</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
            <div className="text-sm">
              Your deck is <strong>never</strong> used to train AI models.
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
            <div className="text-sm">
              Only you control access.
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section id="problem" className="py-24 bg-card border-y border-border/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Fundraising is an opaque, high-stakes game.</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                You spend months building a deck, only to get passed on with a generic "It's not a fit right now." The truth? There was a fatal flaw in your unit economics, or a glaring contradiction in your market sizing that you couldn't see.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-background rounded-lg border">
                <ShieldAlert className="w-10 h-10 text-destructive mb-4" />
                <h3 className="font-bold text-lg mb-2">Hidden Contradictions</h3>
                <p className="text-muted-foreground">Your slide 4 TAM doesn't mathematically align with your slide 12 pricing model.</p>
              </div>
              <div className="p-6 bg-background rounded-lg border">
                <BarChart3 className="w-10 h-10 text-warning mb-4" />
                <h3 className="font-bold text-lg mb-2">Unsubstantiated Metrics</h3>
                <p className="text-muted-foreground">You claim strong retention, but your data room lacks the cohort analysis to prove it.</p>
              </div>
              <div className="p-6 bg-background rounded-lg border">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Weak Narrative Pillars</h3>
                <p className="text-muted-foreground">Your Go-To-Market strategy is generic and lacks evidence of repeatability.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="solution" className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Meet your Automated Diligence Engine.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powered by the same deterministic reasoning engine used by top venture capital firms, Apex strips away the noise. It doesn't just summarize your deck—it stress-tests every claim against reality.
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Upload your Materials</h3>
                <p className="text-muted-foreground">Drop in your deck and financials. Apex instantly reads and parses your entire narrative.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">The Simulation Runs</h3>
                <p className="text-muted-foreground">Our engine builds an evidence graph, finding every logical leap, contradiction, and missing data point.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Execute the Action Plan</h3>
                <p className="text-muted-foreground">You get a prioritized checklist of exactly what to fix to become fundable.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border/40 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-lg">Apex Intelligence</div>
          <div className="text-sm text-muted-foreground">© 2026 Apex. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
