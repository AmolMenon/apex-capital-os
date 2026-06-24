"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, AlertCircle } from "lucide-react";

export default function ReservesHQ() {
  const [reserves, setReserves] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getPortfolioReserves();
        setReserves(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Reserve Allocation...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Reserve Allocation Engine</h1>
          <p className="text-zinc-400">Dynamic capital allocation based on portfolio health and follow-on conviction.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-medium">Total Reserves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-white">{reserves?.total_reserves || "$0M"}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-medium">Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-indigo-400">{reserves?.allocated || "$0M"}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-medium">Remaining Dry Powder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light text-emerald-400">{reserves?.remaining || "$0M"}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-medium text-white border-b border-zinc-800 pb-2">Allocations</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reserves?.allocations.map((alloc: any, i: number) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">{alloc.company_id.replace('comp-', '').toUpperCase()}</h3>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm font-medium text-zinc-300">Reserved: {alloc.current_allocation}</span>
                    </div>
                  </div>
                  <Badge className={
                    alloc.recommended_action.includes("Increase") ? "bg-emerald-500/10 text-emerald-500" :
                    alloc.recommended_action.includes("Release") ? "bg-rose-500/10 text-rose-500" :
                    "bg-zinc-800 text-zinc-300"
                  }>
                    {alloc.status}
                  </Badge>
                </div>

                <div className="mt-6 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-indigo-400" />
                    Recommendation
                  </h4>
                  <p className="text-sm text-zinc-400 mb-3">{alloc.recommended_action}</p>
                  <p className="text-xs text-zinc-500 italic">Rationale: {alloc.rationale}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
