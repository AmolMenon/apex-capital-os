"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DealsService } from "@/services/deals";
import { DecisionsService } from "@/services/decisions";
import { Deal } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldAlert, Target, Activity } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const deals = await DealsService.getDeals();
        if (deals && deals.length > 0) {
          setDeal(deals[0]);
          const data = await DecisionsService.getFounderHome(deals[0].id);
          setHomeData(data);
        } else {
          router.push("/onboarding");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-secondary/50 rounded animate-pulse" />
          <div className="h-4 w-96 bg-secondary/50 rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="col-span-1 h-48 bg-secondary/50 rounded-xl animate-pulse" />
          <div className="col-span-2 h-48 bg-secondary/50 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!deal || !homeData) return null;

  const wouldTakeMeeting = homeData.readiness_score >= 80;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Version {homeData.latest_version} Analysis</p>
        </div>
        {homeData.progress_since_last_upload > 0 && (
          <div className="text-sm font-medium text-success bg-success/10 px-3 py-1.5 rounded-md border border-success/20">
            +{homeData.progress_since_last_upload} points since last upload
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Readiness Core */}
        <Card className="col-span-1 bg-card border-border/50 shadow-sm flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Current Readiness
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-semibold tracking-tighter text-foreground">{homeData.readiness_score}</span>
                <span className="text-lg text-muted-foreground">/ 100</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-md ${wouldTakeMeeting ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                {homeData.verdict}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Recommendation</div>
              <div className="text-sm font-medium text-foreground">
                {wouldTakeMeeting ? "Ready to pitch. Schedule meetings." : "Do not pitch yet. Resolve execution tickets."}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution Workspace Summary */}
        <Card className="col-span-2 bg-card border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Top Execution Tickets
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                Target Score: <span className="text-foreground">{homeData.estimated_readiness_after_today}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {homeData.top_tickets && homeData.top_tickets.length > 0 ? (
                homeData.top_tickets.map((ticket: any, idx: number) => (
                  <button 
                    key={idx} 
                    className="w-full flex items-start gap-4 p-3 rounded-md hover:bg-secondary/50 transition-colors border border-transparent text-left group"
                    onClick={() => router.push('/dashboard/execution-workspace')}
                  >
                    <div className="mt-0.5 shrink-0">
                      {ticket.priority === 'High' ? <ShieldAlert className="w-4 h-4 text-destructive" /> : <Target className="w-4 h-4 text-warning" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground">{ticket.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ticket.problem || ticket.why_investors_care}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="py-8 text-center">
                  <div className="text-sm text-muted-foreground">All execution tickets resolved.</div>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/dashboard/deck')}>Upload New Version</Button>
                </div>
              )}
            </div>
            
            {homeData.top_tickets && homeData.top_tickets.length > 0 && (
              <Button variant="secondary" className="w-full mt-6 bg-secondary hover:bg-secondary/80 text-foreground border-0" onClick={() => router.push('/dashboard/execution-workspace')}>
                Open Workspace
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Biggest Risk */}
      {homeData.biggest_risk && (
        <Card className="bg-destructive/5 border-destructive/20 shadow-sm">
          <CardContent className="p-6 flex gap-4">
            <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-destructive mb-1">Biggest Current Risk</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {homeData.biggest_risk}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
