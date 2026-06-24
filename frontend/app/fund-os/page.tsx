"use client";

import { OperationsPanel } from "@/components/OperationsPanel";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Target, TrendingUp, CheckCircle2, Map, LayoutDashboard, Building2, Users } from "lucide-react";

export default function GPCockpit() {
  const [cockpit, setCockpit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getGPCockpit();
        setCockpit(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading GP Cockpit...</div>;
  if (!cockpit) return <div className="p-8 text-white">Failed to load GP Cockpit.</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Fund Operating System</h1>
          <p className="text-zinc-400">Firm-wide GP Cockpit: Strategy, LP Intelligence, and Portfolio Construction.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/fund-os/performance">
            <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300">View Performance Math</Button>
          </Link>
          <Link href="/fund-os/lp-report">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">Generate LP Report</Button>
          </Link>
        </div>
      </div>

      {cockpit.urgent_alerts?.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-8">
          <h3 className="text-amber-500 font-medium flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            Urgent Fund Alerts
          </h3>
          <ul className="space-y-2">
            {cockpit.urgent_alerts.map((alert: any, idx: number) => (
              <li key={idx} className="text-amber-400/90 text-sm">
                <span className="font-semibold">{alert.alert}:</span> {alert.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
              <Target className="w-5 h-5" />
              <h3 className="font-medium">Top Priority</h3>
            </div>
            <p className="text-sm text-zinc-300 mt-2">
              {cockpit.top_gp_priorities[0]?.action || "No immediate priority."}
            </p>
            {cockpit.top_gp_priorities[0]?.reason && (
              <p className="text-xs text-zinc-500 mt-1">{cockpit.top_gp_priorities[0].reason}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
              <Building2 className="w-5 h-5" />
              <h3 className="font-medium">Top LP Action</h3>
            </div>
            <p className="text-sm text-zinc-300 mt-2">
              {cockpit.lp_actions[0]?.action || "No LP actions pending."}
            </p>
            {cockpit.lp_actions[0]?.lp && (
              <p className="text-xs text-zinc-500 mt-1">LP: {cockpit.lp_actions[0].lp}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-amber-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-medium">Top Portfolio Action</h3>
            </div>
            <p className="text-sm text-zinc-300 mt-2">
              {cockpit.portfolio_actions[0]?.action || "No portfolio actions required."}
            </p>
            {cockpit.portfolio_actions[0]?.company && (
              <p className="text-xs text-zinc-500 mt-1">Company: {cockpit.portfolio_actions[0].company}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-rose-400 mb-2">
              <LayoutDashboard className="w-5 h-5" />
              <h3 className="font-medium">Top Deal Action</h3>
            </div>
            <p className="text-sm text-zinc-300 mt-2">
              {cockpit.deal_actions[0]?.action || "No deal actions pending."}
            </p>
            {cockpit.deal_actions[0]?.deal && (
              <p className="text-xs text-zinc-500 mt-1">Deal: {cockpit.deal_actions[0].deal}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white">Fund Strategy & Reporting</h2>
          <div className="flex flex-col gap-3">
            <Link href="/fund-os/construction">
              <Button variant="secondary" className="w-full justify-start bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                <Map className="w-4 h-4 mr-2 text-indigo-400" />
                Portfolio Construction Modeling
              </Button>
            </Link>
            <Link href="/fund-os/performance">
              <Button variant="secondary" className="w-full justify-start bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" />
                Fund Performance & Return Math
              </Button>
            </Link>
            <Link href="/fund-os/capital-planning">
              <Button variant="secondary" className="w-full justify-start bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                <Building2 className="w-4 h-4 mr-2 text-amber-400" />
                Capital Call & Distributions
              </Button>
            </Link>
            <Link href="/fund-os/lp-report">
              <Button variant="secondary" className="w-full justify-start bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                <LayoutDashboard className="w-4 h-4 mr-2 text-purple-400" />
                Generate LP Quarterly Report
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white">LP Intelligence & Fundraising</h2>
          <div className="flex flex-col gap-3">
            <Link href="/fund-os/lps">
              <Button variant="secondary" className="w-full justify-start bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                <Users className="w-4 h-4 mr-2 text-indigo-400" />
                LP Dashboard & Relationships
              </Button>
            </Link>
            <Link href="/fund-os/fundraising-pipeline">
              <Button variant="secondary" className="w-full justify-start bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                <Target className="w-4 h-4 mr-2 text-emerald-400" />
                Fundraising Pipeline (CRM)
              </Button>
            </Link>
            <Link href="/fund-os/data-room">
              <Button variant="secondary" className="w-full justify-start bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 mr-2 text-amber-400" />
                Fund Data Room Completeness
              </Button>
            </Link>
            <Link href="/fund-os/lp-questions">
              <Button variant="secondary" className="w-full justify-start bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                <AlertCircle className="w-4 h-4 mr-2 text-rose-400" />
                Institutional LP Q&A Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium text-white">Data Governance</h2>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-zinc-400">
                Fund OS synthesizes deal logic, portfolio intelligence, and firm strategy into actionable GP-level insights. 
              </p>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-500 font-mono">
                NOTICE: Figures displayed in Demo Mode are derived from mock data fixtures for demonstration purposes. Do not use for formal accounting.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
