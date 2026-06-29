"use client";

import { useGlobalPortfolio } from "@/components/GlobalPortfolioProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateDealHealth } from "@/lib/deal-logic";
import Link from "next/link";
import { Target, Activity, CheckCircle, Clock } from "lucide-react";

import { LiveActivityFeed } from "@/components/LiveActivityFeed";

export default function Dashboard() {
  const { deals, loading } = useGlobalPortfolio();

  if (loading) {
    return <div className="p-12 text-center animate-pulse">Loading Portfolio Command Center...</div>;
  }

  // Filter out deals that are "Passed" or "Archived" if we only want active deals
  const activeDeals = deals.filter(d => d.status !== 'Passed' && d.status !== 'Archived');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Command Center</h1>
        <p className="text-muted-foreground mt-2">Firm-wide pipeline overview and active deal intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-primary">
              <Activity className="w-4 h-4 mr-2" /> Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeDeals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" /> In Diligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deals.filter(d => d.status === 'Due Diligence' || d.status === 'Research').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
              <Target className="w-4 h-4 mr-2" /> IC Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deals.filter(d => d.status === 'Investment Committee').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-muted-foreground">
              <CheckCircle className="w-4 h-4 mr-2" /> Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deals.filter(d => d.status === 'Approved').length}</div>
          </CardContent>
        </Card>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">Active Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeDeals.map(deal => {
              const health = calculateDealHealth(deal);
              const score = deal.analysis?.explainable_score?.confidence_score || health.score;
              
              return (
                <Link key={deal.id} href={`/deals/${deal.id}/deal-room`}>
                  <Card className="hover:shadow-lg transition-shadow border-border hover:border-primary/50 cursor-pointer h-full flex flex-col">
                    <CardHeader className="pb-3 border-b border-border/50">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{deal.startup_name}</CardTitle>
                        <Badge variant="outline" className="bg-muted">
                          {deal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{deal.sector} &bull; {deal.stage}</p>
                    </CardHeader>
                    <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Conviction Score</span>
                          <span className={`font-bold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {score}/100
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Recommendation</span>
                          <span className="text-sm font-medium text-foreground line-clamp-1">{health.recommendation}</span>
                        </div>
                        
                        <div className="mt-4">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Critical Risk</span>
                          <span className="text-sm text-destructive line-clamp-2">{health.mainBlocker || "None identified"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
        <div className="lg:col-span-1 h-[800px]">
          <LiveActivityFeed />
        </div>
      </div>
    </div>
  );
}
