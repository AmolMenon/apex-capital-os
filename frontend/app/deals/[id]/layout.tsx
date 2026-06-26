import Link from "next/link"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { DealWorkflowStatusBar } from "@/components/ui/DealWorkflowStatusBar"
import { DealTopStatusBar } from "@/components/ui/DealTopStatusBar"
import { DealNavigation } from "@/components/ui/DealNavigation"
import { DealProvider } from "@/components/DealProvider"
import { Play, AlertTriangle } from "lucide-react"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function DealLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let id = resolvedParams.id;
  
  let deal: Deal | null = null;
  try {
    if (id === 'active') {
      try {
        const d = await api.getSelectedDeal();
        if (d) {
          redirect(`/deals/${d.id}/deal-room`);
        } else {
          redirect(`/deals/demo/deal-room`);
        }
      } catch(e) {
        // Fallback for demo when backend is down
        redirect(`/deals/demo/deal-room`);
      }
    } else {
      try {
        deal = await api.getDeal(id);
      } catch(e) {
        console.error("Failed to load deal on server. ID:", id, "Error:", e);
      }
    }
  } catch (e) {
    console.error("Failed to process layout logic.", e);
  }
  


  if (!deal && id !== 'active') {
    return (
      <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-red-500/10 p-6 rounded-full">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Deal Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The deal you are looking for does not exist or you don't have permission to view it.
          </p>
        </div>
        <Link href="/pipeline">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">Return to Pipeline</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Top Header */}
      <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between bg-black/20 backdrop-blur-md relative z-10">
        <nav className="flex items-center gap-4 text-sm font-medium">
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
      <DealNavigation id={id} />

      {/* Page Content */}
      <DealProvider deal={deal}>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent relative z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </DealProvider>
    </div>
  )
}
