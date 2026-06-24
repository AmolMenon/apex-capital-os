"use client"

import { useEffect, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Briefcase, Search, Presentation, Activity, FileText, CheckSquare, Loader2, MessageSquare, Globe, Users, Bot, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { DealWorkflowStatusBar } from "@/components/ui/DealWorkflowStatusBar"
import { DealTopStatusBar } from "@/components/ui/DealTopStatusBar"

export default function DealLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  const id = params.id as string

  useEffect(() => {
    async function load() {
      if (id === 'active') {
        try {
          const d = await api.getSelectedDeal()
          if (d) {
            setDeal(d)
            if (typeof window !== 'undefined') window.history.replaceState(null, '', `/deals/${d.id}/deal-room`)
          }
        } catch(e) {
          console.error("Failed to load active deal", e)
        } finally {
          setLoading(false)
        }
      } else if (id) {
        localStorage.setItem("activeDealId", id)
        try {
          const d = await api.getDeal(id)
          setDeal(d)
        } catch(e) {
          console.error("Failed to load deal", e)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!deal && id !== 'active') {
    return (
      <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
          <Search className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Deal Not Found</h2>
          <p className="text-muted-foreground">
            We couldn't find a deal with ID "{id}". It may have been deleted or the backend restarted.
          </p>
        </div>
        <div className="flex items-center gap-4 pt-4">
          <Link href="/pipeline">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <Briefcase className="w-4 h-4 mr-2" /> Open Pipeline
            </button>
          </Link>
          <Link href="/command-center">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Back to Command Center
            </button>
          </Link>
          <Link href="/presentation">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              <Presentation className="w-4 h-4 mr-2" /> Start Demo
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { name: "Deal War Room", path: "war-room", icon: Users },
    { name: "Copilot", path: "copilot", icon: Bot },
    { name: "Overview", path: "deal-room", icon: Briefcase },
    { name: "Decision", path: "decision", icon: Activity },
    { name: "Scorecard", path: "scorecard", icon: Activity },
    { name: "Research", path: "research", icon: Search },
    { name: "Web Research", path: "web-research", icon: Globe },
    { name: "Deck", path: "deck", icon: Presentation },
    { name: "Run Diligence", path: "run-diligence", icon: Play },
    { name: "Platform Diligence", path: "platform-diligence", icon: Users },
    { name: "Diligence", path: "diligence", icon: Activity },
    { name: "Conversations", path: "conversations", icon: MessageSquare },
    { name: "Fund Fit", path: "fund-fit", icon: Activity },
    { name: "Partner Review", path: "partner-review", icon: Activity },
    { name: "Memo & IC", path: "memo", icon: FileText },
    { name: "IC One-Pager", path: "ic-one-pager", icon: FileText },
  ]

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-black text-slate-50 relative">
      {/* Massive Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      {/* Sticky Header with Deal Context */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm relative">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {deal?.startup_name}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm font-medium">
            <span className="text-muted-foreground">{deal?.sector}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{deal?.stage}</span>
            
            {deal?.analysis && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary">Apex Score: {deal.analysis.overall_score}/100</span>
              </>
            )}
          </div>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/command-center" className="text-muted-foreground hover:text-foreground">Command Center</Link>
          <Link href="/pipeline" className="text-muted-foreground hover:text-foreground">Pipeline</Link>
          <Link href="/compare" className="text-muted-foreground hover:text-foreground">Compare Deals</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href={`/deals/${id}/run-diligence`}>
            <button className="hidden md:flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-700 h-9 px-4 py-2 shadow-sm mr-2">
              <Play className="w-4 h-4 mr-2" /> Run Diligence
            </button>
          </Link>
          <div className="text-right mr-2 hidden md:block">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-semibold">{deal?.status || 'Pending'}</p>
          </div>
          {deal?.analysis ? (
            <StatusBadge status={deal.analysis.recommendation} />
          ) : (
            <StatusBadge status="Pending Analysis" />
          )}
        </div>
      </div>

      {/* Comprehensive Status Bar */}
      {deal && <DealTopStatusBar deal={deal} />}

      {/* Workflow Status Bar */}
      {deal && <DealWorkflowStatusBar deal={deal} />}

      {/* Tabs Navigation */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md px-6 relative z-10">
        <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const isActive = pathname.includes(`/deals/${id}/${tab.path}`)
            return (
              <Link
                key={tab.path}
                href={`/deals/${id}/${tab.path}`}
                className={cn(
                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <tab.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
