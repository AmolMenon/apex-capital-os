"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlayCircle, ShieldCheck, Mail, Briefcase, Search, Database, Users, MessageSquare, Activity, FileText, CheckSquare, Zap, Target } from "lucide-react"

const DEMO_STEPS = [
  { num: 1, name: "Open BharatVector AI Inbound", route: "/deal-inbox/items/inb_bharatvector", status: "Mock Ready", icon: Mail, script: "Apex starts where real VC workflow starts: messy inbound." },
  { num: 2, name: "Triage Inbound Deal", route: "/deal-inbox/items/inb_bharatvector", status: "Mock Ready", icon: Target, script: "This founder email is parsed into company claims, thesis fit, and missing information." },
  { num: 3, name: "Convert to Apex Deal", route: "/deal-room", status: "Mock Ready", icon: Briefcase, script: "Watch how unstructured data is converted into a structured deal room." },
  { num: 4, name: "Open Deal Room", route: "/deal-room", status: "Mock Ready", icon: Briefcase, script: "This is the central workspace where all intelligence aggregates." },
  { num: 5, name: "Run Web Research", route: "/deals/999/web-research", status: "Mock Ready", icon: Search, script: "Apex autonomously gathers public signals to verify the founder's claims." },
  { num: 6, name: "Open Evidence Center", route: "/deals/999/evidence-center", status: "Ready", icon: Database, script: "Apex separates founder claims from public evidence and unknown private metrics." },
  { num: 7, name: "Review Unknowns", route: "/deals/999/evidence-center", status: "Ready", icon: Database, script: "It explicitly identifies what we don't know, preventing hallucinations." },
  { num: 8, name: "Open War Room", route: "/deals/999/war-room", status: "Ready", icon: Users, script: "The War Room turns the deal into an investment debate, not just a score." },
  { num: 9, name: "Ask Copilot", route: "/deals/999/copilot", status: "Mock Ready", icon: MessageSquare, script: "The Copilot lets a partner ask why the deal is interesting, what is missing, and what would change our mind." },
  { num: 10, name: "Open Decision Engine", route: "/deals/999/decision", status: "Ready", icon: Activity, script: "The Decision Engine does not say Invest. It says Diligence Required because key private data is missing." },
  { num: 11, name: "Generate IC Packet", route: "/deals/999/ic-packet", status: "Ready", icon: FileText, script: "The IC Packet is a partner-ready draft." },
  { num: 12, name: "Open Trust Center", route: "/trust-center", status: "Ready", icon: ShieldCheck, script: "The Trust Center shows it still needs review." },
  { num: 13, name: "Open Operations Tasks", route: "/operations", status: "Ready", icon: CheckSquare, script: "Finally, Operations turns the missing evidence into tasks, owners, and follow-ups." },
]

export default function DemoControlCenterPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 mb-3 font-mono border-emerald-500/20">CONFIDENTIAL: PARTNER DEMO MODE</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">Demo Control Center</h1>
          <p className="text-muted-foreground text-lg mt-2">Your single pane of glass to orchestrate a flawless, Sequoia-grade product showcase.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/deal-inbox/items/inb_bharatvector">
            <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-900/20" size="lg">
              <PlayCircle className="mr-2 h-5 w-5" /> Start 9/10 Demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Sequences */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-indigo-900/50 shadow-sm overflow-hidden bg-background">
            <div className="bg-indigo-950 text-white p-5 flex items-center justify-between border-b border-indigo-900">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg">9/10 Flagship Demo Flow</h3>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Stable</Badge>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {DEMO_STEPS.map((step, idx) => (
                  <div key={idx} className="p-5 hover:bg-muted/30 transition-colors flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold shrink-0 shadow-inner border border-indigo-900/50">
                      {step.num}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <step.icon className="w-4 h-4 text-muted-foreground" />
                          {step.name}
                        </div>
                        <Badge variant="outline" className={
                          step.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          'bg-sky-500/10 text-sky-500 border-sky-500/20'
                        }>{step.status}</Badge>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground bg-muted p-1.5 rounded inline-block">
                        {step.route}
                      </div>
                      <div className="text-sm italic text-muted-foreground border-l-2 border-indigo-500/30 pl-3 py-1">
                        "{step.script}"
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col justify-center">
                      <Link href={step.route}>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                          Open
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Statuses */}
        <div className="space-y-6">
          <Card className="bg-background">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5" /> Demo System Health</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <StatusRow label="Backend Engine" status="Ready" color="emerald" />
              <StatusRow label="Database (SQLite)" status="Ready" color="emerald" />
              <StatusRow label="Frontend Routes" status="Ready" color="emerald" />
              <StatusRow label="Mock Engine Fallback" status="Ready" color="emerald" />
              <StatusRow label="BharatVector Fixtures" status="Ready" color="emerald" />
            </CardContent>
          </Card>

          <Card className="bg-background border-amber-900/50">
            <CardHeader className="pb-3 border-b border-amber-900/30 bg-amber-950/20">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-500"><Zap className="w-5 h-5" /> Architecture Note</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="text-sm text-muted-foreground leading-relaxed">
                By default, this demo uses <strong>Mock Mode</strong>. Deterministic fallback fixtures ensure that the presentation will never crash, hallucinate, or hang during a live VC pitch.
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                Apex is not trying to replace investment judgment. It is trying to make the judgment process structured, evidence-backed, and operationally executable.
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

function StatusRow({ label, status, color }: { label: string, status: string, color: 'emerald' | 'amber' | 'blue' | 'red' }) {
  const bgColors = {
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20"
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium flex items-center">{label}</span>
      <Badge variant="outline" className={`text-xs ${bgColors[color]}`}>
        {status}
      </Badge>
    </div>
  )
}
