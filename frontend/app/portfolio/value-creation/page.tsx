"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity, Briefcase, CheckCircle } from "lucide-react";

export default function ValueCreationHQ() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const companies = await api.getPortfolioCompanies();
        const vcPlans = await Promise.all(
          companies.map((c: any) => 
            api.getValueCreationPlan(c.company_id).catch(() => null)
          )
        );
        
        let allActions: any[] = [];
        vcPlans.forEach((plan: any, i) => {
          if (plan && plan.recommended_actions) {
            plan.recommended_actions.forEach((a: any) => {
              allActions.push({
                ...a,
                company_name: companies[i].name,
                company_id: companies[i].company_id
              });
            });
          }
        });
        
        // Sort by urgency roughly
        allActions.sort((a, b) => {
          if (a.urgency === "High" && b.urgency !== "High") return -1;
          if (a.urgency !== "High" && b.urgency === "High") return 1;
          return 0;
        });
        
        setActions(allActions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Value Creation Queue...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
        <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Value Creation Engine</h1>
          <p className="text-zinc-400">Actionable interventions automatically surfaced across the portfolio.</p>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl">
        {actions.length === 0 ? (
           <p className="text-zinc-500">No pending value creation actions.</p>
        ) : (
          actions.map((action, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/portfolio/companies/${action.company_id}`} className="text-lg font-medium text-indigo-400 hover:underline">
                      {action.company_name}
                    </Link>
                    <span className="text-zinc-600 text-sm">•</span>
                    <span className="text-white font-medium">{action.action_type}</span>
                  </div>
                  <Badge className={
                    action.urgency === 'High' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                    action.urgency === 'Medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  }>
                    {action.urgency} Priority
                  </Badge>
                </div>
                
                <p className="text-zinc-400 text-sm mb-4">{action.description}</p>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Briefcase className="w-4 h-4" />
                    Owner: <span className="text-zinc-300 font-medium">{action.owner}</span>
                  </div>
                  <Button variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-2 h-8 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Mark Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
