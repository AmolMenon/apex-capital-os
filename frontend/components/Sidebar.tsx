"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useScreenshotMode } from "@/components/ScreenshotProvider"
import { 
  LayoutDashboard, Database, Bookmark, BookOpen, Settings, Play,
  Briefcase, Presentation, Activity, FileText, CheckSquare, MessageSquare, 
  Users, ShieldCheck, Network, PieChart, FlaskConical, Inbox, Calculator, Folder,
  ChevronDown, ChevronRight, Plus
} from "lucide-react"
import { useState } from "react"

const menuGroups = [
  {
    title: "Discover",
    routes: [
      { name: "Executive Dashboard", path: "/", icon: LayoutDashboard, isDeal: false },
      { name: "Deal Inbox", path: "/deal-inbox", icon: Inbox, isDeal: false },
      { name: "Pipeline", path: "/pipeline", icon: Bookmark, isDeal: false },
      { name: "Sourcing", path: "/sourcing", icon: Network, isDeal: false },
    ]
  },
  {
    title: "Evaluate",
    routes: [
      { name: "Executive Overview", path: "", icon: Briefcase, isDeal: true },
      { name: "Evaluate Deal", path: "/evaluate", icon: Database, isDeal: true },
    ]
  },
  {
    title: "Decide",
    routes: [
      { name: "Decision Center", path: "/decide", icon: Activity, isDeal: true },
      { name: "Decision Lab", path: "/decision-lab", icon: FlaskConical, isDeal: false },
    ]
  },
  {
    title: "Execute",
    routes: [
      { name: "Execution Ops", path: "/execute", icon: CheckSquare, isDeal: true },
      { name: "Fund Operations", path: "/operations", icon: Settings, isDeal: false },
    ]
  },
  {
    title: "Manage",
    routes: [
      { name: "Portfolio", path: "/portfolio", icon: PieChart, isDeal: false },
      { name: "Fund OS", path: "/fund-os", icon: LayoutDashboard, isDeal: false },
    ]
  }
]

export function Sidebar({ mobile }: { mobile?: boolean } = {}) {
  const pathname = usePathname()
  const { isScreenshotMode } = useScreenshotMode()

  const segments = pathname.split('/').filter(Boolean)
  const isDealRoute = segments[0] === 'deal' || segments[0] === 'deals'
  // Use bharatvector as default if no deal selected
  const currentDealId = (isDealRoute && segments.length >= 2) ? segments[1] : "bharatvector"

  if (isScreenshotMode) return null;

  const isRouteActive = (routePath: string, isDeal: boolean = false) => {
    if (!isDeal) {
      if (routePath === '/') return pathname === '/';
      return pathname.startsWith(routePath);
    } else {
      const dealPath = `/deals/${currentDealId}${routePath}`;
      if (routePath === '') return pathname === `/deals/${currentDealId}` || pathname === `/deals/${currentDealId}/`;
      return pathname.includes(routePath);
    }
  }

  const NavItem = ({ route }: { route: any }) => {
    const isDeal = route.isDeal;
    const isActive = isRouteActive(route.path, isDeal)
    const href = isDeal ? `/deals/${currentDealId}${route.path}` : route.path
    
    return (
      <div className="relative group/tooltip">
        <Link
          href={href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-primary",
          )}
        >
          <route.icon
            className={cn(
              "mr-3 h-4 w-4 flex-shrink-0 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}
          />
          {route.name}
        </Link>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col border-r bg-card py-6 overflow-y-auto", mobile ? "w-full h-full" : "w-64 h-screen shrink-0")}>
      <div className="mb-6 px-6 flex flex-col gap-1">
        <Link href="/">
          <h1 className="text-xl font-bold tracking-tight text-primary">APEX<span className="text-foreground">CAPITAL</span></h1>
        </Link>
        <div className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">VC Operating System</div>
      </div>
      
      <div className="px-6 mb-4">
        <Link href="/deals/new">
          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 px-3 text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add New Deal
          </button>
        </Link>
      </div>
      
      <div className="flex-1 px-3 space-y-6">
        {menuGroups.map((group, i) => {
          // Hide deal groups if not in a deal
          if (!isDealRoute && group.routes.every(r => r.isDeal)) return null;
          
          return (
            <div key={i}>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.routes.map(route => {
                  if (route.isDeal && !isDealRoute) return null;
                  return <NavItem key={route.name} route={route} />
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-auto px-4 pb-2 pt-4">
        <div className="rounded-lg bg-muted/50 border border-border/50 p-3">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-xs font-medium text-foreground">System Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}
