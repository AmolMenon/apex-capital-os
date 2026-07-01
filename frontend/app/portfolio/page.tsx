"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PortfolioRevenueChart, PortfolioSectorChart } from "@/components/PortfolioCharts";
import { LineChart, PieChart, TrendingUp, Activity, DollarSign, Target, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { DataTable } from "@/components/ui/DataTable";
import { columns } from "./columns";

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

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8 bg-zinc-950 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-full min-h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
            <Database className="w-8 h-8 text-emerald-500" /> Portfolio Intelligence
          </h1>
          <p className="text-zinc-400">Fund I Performance, Returns, and Active Management.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/portfolio/reserves">
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white">View Reserves</Button>
          </Link>
          <Link href="/portfolio/lp-report">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-900/20">Evaluate LP Report</Button>
          </Link>
        </div>
      </div>

      {/* Primary Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:border-emerald-500/30 transition-colors shadow-none">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center justify-between">IRR <TrendingUp className="w-4 h-4 opacity-50"/></p>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-light text-white">32.4%</h2>
              <span className="text-xs text-emerald-500 font-medium">+2.1% YTD</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:border-emerald-500/30 transition-colors shadow-none">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center justify-between">MOIC <Target className="w-4 h-4 opacity-50"/></p>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-light text-white">2.8x</h2>
              <span className="text-xs text-zinc-500 font-medium">Target: 3.0x</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:border-emerald-500/30 transition-colors shadow-none">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center justify-between">TVPI <DollarSign className="w-4 h-4 opacity-50"/></p>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-light text-white">2.4x</h2>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 hover:border-emerald-500/30 transition-colors shadow-none">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center justify-between">DPI <DollarSign className="w-4 h-4 opacity-50"/></p>
            <div className="mt-4 flex items-baseline gap-2">
              <h2 className="text-3xl font-light text-white">0.4x</h2>
              <span className="text-xs text-zinc-500 font-medium">Distributions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Health KPIs & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Health Metrics */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-zinc-400 font-medium text-xs uppercase tracking-widest">Active Cos.</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-indigo-400">{health?.active_companies || 12}</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-zinc-400 font-medium text-xs uppercase tracking-widest" title="Weighted average of all active company health scores.">Avg Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-emerald-400">{health?.average_health_score || 84} / 100</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-zinc-400 font-medium text-xs uppercase tracking-widest">Follow-on</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-amber-400">{health?.follow_on_candidates || 3}</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-zinc-400 font-medium text-xs uppercase tracking-widest">At Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-rose-400">{health?.companies_needing_support || 1}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-zinc-900 border-zinc-800 h-[380px]">
            <CardHeader className="pb-0 border-b border-zinc-800/50 mb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 pb-4 text-zinc-100">
                <PieChart className="w-4 h-4 text-emerald-500" /> Sector Exposure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioSectorChart />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Revenue Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
            <CardHeader className="pb-0 border-b border-zinc-800/50 mb-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 pb-4 text-zinc-100">
                <LineChart className="w-4 h-4 text-indigo-500" /> Aggregate Revenue Growth (by Sector)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[400px]">
              <PortfolioRevenueChart />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Portfolio Roster */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-medium text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> Active Holdings
        </h2>
        <DataTable columns={columns} data={companies} searchKey="name" searchPlaceholder="Search portfolio companies..." />
      </div>
    </div>
  );
}
