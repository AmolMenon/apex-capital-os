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

const primaryRoutes = [
  { name: "Home", path: "/", icon: LayoutDashboard, isDeal: false },
  { name: "Demo Script", path: "/demo-script", icon: Play, isDeal: false },
  { name: "Deal Inbox", path: "/deal-inbox", icon: Inbox, isDeal: false },
  { name: "Pipeline", path: "/pipeline", icon: Bookmark, isDeal: false },
  { name: "Deal Room", path: "/deal-room", icon: Briefcase, isDeal: true },
  { name: "Evidence Center", path: "/evidence-center", icon: Database, isDeal: true },
  { name: "War Room", path: "/war-room", icon: Users, isDeal: true },
  { name: "Copilot", path: "/copilot", icon: MessageSquare, isDeal: true },
  { name: "Decision Engine", path: "/decision", icon: Activity, isDeal: true },
  { name: "IC Packet", path: "/ic-packet", icon: FileText, isDeal: true },
  { name: "Trust Center", path: "/trust-center", icon: ShieldCheck, isDeal: false },
  { name: "Operations", path: "/operations", icon: CheckSquare, isDeal: false },
  { name: "Settings", path: "/settings", icon: Settings, isDeal: false },
]

const advancedRoutes = [
  { name: "Data Room", path: "/data-room", icon: Folder, isDeal: true },
  { name: "Meeting Intelligence", path: "/meetings", icon: Presentation, isDeal: false },
  { name: "Knowledge Graph", path: "/knowledge-graph", icon: Network, isDeal: false },
  { name: "Playbooks", path: "/playbooks", icon: BookOpen, isDeal: false },
  { name: "Portfolio", path: "/portfolio", icon: PieChart, isDeal: false },
  { name: "Fund OS", path: "/fund-os", icon: Activity, isDeal: false },
  { name: "Decision Lab", path: "/decision-lab", icon: FlaskConical, isDeal: false },
  { name: "Deal Structuring", path: "/deal-structuring", icon: Calculator, isDeal: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isScreenshotMode } = useScreenshotMode()
  const [advancedOpen, setAdvancedOpen] = useState(false)

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
      return pathname.includes(routePath);
    }
  }

  const NavItem = ({ route }: { route: any }) => {
    const isDeal = route.isDeal;
    const isActive = isRouteActive(route.path, isDeal)
    const href = isDeal ? `/deals/${currentDealId}${route.path.replace('/deal-room', '')}` : route.path
    
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
    <div className="flex h-screen w-64 flex-col border-r bg-card py-6 overflow-y-auto">
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
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Primary
          </div>
          <div className="space-y-0.5">
            {primaryRoutes.map(route => <NavItem key={route.name} route={route} />)}
          </div>
        </div>

        <div>
          <button 
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <span>Advanced Modules</span>
            {advancedOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          
          {advancedOpen && (
            <div className="space-y-0.5 mt-1 border-l-2 border-muted ml-3 pl-2">
              {advancedRoutes.map(route => <NavItem key={route.name} route={route} />)}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto px-4 pb-2 pt-4">
        <div className="rounded-lg bg-muted/50 border border-border/50 p-3">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-xs font-medium text-foreground">9/10 Flagship Demo Mode</p>
          </div>
        </div>
      </div>
    </div>
  )
}
