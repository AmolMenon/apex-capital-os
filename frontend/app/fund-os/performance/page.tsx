"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, AlertCircle, Info } from "lucide-react";

export default function FundPerformancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getFundPerformance();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Fund Performance...</div>;
  if (!data) return <div className="p-8 text-white">Failed to load data.</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-6">
        <Link href="/fund-os" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Fund Performance</h1>
          <p className="text-zinc-400">Track high-level MOIC, TVPI, DPI, and deployment figures.</p>
        </div>
      </div>

      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-8 flex gap-3">
        <Info className="w-5 h-5 text-indigo-400 mt-0.5" />
        <div>
          <h3 className="text-indigo-400 font-medium mb-1">Data Quality Note</h3>
          <p className="text-indigo-400/80 text-sm">
            Confidence: <span className="font-semibold">{data.data_confidence}</span>. Fund performance figures are demo calculations unless connected to verified fund accounting data via integration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-zinc-400 font-medium text-sm mb-2">Gross MOIC</h3>
            <div className="text-4xl font-light text-emerald-400">{data.gross_moic}x</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-zinc-400 font-medium text-sm mb-2">TVPI</h3>
            <div className="text-4xl font-light text-indigo-400">{data.tvpi}x</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-zinc-400 font-medium text-sm mb-2">DPI</h3>
            <div className="text-4xl font-light text-zinc-300">{data.dpi}x</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-zinc-400 font-medium text-sm mb-2">RVPI</h3>
            <div className="text-4xl font-light text-zinc-300">{data.rvpi}x</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium text-lg">Capital Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-sm font-medium text-zinc-300">Committed Capital</span>
              <span className="text-sm text-white">{(data.committed_capital / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-sm font-medium text-zinc-300">Called Capital</span>
              <span className="text-sm text-white">{(data.called_capital / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-sm font-medium text-emerald-400">Deployed Capital</span>
              <span className="text-sm text-emerald-400">{(data.deployed_capital / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-sm font-medium text-amber-400">Reserved Capital</span>
              <span className="text-sm text-amber-400">{(data.reserved_capital / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-400">Remaining Dry Powder</span>
              <span className="text-sm text-zinc-400">{(data.remaining_dry_powder / 10000000).toFixed(1)} Cr</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 font-medium text-lg">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-sm font-medium text-zinc-300">Unrealized Value</span>
              <span className="text-sm text-white">{(data.unrealized_value / 10000000).toFixed(1)} Cr</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-sm font-medium text-zinc-300">Realized Value</span>
              <span className="text-sm text-white">{data.realized_value === 0 ? "0.0 Cr" : (data.realized_value / 10000000).toFixed(1) + " Cr"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-sm font-medium text-zinc-300">Marked Up Companies</span>
              <Badge className="bg-emerald-500/10 text-emerald-400">{data.marked_up_companies}</Badge>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-sm font-medium text-zinc-300">Marked Down Companies</span>
              <Badge className="bg-rose-500/10 text-rose-400">{data.marked_down_companies}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-400">Weighted Average Ownership</span>
              <span className="text-sm text-zinc-400">{data.weighted_average_ownership}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
