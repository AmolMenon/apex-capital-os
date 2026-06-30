"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Search, BrainCircuit, AlertTriangle, Layers } from "lucide-react"

export default function DocumentExperience() {
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null)

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 h-[calc(100vh-80px)] flex flex-col">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" /> Interactive Documents
        </h1>
        <p className="text-muted-foreground text-lg mt-2">AI-augmented reading experience.</p>
      </div>

      <div className="flex flex-1 gap-8 overflow-hidden">
        
        {/* Document Viewer (Simulated) */}
        <Card className="flex-1 overflow-y-auto border-border/50 relative bg-muted/10 shadow-inner">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b p-4 flex justify-between items-center z-10">
             <div className="font-bold">Pitch Deck v2.pdf</div>
             <div className="flex gap-2">
               <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><Search className="w-3 h-3 mr-1"/> 12 AI Extractions</Badge>
               <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20"><AlertTriangle className="w-3 h-3 mr-1"/> 1 Contradiction</Badge>
             </div>
          </div>
          
          <div className="p-12 space-y-8 font-serif text-lg leading-loose text-foreground max-w-3xl mx-auto">
            <h2 className="text-3xl font-sans font-bold">NeuralDesk: The Future of Support</h2>
            <p>
              NeuralDesk is revolutionizing the way enterprise companies handle tier-1 and tier-2 customer support. 
              By leveraging proprietary fine-tuned large language models, we are able to resolve 85% of incoming tickets without human intervention.
            </p>
            <p>
              Our traction over the last 12 months has been extraordinary. We have rapidly scaled our deployment and currently serve 
              <span 
                className={`mx-1 cursor-pointer transition-all ${activeHighlight === 1 ? 'bg-rose-500/40 text-rose-100 ring-2 ring-rose-500 rounded px-1' : 'bg-rose-500/20 text-rose-300 rounded px-1 border-b-2 border-rose-500 border-dashed'}`}
                onMouseEnter={() => setActiveHighlight(1)}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                200 active enterprise customers
              </span> 
              driving massive network effects across the platform.
            </p>
            <p>
              The unit economics of the business are robust. We operate at a 
              <span 
                className={`mx-1 cursor-pointer transition-all ${activeHighlight === 2 ? 'bg-emerald-500/40 text-emerald-100 ring-2 ring-emerald-500 rounded px-1' : 'bg-emerald-500/20 text-emerald-300 rounded px-1 border-b-2 border-emerald-500 border-dashed'}`}
                onMouseEnter={() => setActiveHighlight(2)}
                onMouseLeave={() => setActiveHighlight(null)}
              >
                82% gross margin
              </span>
              and have seen our sales cycles compress by 40% in the last two quarters alone.
            </p>
          </div>
        </Card>

        {/* Intelligence Panel */}
        <div className="w-96 flex flex-col gap-6 overflow-y-auto">
           {activeHighlight === 1 ? (
             <Card className="border-rose-500/50 shadow-xl shadow-rose-500/10 bg-rose-950/20 animate-in slide-in-from-right-4">
               <CardHeader className="pb-3 border-b border-rose-500/20">
                 <div className="flex items-center gap-2 text-rose-500 font-bold mb-1"><AlertTriangle className="w-4 h-4"/> High Risk Contradiction</div>
                 <CardTitle className="text-base">Customer Count Discrepancy</CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                 <p className="text-sm">The Auditor Agent flagged this statement because the <strong>Financial Model</strong> only shows revenue from 35 paying customers, contradicting the 200 claimed here.</p>
                 <Button variant="outline" size="sm" className="w-full border-rose-500/30 hover:bg-rose-500/10 text-rose-500">View in Contradiction Center</Button>
               </CardContent>
             </Card>
           ) : activeHighlight === 2 ? (
             <Card className="border-emerald-500/50 shadow-xl shadow-emerald-500/10 bg-emerald-950/20 animate-in slide-in-from-right-4">
               <CardHeader className="pb-3 border-b border-emerald-500/20">
                 <div className="flex items-center gap-2 text-emerald-500 font-bold mb-1"><BrainCircuit className="w-4 h-4"/> Financial Agent Observation</div>
                 <CardTitle className="text-base">Strong Gross Margins</CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                 <p className="text-sm">The Financial Agent cited this metric as a key strength in its analysis, noting that 82% is top-quartile for Seed-stage SaaS.</p>
                 <Button variant="outline" size="sm" className="w-full border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-500">View in Committee</Button>
               </CardContent>
             </Card>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/50 rounded-xl text-muted-foreground">
               <Layers className="w-12 h-12 mb-4 opacity-50" />
               <h3 className="font-bold text-lg mb-2">Hover to inspect</h3>
               <p className="text-sm">Hover over highlighted text in the document to see AI insights, contradictions, and linked evidence.</p>
             </div>
           )}
        </div>
        
      </div>
    </div>
  )
}
