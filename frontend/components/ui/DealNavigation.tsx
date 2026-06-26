"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Briefcase, Search, Presentation, Activity, FileText, MessageSquare, Globe, Users, Bot, Play } from "lucide-react"

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
  { name: "Evidence Center", path: "evidence-center", icon: FileText },
  { name: "Knowledge Graph", path: "knowledge-graph", icon: Activity },
]

export function DealNavigation({ id }: { id: string }) {
  const pathname = usePathname()

  useEffect(() => {
    if (id && id !== 'active') {
      localStorage.setItem("activeDealId", id)
    }
  }, [id])

  return (
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
  )
}
