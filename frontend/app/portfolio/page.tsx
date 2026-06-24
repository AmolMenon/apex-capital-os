"use client";

import { OperationsPanel } from "@/components/OperationsPanel";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PortfolioHQ() {
  const [health, setHealth] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [h, c] = await Promise.all([
          api.getPortfolioHealth(),
          api.getPortfolioCompanies()
        ]);
        setHealth(h);
        setCompanies(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Portfolio HQ...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Portfolio Intelligence</h1>
          <p className="text-zinc-400">Firm-wide post-investment monitoring, risk detection, and value creation.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/portfolio/reserves">
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300">View Reserves</Button>
          </Link>
          <Link href="/portfolio/lp-report">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">Generate LP Report</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium text-sm">Active Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-indigo-400">{health?.active_companies || 0}</div>
            <p className="text-xs text-zinc-500 mt-2">Total portfolio size: {health?.total_companies}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium text-sm" title="Weighted average of all active company health scores. Based on revenue growth, burn multiple, and team retention.">Average Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-emerald-400">{health?.average_health_score || 0} / 100</div>
            <p className="text-xs text-zinc-500 mt-2">Weighted average based on burn, growth & talent.</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium text-sm" title="Companies with conviction score > 75, ready for pro-rata or super pro-rata allocation.">Follow-on Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-amber-400">{health?.follow_on_candidates || 0}</div>
            <p className="text-xs text-zinc-500 mt-2">Conviction score &gt; 75 for pro-rata.</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium text-sm" title="Companies with health score < 50 or negative founder sentiment updates.">Needs Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-rose-400">{health?.companies_needing_support || 0}</div>
            <p className="text-xs text-zinc-500 mt-2">Health &lt; 50 or critical board risks detected.</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium text-white">Portfolio Roster</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <Card key={company.company_id} className="bg-zinc-900 border-zinc-800 flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-100">{company.name}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{company.sector}</p>
                  </div>
                  <Badge className={
                    company.portfolio_status === 'active' ? "bg-emerald-500/10 text-emerald-500" :
                    company.portfolio_status === 'follow_on_candidate' ? "bg-amber-500/10 text-amber-500" :
                    company.portfolio_status === 'watchlist' ? "bg-rose-500/10 text-rose-500" :
                    "bg-indigo-500/10 text-indigo-500"
                  }>
                    {company.portfolio_status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                
                <div className="mt-auto pt-6 border-t border-zinc-800">
                  <Link href={`/portfolio/companies/${company.company_id}`}>
                    <Button variant="secondary" className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">
                      View Intelligence Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
