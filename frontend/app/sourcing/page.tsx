"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SourcingHQ() {
  const [theses, setTheses] = useState<any[]>([]);
  const [radar, setRadar] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [t, r, p] = await Promise.all([
          api.getTheses(),
          api.getMarketRadar(),
          api.getSourcingPipeline()
        ]);
        setTheses(t);
        setRadar(r);
        setPipeline(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Sourcing HQ...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Sourcing HQ</h1>
          <p className="text-zinc-400">Thesis-driven company discovery and market radar.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/market-radar">
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300">Open Market Radar</Button>
          </Link>
          <Link href="/sourcing/theses">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">View Thesis Map</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium">Active Theses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-indigo-400">{theses.length}</div>
            <p className="text-xs text-zinc-500 mt-2">Fund theses actively scanning markets</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium">New Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-amber-400">{radar.length}</div>
            <p className="text-xs text-zinc-500 mt-2">Market signals detected this week</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium">Sourced Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-emerald-400">{pipeline.length}</div>
            <p className="text-xs text-zinc-500 mt-2">Companies in sourcing pipeline</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Theses */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white">Active Investment Theses</h2>
          {theses.slice(0, 3).map(thesis => (
            <Card key={thesis.thesis_id} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-zinc-100">{thesis.name}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{thesis.sector_focus.join(" • ")}</p>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">
                    {thesis.stage_preference[0]}
                  </Badge>
                </div>
                <div className="flex gap-3 mt-6">
                  <Link href={`/sourcing/theses/${thesis.thesis_id}`}>
                    <Button variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* High Priority Pipeline */}
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white">High-Priority Sourced Leads</h2>
          {pipeline.slice(0, 4).map(item => (
            <div key={item.item_id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div>
                <Link href={`/sourcing/companies/${item.company_id}`} className="text-indigo-400 hover:underline font-medium">
                  {item.company_name}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                  <span>{item.thesis_name}</span>
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                  <span>Score: {item.sourcing_score}</span>
                </div>
              </div>
              <Badge className={item.status === "Watchlist" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
