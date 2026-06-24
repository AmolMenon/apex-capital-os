with open("frontend/components/Sidebar.tsx", "r") as f:
    content = f.read()

import re

# Update Sidebar.tsx imports and routes
replacement = """
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useScreenshotMode } from "@/components/ScreenshotProvider"
import { 
  LayoutDashboard, FilePlus, Database, Bookmark, BookOpen, Settings, PlayCircle,
  Briefcase, Search, Presentation, Activity, FileText, CheckSquare, MessageSquare, Users, Target, ShieldAlert, Cpu, ListTree
} from "lucide-react"

const overviewRoutes = [
  { name: "Getting Started", path: "/getting-started", icon: BookOpen },
  { name: "Command Center", path: "/command-center", icon: LayoutDashboard },
  { name: "Demo Control Center", path: "/demo-control-center", icon: PlayCircle },
  { name: "Feature Map", path: "/feature-map", icon: ListTree },
  { name: "Investor Walkthrough", path: "/walkthrough", icon: Presentation },
]

const dealFlowRoutes = [
  { name: "Pipeline", path: "/pipeline", icon: Bookmark },
  { name: "Compare Deals", path: "/compare", icon: Database },
  { name: "Decision Board", path: "/decision-board", icon: Activity },
  { name: "Real Benchmarks", path: "/real-benchmarks", icon: Target },
  { name: "New Deal", path: "/new", icon: FilePlus },
]

const intelligenceRoutes = [
  { name: "Research Intelligence", path: "/research", icon: Search, isDeal: true },
  { name: "Deck Intelligence", path: "/deck", icon: Presentation, isDeal: true },
  { name: "Web Research", path: "/web-research", icon: Search, isDeal: true },
  { name: "Conversation Intelligence", path: "/conversations", icon: MessageSquare, isDeal: true },
  { name: "Agent Workflow", path: "/agent-workflow", icon: Cpu, isDeal: true },
]

const diligenceRoutes = [
  { name: "Diligence Command Center", path: "/diligence", icon: Activity, isDeal: true },
  { name: "Evidence Center", path: "/evidence-center", icon: Database, isDeal: true },
  { name: "Red Team Room", path: "/red-team", icon: ShieldAlert, isDeal: true },
  { name: "Partner Review", path: "/partner-review", icon: Users, isDeal: true },
  { name: "Founder Email", path: "/founder-email", icon: FileText, isDeal: true },
  { name: "Reference Script", path: "/customer-reference-script", icon: FileText, isDeal: true },
]

const investmentOutputsRoutes = [
  { name: "Decision Engine", path: "/decision", icon: Activity, isDeal: true },
  { name: "Fund Fit", path: "/fund-fit", icon: Target, isDeal: true },
  { name: "Memo", path: "/memo", icon: FileText, isDeal: true },
  { name: "IC One-Pager", path: "/ic-one-pager", icon: CheckSquare, isDeal: true },
  { name: "IC Packet Builder", path: "/ic-packet", icon: FileText, isDeal: true },
]

const systemRoutes = [
  { name: "Fund Strategy", path: "/fund", icon: Activity },
  { name: "Methodology", path: "/methodology", icon: BookOpen },
  { name: "System Status", path: "/system-status", icon: Activity },
  { name: "Settings", path: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isScreenshotMode } = useScreenshotMode()

  const segments = pathname.split('/').filter(Boolean)
  const isDealRoute = segments[0] === 'deal' || segments[0] === 'deals'
  // Default to 1 (Sarvam AI) if no deal is selected
  const currentDealId = (isDealRoute && segments.length >= 2) ? segments[1] : "1"

  if (isScreenshotMode) return null;

  // Helper to check if route is active
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
    // Removed isDisabled constraint; defaults to deal 1
    const href = isDeal ? `/deal/${currentDealId}${route.path}` : route.path
    
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
      <div className="mb-6 px-6">
        <Link href="/">
          <h1 className="text-xl font-bold tracking-tight text-primary">APEX<span className="text-foreground">CAPITAL</span></h1>
        </Link>
      </div>
      
      <div className="flex-1 px-3 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Overview
          </div>
          <div className="space-y-0.5">
            {overviewRoutes.map(route => <NavItem key={route.path} route={route} />)}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Deal Flow
          </div>
          <div className="space-y-0.5">
            {dealFlowRoutes.map(route => <NavItem key={route.path} route={route} />)}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Intelligence
          </div>
          <div className="space-y-0.5">
            <NavItem route={{ name: "Deal Room", path: "/deal-room", icon: Briefcase, isDeal: true }} />
            {intelligenceRoutes.map(route => <NavItem key={route.path} route={route} />)}
          </div>
        </div>
        
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Diligence
          </div>
          <div className="space-y-0.5">
            {diligenceRoutes.map(route => <NavItem key={route.path} route={route} />)}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Investment Outputs
          </div>
          <div className="space-y-0.5">
            {investmentOutputsRoutes.map(route => <NavItem key={route.path} route={route} />)}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            System
          </div>
          <div className="space-y-0.5">
            {systemRoutes.map(route => <NavItem key={route.path} route={route} />)}
          </div>
        </div>
      </div>

      <div className="mt-auto px-4 pb-2 pt-4">
        <div className="rounded-lg bg-muted/50 border border-border/50 p-3">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-xs font-medium text-foreground">Mock + Fallback Ready</p>
          </div>
        </div>
      </div>
    </div>
  )
}
"""

content = re.sub(r'import Link from "next/link".*', replacement, content, flags=re.DOTALL)

with open("frontend/components/Sidebar.tsx", "w") as f:
    f.write(content)
