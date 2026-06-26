import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/EmptyState"
import { Database, ArrowRight, ShieldCheck, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calculateDealHealth, calculateCompletionScore } from "@/lib/deal-logic"
import { Progress } from "@/components/ui/progress"

export const dynamic = "force-dynamic"

export default async function Pipeline({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const resolvedParams = await searchParams;
  let deals: Deal[] = []
  let sourcingPipeline: any[] = []
  let fetchError: string | null = null;
  
  try {
    const [d, s] = await Promise.all([
      api.getDeals(),
      api.getSourcingPipeline()
    ]);
    deals = d;
    sourcingPipeline = s;
  } catch (e: any) {
    console.error("Failed to fetch data", e)
    fetchError = e.message || "Failed to connect to the backend server.";
  }

  const currentFilter = resolvedParams.filter || "all"

  // We convert sourced items to a deal-like object for unified rendering
  const sourcedItemsAsDeals = sourcingPipeline.map(item => ({
    id: item.company_id,
    startup_name: item.company_name,
    sector: item.thesis_name,
    stage: "Unknown",
    deal_type: "sourced_lead",
    is_public_benchmark: false,
    converted_from_sourcing: item.status === "Converted to Deal",
    sourcing_score: item.sourcing_score,
    sourcing_status: item.status,
    sourcing_next_action: item.next_action,
    _raw_sourcing: item
  }));

  const allItems = [...deals, ...sourcedItemsAsDeals];

  const filteredItems = allItems.filter(d => {
    if (currentFilter === "demo") return d.deal_type === "demo"
    if (currentFilter === "benchmark") return d.deal_type === "real_benchmark" || d.is_public_benchmark
    if (currentFilter === "user") return d.deal_type === "user" || ["Primary", "Secondary", "M&A", "Other"].includes(d.deal_type || "")
    if (currentFilter === "sourced") return d.deal_type === "sourced_lead" && !(d as any).converted_from_sourcing
    if (currentFilter === "converted") return d.deal_type === "sourced_lead" && (d as any).converted_from_sourcing
    return true
  })

  return (
    <div className="container py-8 max-w-7xl mx-auto space-y-6 px-4 md:px-8">
      {fetchError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheck className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Backend Connection Failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>The frontend could not connect to the backend server. If you are on Render, this usually means:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>You forgot to set <strong>NEXT_PUBLIC_API_URL</strong> to your backend's URL.</li>
                  <li>You set the variable, but forgot to do a <strong>Manual Deploy &rarr; Clear build cache & deploy</strong> on the frontend.</li>
                  <li>Your backend is currently down or waking up from sleep.</li>
                </ul>
                <p className="mt-2 font-mono bg-red-100 p-2 rounded text-xs">{fetchError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Deal Pipeline</h2>
          <p className="text-muted-foreground mt-1">All sourced and active opportunities.</p>
        </div>
        <Link href="/deals/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            Add New Deal
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Link href="?filter=all">
          <Badge variant={currentFilter === "all" ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3">All Deals</Badge>
        </Link>
        <Link href="?filter=demo">
          <Badge variant={currentFilter === "demo" ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3">Active Deals</Badge>
        </Link>
        <Link href="?filter=benchmark">
          <Badge variant={currentFilter === "benchmark" ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3">Real Benchmarks</Badge>
        </Link>
        <Link href="?filter=user">
          <Badge variant={currentFilter === "user" ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3">User Uploads</Badge>
        </Link>
        <Link href="?filter=sourced">
          <Badge variant={currentFilter === "sourced" ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3 border-indigo-500/50 text-indigo-400">Sourced Leads</Badge>
        </Link>
        <Link href="?filter=converted">
          <Badge variant={currentFilter === "converted" ? "default" : "outline"} className="cursor-pointer text-sm py-1 px-3 border-emerald-500/50 text-emerald-400">Converted from Sourcing</Badge>
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Opportunities</CardTitle>
          <CardDescription>Comprehensive list of startups evaluated by Apex Capital.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <EmptyState 
              title="Pipeline Empty" 
              description="No deals found for this filter."
              icon={<Database className="h-6 w-6" />}
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Company & Status</TableHead>
                    <TableHead className="font-semibold text-center">Score / IC</TableHead>
                    <TableHead className="font-semibold text-center w-32">Completion</TableHead>
                    <TableHead className="font-semibold">Main Blocker</TableHead>
                    <TableHead className="font-semibold text-right">Next Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map(deal => {
                    const isSourcedLead = deal.deal_type === "sourced_lead";
                    const isConverted = isSourcedLead && (deal as any).converted_from_sourcing;
                    
                    let health: any = { recommendation: "Pending", apexScore: "-", icReadiness: 0, mainBlocker: "-", nextActionTitle: "View Profile", nextActionHref: `/deals/${deal.id}/deal-room` };
                    let completion = 0;
                    
                    if (isSourcedLead) {
                      health.apexScore = (deal as any).sourcing_score;
                      health.recommendation = (deal as any).sourcing_status;
                      health.mainBlocker = "Requires Sourcing Conversion";
                      health.nextActionTitle = "Sourced Profile";
                      health.nextActionHref = `/sourcing/companies/${deal.id}`;
                      completion = isConverted ? 100 : 25;
                      
                      if (isConverted) {
                        health.mainBlocker = "Converted to full deal";
                        health.nextActionTitle = "Deal Room";
                        health.nextActionHref = `/deals/${deal.id}/deal-room`;
                      }
                    } else {
                      health = calculateDealHealth(deal as Deal);
                      completion = calculateCompletionScore(deal as Deal);
                    }

                    const isBenchmark = deal.is_public_benchmark || deal.deal_type === "real_benchmark"
                    
                    return (
                    <TableRow key={deal.id} className="group hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground align-top pt-4">
                        <div className="font-bold text-base flex items-center gap-2">
                          {deal.startup_name}
                          {isBenchmark && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-2 text-[10px] py-0"><ShieldCheck className="w-3 h-3 mr-1" /> Public Benchmark</Badge>}
                          {isSourcedLead && !isConverted && <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 ml-2 text-[10px] py-0"><Map className="w-3 h-3 mr-1" /> Pre-Deal Lead</Badge>}
                          {isConverted && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 ml-2 text-[10px] py-0">Converted Deal</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 mb-2">{deal.sector} • {deal.stage}</div>
                        {isSourcedLead ? (
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">{health.recommendation}</Badge>
                        ) : (
                          <StatusBadge status={health.recommendation} />
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center align-top pt-4 space-y-2">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-muted-foreground">{isSourcedLead ? "Sourcing Score" : "Apex Score"}</div>
                          <div className="font-bold text-lg text-indigo-600">{health.apexScore}</div>
                        </div>
                        {!isSourcedLead && (
                          <div>
                            <div className="text-[10px] uppercase font-bold text-muted-foreground">IC Ready</div>
                            <div className="font-bold text-sm text-primary">{health.icReadiness}%</div>
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center align-top pt-4">
                        <div className="text-sm font-bold mb-2">{completion}%</div>
                        <Progress value={completion} className="h-2" />
                        <div className="text-[10px] text-muted-foreground mt-2">{completion === 100 ? "Ready" : (isSourcedLead ? "Pre-Diligence" : "In Progress")}</div>
                      </TableCell>

                      <TableCell className="align-top pt-4">
                        <div className="text-sm bg-muted/50 text-muted-foreground border border-muted p-2 rounded max-w-xs">
                          {health.mainBlocker}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right align-top pt-4">
                        <div className="flex flex-col items-end gap-2">
                          <Link href={health.nextActionHref}>
                            <Button size="sm" className="w-full sm:w-auto font-semibold bg-indigo-600 hover:bg-indigo-700">
                              {health.nextActionTitle} <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                          </Link>
                          {(!isSourcedLead || isConverted) && (
                            <Link href={`/deals/${deal.id}/deal-room`}>
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                Open Deal Room
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
