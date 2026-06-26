"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity, TrendingUp, AlertCircle, FileText, CheckCircle } from "lucide-react";

export default function CompanyProfile() {
  const params = useParams();
  const companyId = params.companyId as string;

  const [company, setCompany] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [boardDeck, setBoardDeck] = useState<any>(null);
  const [valueCreation, setValueCreation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!companyId) return;
      try {
        const [c, h, k, u, bd, vc] = await Promise.all([
          api.getPortfolioCompany(companyId).catch(() => null),
          api.getPortfolioCompanyHealth(companyId).catch(() => null),
          api.getPortfolioKPIs(companyId).catch(() => null),
          api.getFounderUpdates(companyId).catch(() => []),
          api.getBoardDeckAnalysis(companyId).catch(() => null),
          api.getValueCreationPlan(companyId).catch(() => null),
        ]);
        setCompany(c);
        setHealth(h);
        setKpis(k);
        setUpdates(u);
        setBoardDeck(bd);
        setValueCreation(vc);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [companyId]);

  if (loading) return <div className="p-8 text-white">Loading Intelligence Profile...</div>;
  if (!company) return <div className="p-8 text-white">Company not found.</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-light tracking-tight">{company.name}</h1>
        <Badge className={
          company.portfolio_status === 'active' ? "bg-emerald-500/10 text-emerald-500" :
          company.portfolio_status === 'follow_on_candidate' ? "bg-amber-500/10 text-amber-500" :
          company.portfolio_status === 'watchlist' ? "bg-rose-500/10 text-rose-500" :
          "bg-indigo-500/10 text-indigo-500"
        }>
          {company.portfolio_status.replace(/_/g, ' ')}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-medium flex items-center gap-2" title="Calculated from revenue growth, runway, and team retention">
              <Activity className="w-4 h-4 text-emerald-400" />
              Health Score (0-100)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-light text-white mb-2">{health?.overall_score || "N/A"}</div>
            <p className="text-sm text-zinc-500">{health?.summary || "No recent health assessment."}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Key Metrics (Latest)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kpis?.metrics && kpis.metrics.length > 0 ? (
              <div className="space-y-3 mt-2">
                {kpis.metrics.slice(0, 3).map((metric: any, i: number) => {
                  const latestVal = metric.values[metric.values.length - 1];
                  return (
                    <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-2 last:border-0 last:pb-0">
                      <span className="text-sm font-medium text-zinc-300">{metric.metric_name}</span>
                      <span className="text-sm text-white">{latestVal !== null ? latestVal : 'Not reported'}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 mt-2">No KPI data submitted.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-400 text-sm font-medium flex items-center gap-2" title="Calculated based on recent negative founder updates or board deck risks">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Value Creation Urgency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium text-white mb-2">{valueCreation?.overall_urgency || "Low"}</div>
            <p className="text-sm text-zinc-500">{valueCreation?.summary || "No active interventions needed."}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-white border-b border-zinc-800 pb-2">Latest Founder Updates</h2>
          {updates && updates.length > 0 ? (
            updates.map((update: any) => (
              <Card key={update.update_id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-zinc-400">{new Date(update.date_received).toLocaleDateString()}</span>
                    <Badge variant="outline" className={
                      update.sentiment === 'positive' ? 'border-emerald-500/30 text-emerald-400' :
                      update.sentiment === 'negative' ? 'border-rose-500/30 text-rose-400' :
                      'border-amber-500/30 text-amber-400'
                    }>
                      {update.sentiment}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300 mb-1">Key Highlights</h4>
                      <ul className="list-disc pl-5 text-sm text-zinc-400 space-y-1">
                        {update.key_highlights.map((h: string, i: number) => <li key={i}>{h}</li>)}
                      </ul>
                    </div>
                    {update.asks_for_help && update.asks_for_help.length > 0 && (
                      <div className="bg-amber-500/5 p-3 rounded border border-amber-500/10">
                        <h4 className="text-sm font-medium text-amber-400 mb-1 flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" /> Founder Asks
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-amber-400/80 space-y-1">
                          {update.asks_for_help.map((a: string, i: number) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-sm text-zinc-500 p-4 bg-zinc-900 rounded border border-zinc-800">No updates parsed.</div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-medium text-white border-b border-zinc-800 pb-2 flex justify-between items-center">
            <span>Board Deck Intelligence</span>
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-xs font-normal">Auto-Analyzed</Badge>
          </h2>
          {boardDeck ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">Company Narrative</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{boardDeck.company_narrative}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950 p-3 rounded border border-zinc-800/50">
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">KPI Trends</h4>
                    <ul className="list-disc pl-4 text-sm text-zinc-300 space-y-1">
                      {boardDeck.kpi_trends.map((t: string, i: number) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded border border-zinc-800/50">
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Unspoken Risks</h4>
                    <ul className="list-disc pl-4 text-sm text-rose-400 space-y-1">
                      {boardDeck.unspoken_risks.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">Missing from Deck</h4>
                  <div className="flex flex-wrap gap-2">
                    {boardDeck.missing_information.map((info: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">{info}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-sm text-zinc-500 p-4 bg-zinc-900 rounded border border-zinc-800">No board deck analysis available.</div>
          )}

          {valueCreation && valueCreation.recommended_actions.length > 0 && (
             <div className="mt-8 space-y-4">
               <h2 className="text-xl font-medium text-white border-b border-zinc-800 pb-2">Value Creation Plan</h2>
               {valueCreation.recommended_actions.map((action: any, i: number) => (
                 <div key={i} className="flex gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                   <div className="mt-0.5">
                     <CheckCircle className="w-5 h-5 text-indigo-500" />
                   </div>
                   <div>
                     <h4 className="text-sm font-medium text-white">{action.action_type}</h4>
                     <p className="text-sm text-zinc-400 mt-1">{action.description}</p>
                     <div className="flex gap-3 mt-3">
                       <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">Owner: {action.owner}</Badge>
                       <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">Urgency: {action.urgency}</Badge>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
