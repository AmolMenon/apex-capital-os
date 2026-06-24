"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Map, Target, AlertTriangle, TrendingUp } from "lucide-react";

export default function FundConstructionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getFundConstruction();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Fund Construction...</div>;
  if (!data) return <div className="p-8 text-white">Failed to load data.</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-6">
        <Link href="/fund-os" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Fund Construction Modeling</h1>
          <p className="text-zinc-400">Track target portfolio deployment against actuals and reserve modeling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-zinc-400 font-medium mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Target vs Actual Deployed
            </h3>
            <div className="flex justify-between items-end mb-2">
              <div className="text-3xl font-light text-white">{(data.actual_portfolio_model.total_initial_deployed / 10000000).toFixed(1)} Cr</div>
              <div className="text-sm text-zinc-500 mb-1">Target: {(data.target_portfolio_model.total_initial_deployment / 10000000).toFixed(1)} Cr</div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(data.actual_portfolio_model.total_initial_deployed / data.target_portfolio_model.total_initial_deployment) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-zinc-400 font-medium mb-4 flex items-center gap-2">
              <Map className="w-4 h-4 text-emerald-400" /> Target vs Actual Assets
            </h3>
            <div className="flex justify-between items-end mb-2">
              <div className="text-3xl font-light text-white">{data.actual_portfolio_model.current_companies}</div>
              <div className="text-sm text-zinc-500 mb-1">Target: {data.target_portfolio_model.min_companies}-{data.target_portfolio_model.max_companies}</div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(data.actual_portfolio_model.current_companies / data.target_portfolio_model.max_companies) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-zinc-400 font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Reserve Allocation
            </h3>
            <div className="flex justify-between items-end mb-2">
              <div className="text-3xl font-light text-white">{data.reserve_allocation.actual_reserves_held_pct}% Held</div>
              <div className="text-sm text-zinc-500 mb-1">Target: {data.reserve_allocation.planned_reserves_pct}%</div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 flex overflow-hidden">
              <div className="bg-amber-500 h-2" style={{ width: `${data.reserve_allocation.actual_reserves_held_pct}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium text-lg">Sector Exposure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(data.sector_exposure).map(([sector, info]: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="text-sm font-medium text-white capitalize">{sector}</div>
                  <div className="text-xs text-zinc-500">Target: {info.target}%</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-white font-medium">{info.actual}%</div>
                  <Badge variant="outline" className={
                    info.status === 'Overweight' ? 'border-amber-500/50 text-amber-400' :
                    info.status === 'Underweight' ? 'border-rose-500/50 text-rose-400' :
                    'border-emerald-500/50 text-emerald-400'
                  }>
                    {info.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-500 font-medium text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Concentration Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-light text-white mb-2">{data.concentration_risk.top_3_assets_pct}%</div>
              <p className="text-sm text-zinc-400">Deployed capital in Top 3 assets.</p>
              <p className="text-sm text-amber-400/90 mt-4 bg-amber-500/10 p-3 rounded">
                {data.concentration_risk.warning}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-zinc-100 font-medium text-lg">Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.gaps_vs_target.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-sm text-zinc-300">
                    <div className="mt-0.5"><Target className="w-4 h-4 text-indigo-400" /></div>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
