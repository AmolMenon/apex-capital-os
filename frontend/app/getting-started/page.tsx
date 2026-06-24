import { WorkflowGuide } from "@/components/ui/WorkflowGuide"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Database, PlayCircle, PlusCircle } from "lucide-react"
import { TooltipHelper, TOOLTIP_DICTIONARY } from "@/components/ui/TooltipHelper"

export default function GettingStartedPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 px-6 pb-20">
      
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Welcome to Apex Capital</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Apex Capital is a VC analyst operating system that helps you move a startup from raw deal information to structured analysis, research, pitch deck review, diligence planning, fund fit assessment, memo generation, and IC readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Who is it for?</h2>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li>VC analysts</li>
            <li>Startup scouts</li>
            <li>Angel investors</li>
            <li>Founder’s office interns</li>
            <li>Students preparing for VC/PE/consulting/PM interviews</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">What each score means</h2>
          <div className="space-y-3">
            <p className="text-sm"><strong className="text-foreground">Apex Score:</strong> {TOOLTIP_DICTIONARY.apexScore}</p>
            <p className="text-sm"><strong className="text-foreground">Evidence Score:</strong> {TOOLTIP_DICTIONARY.evidenceScore}</p>
            <p className="text-sm"><strong className="text-foreground">Deck Quality Score:</strong> {TOOLTIP_DICTIONARY.deckQuality}</p>
            <p className="text-sm"><strong className="text-foreground">IC Readiness Score:</strong> {TOOLTIP_DICTIONARY.icReadiness}</p>
            <p className="text-sm"><strong className="text-foreground">Power Law Score:</strong> {TOOLTIP_DICTIONARY.powerLawScore}</p>
            <p className="text-sm"><strong className="text-foreground">Thesis Fit Score:</strong> {TOOLTIP_DICTIONARY.thesisFit}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">How to use Apex Capital</h2>
        <p className="text-muted-foreground text-sm">
          Follow this 10-step workflow to move a startup from intake to investment committee.
        </p>
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <WorkflowGuide />
        </div>
      </div>

      <div className="space-y-6 bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold">Ready to start?</h2>
        <p className="text-muted-foreground">
          We recommend starting with the guided demo using our flagship deal, <strong>NeuralDesk</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link href="/demo">
            <Button size="lg" className="shadow-lg h-12 px-6 font-semibold">
              <PlayCircle className="mr-2 h-5 w-5" /> Start Demo
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="h-12 px-6">
              Open Dashboard
            </Button>
          </Link>
          <Link href="/new">
            <Button variant="outline" size="lg" className="h-12 px-6">
              <PlusCircle className="mr-2 h-5 w-5" /> Create New Deal
            </Button>
          </Link>
          <Link href="/pipeline">
            <Button variant="outline" size="lg" className="h-12 px-6 border-muted-foreground/30">
              <Database className="mr-2 h-5 w-5 text-muted-foreground" /> Open Pipeline
            </Button>
          </Link>
        </div>
      </div>

    </div>
  )
}
