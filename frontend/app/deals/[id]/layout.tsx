import Link from "next/link"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import { AlertTriangle } from "lucide-react"
import { redirect } from "next/navigation"
import { GlobalDealProvider } from "@/components/GlobalDealProvider"
import { AutonomousSidebar } from "@/components/AutonomousSidebar"
import { DealNavigation } from "@/components/ui/DealNavigation"

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
    <GlobalDealProvider dealId={id}>
      <div className="flex-1 flex min-h-0 bg-background overflow-hidden">
        {/* Left Sidebar */}
        <AutonomousSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Top Navigation */}
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-20">
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/pipeline" className="text-muted-foreground hover:text-foreground">← Back to Pipeline</Link>
            </nav>
            <DealNavigation id={id} />
          </div>

          {/* Page Content */}
          <div className="flex-1 p-6 lg:p-8 bg-transparent relative z-10 max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </GlobalDealProvider>
  )
}
