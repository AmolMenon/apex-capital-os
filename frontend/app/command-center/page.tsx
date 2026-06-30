"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { api } from "@/lib/api"
import { Deal } from "@/types"
import { 
  ArrowRight, Zap, Target, Activity,
  Clock, AlertCircle, Calendar,
  Filter, Plus, Inbox, FileText, CheckCircle2, AlertTriangle
} from "lucide-react"
import { motion } from "framer-motion"

export default function CommandCenter() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDeals()
        setDeals(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center space-x-2">
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce" />
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-75" />
      <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-150" />
    </div>
  )

  const priorityDeals = deals.slice(0, 3);
  const highestConviction = deals.reduce((max, d) => (d.health_score || 0) > (max.health_score || 0) ? d : max, deals[0]);
  const highestRisk = deals.reduce((min, d) => (d.health_score || 100) < (min.health_score || 100) ? d : min, deals[0]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-background min-h-screen pb-20"
    >
      
      {/* Top Header */}
      <div className="border-b bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Investment Command Center</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Welcome back. 3 deals require immediate attention.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="shadow-sm"><Filter className="w-4 h-4 mr-2" /> Views</Button>
            <Link href="/deals/new">
              <Button size="sm" className="shadow-sm"><Plus className="w-4 h-4 mr-2" /> New Deal</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Highlight Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Highest Conviction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold">{highestConviction?.startup_name || 'N/A'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{highestConviction?.sector || 'AI'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-emerald-500">{highestConviction?.health_score || 94}</span>
                    <span className="text-xs text-muted-foreground block">Health Score</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-500/20 bg-rose-500/5 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Highest Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold">{highestRisk?.startup_name || 'N/A'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Churn spike detected</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-rose-500">{highestRisk?.health_score || 42}</span>
                    <span className="text-xs text-muted-foreground block">Health Score</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Priority Queue */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Inbox className="w-5 h-5 text-indigo-500" /> Priority Queue
              </CardTitle>
              <CardDescription>Deals requiring your immediate review</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {priorityDeals.map((deal, i) => (
                  <div key={deal.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <div>
                        <Link href={`/deals/${deal.id}/deal-room`} className="font-semibold hover:underline">
                          {deal.startup_name}
                        </Link>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] py-0">{deal.stage || 'Seed'}</Badge>
                          {i === 0 ? 'Technical Diligence overdue' : 'Partner notes requested'}
                        </p>
                      </div>
                    </div>
                    <Link href={`/deals/${deal.id}/deal-room`}>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Snapshot */}
          <Card className="shadow-sm tour-pipeline-status">
            <CardHeader className="border-b bg-muted/20 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" /> Pipeline Status
                </CardTitle>
              </div>
              <Link href="/pipeline">
                <Button variant="link" className="text-muted-foreground h-auto p-0">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-2xl font-bold">24</span>
                  <p className="text-sm text-muted-foreground">Sourcing</p>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-bold">12</span>
                  <p className="text-sm text-muted-foreground">Evaluating</p>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-indigo-500">4</span>
                  <p className="text-sm text-muted-foreground font-medium">Deep Diligence</p>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-emerald-500">2</span>
                  <p className="text-sm text-muted-foreground font-medium">IC Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Upcoming IC Meetings */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" /> Upcoming IC Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-lg bg-muted flex flex-col items-center justify-center shrink-0 border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Nov</span>
                  <span className="text-sm font-bold">12</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Partner Review: {highestConviction?.startup_name || 'Acme'}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">2:00 PM - 3:30 PM</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-lg bg-muted flex flex-col items-center justify-center shrink-0 border opacity-60">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Nov</span>
                  <span className="text-sm font-bold">15</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Deep Dive: Data infrastructure</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">10:00 AM - 11:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analyst Workload */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> Analyst Workload
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2"><Avatar className="w-5 h-5"><AvatarFallback className="text-[9px]">DA</AvatarFallback></Avatar> David</span>
                  <span className="text-muted-foreground">4 Active Deals</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-rose-500"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2"><Avatar className="w-5 h-5"><AvatarFallback className="text-[9px]">SA</AvatarFallback></Avatar> Sarah</span>
                  <span className="text-muted-foreground">2 Active Deals</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="w-[40%] h-full bg-emerald-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm tour-activity-feed">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border bg-background text-emerald-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ml-[11px] md:ml-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border bg-card shadow-sm ml-4 md:ml-0 group-hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs">Partner Request</span>
                    <span className="text-[9px] text-muted-foreground font-mono">1h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">IC Memo diligence requested for {priorityDeals[1]?.startup_name || 'NexusAI'}</p>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border bg-background text-indigo-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ml-[11px] md:ml-0">
                  <FileText className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border bg-card shadow-sm ml-4 md:ml-0 group-hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs">Founder Update</span>
                    <span className="text-[9px] text-muted-foreground font-mono">3h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">New Q3 financial model uploaded to Data Room.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </motion.div>
  )
}
