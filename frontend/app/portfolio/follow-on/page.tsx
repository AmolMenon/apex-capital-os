"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, TrendingUp, AlertTriangle } from "lucide-react";

export default function FollowOnHQ() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getFollowOnCandidates();
        setCandidates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Follow-On Intelligence...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Follow-On Decision Engine</h1>
          <p className="text-zinc-400">Data-driven evaluation of portfolio companies ready for their next round.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {candidates.map((candidate, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-zinc-800/50">
              <CardTitle className="text-xl font-medium text-white">{candidate.company_id.replace('comp-', '').toUpperCase()}</CardTitle>
              <Badge className={
                candidate.recommendation.includes("Double Down") ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }>
                {candidate.recommendation}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Performance vs Plan
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">ARR Target</span>
                    <span className="text-white font-medium">{candidate.performance_vs_plan.arr_target_met ? "Met / Exceeded" : "Missed"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Burn Multiple</span>
                    <span className="text-white font-medium">{candidate.performance_vs_plan.burn_multiple_target_met ? "Efficient" : "High Burn"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Key Milestone</span>
                    <span className="text-white font-medium">{candidate.performance_vs_plan.key_milestone_achieved ? "Achieved" : "Delayed"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Key Strengths
                </h4>
                <ul className="list-disc pl-5 text-sm text-zinc-400 space-y-1">
                  {candidate.key_strengths.map((str: string, idx: number) => <li key={idx}>{str}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Unresolved Risks
                </h4>
                <ul className="list-disc pl-5 text-sm text-rose-400 space-y-1">
                  {candidate.unresolved_risks.map((risk: string, idx: number) => <li key={idx}>{risk}</li>)}
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <p className="text-sm italic text-zinc-500">Target Ownership Post-Round: {candidate.target_ownership_post_round}</p>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
