"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Briefcase, ArrowRight } from "lucide-react"
import { DealsService } from "@/services/deals"
import { Deal } from "@/types"

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDeals() {
      try {
        const data = await DealsService.getDeals();
        setDeals(data || []);
      } catch (error: any) {
        console.error("Failed to fetch deals:", error);
        setError("Unable to connect to the Investment OS backend.");
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
        <Activity className="w-8 h-8 animate-pulse text-primary mb-4" />
        <p className="font-medium tracking-wide">Connecting to Workspace...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Investment Workbench</h1>
          <p className="text-muted-foreground text-lg mt-1">Active deals and attention queue</p>
        </div>
        <Link href="/deals/new">
          <Button className="font-bold">New Deal</Button>
        </Link>
      </div>

      {error ? (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Activity className="w-10 h-10 text-destructive mb-4" />
            <h3 className="text-lg font-bold text-destructive mb-2">Connection Error</h3>
            <p className="text-sm text-destructive/80 max-w-md">{error}</p>
          </CardContent>
        </Card>
      ) : deals.length === 0 ? (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">No Active Deals</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Your pipeline is currently empty. Add a new deal to begin the investment analysis workflow.
            </p>
            <Link href="/deals/new">
              <Button>Source New Deal</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deals.map(deal => (
            <Card key={deal.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row p-5 gap-6 items-center">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold">{deal.startup_name || `Deal ${deal.id}`}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border">
                      {deal.stage || "Review"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {deal.description || "No description available."}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 border-l pl-6 min-w-[200px]">
                  <Link href={`/deals/${deal.id}`} className="w-full">
                    <Button variant="secondary" className="w-full font-bold">
                      Open Workspace <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
