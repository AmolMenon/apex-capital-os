"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Briefcase, Search, Presentation, Activity, FileText, MessageSquare, Globe, Users, Bot, Play } from "lucide-react"

const tabs = [
  { name: "Overview", path: "deal-room", icon: Briefcase },
  { name: "Founder", path: "founder", icon: Users },
  { name: "Research", path: "research", icon: Search },
  { name: "Diligence", path: "diligence", icon: Activity },
  { name: "Living Thesis", path: "thesis", icon: FileText },
  { name: "Decision Lab", path: "decision-lab", icon: Play },
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
