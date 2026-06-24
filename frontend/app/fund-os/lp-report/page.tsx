"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, Check, AlertCircle } from "lucide-react";

export default function LPReportPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getFundLPReport();
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
  }

  if (loading) return <div className="p-8 text-white">Loading LP Report Engine...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-4">
        <div className="flex items-center gap-4">
          <Link href="/fund-os" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-2">Quarterly LP Report Builder</h1>
            <p className="text-zinc-400">Synthesize portfolio intelligence into LP-ready narratives.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300" disabled={generating}>
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700" disabled={generating}>
            {generating ? "Synthesizing Data..." : "Regenerate Report"}
          </Button>
        </div>
      </div>

      {!report ? (
        <div className="p-12 text-center text-zinc-500">Failed to load report data.</div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white text-zinc-900 border-0 rounded-none shadow-xl min-h-[800px]">
            <CardHeader className="border-b border-zinc-200 pb-8 pt-12 px-12">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-serif text-zinc-900 mb-2">Quarterly Update</h1>
                  <h2 className="text-xl text-zinc-500 font-light">Apex Demo Fund I - Q2 2026</h2>
                </div>
                <div className="text-right">
                  <div className="font-bold tracking-wider text-sm text-zinc-400 uppercase">Apex Capital</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12 space-y-10">
              
              <section>
                <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-4 text-xs">Executive Summary</h3>
                <p className="text-zinc-800 leading-relaxed">{report.executive_summary}</p>
              </section>

              <div className="grid grid-cols-2 gap-8">
                <section>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-4 text-xs">Fund Overview</h3>
                  <p className="text-zinc-800 leading-relaxed font-medium">{report.fund_overview}</p>
                </section>
                <section>
                  <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-4 text-xs">Deployment</h3>
                  <p className="text-zinc-800 leading-relaxed">{report.deployment_progress}</p>
                </section>
              </div>

              <section>
                <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-4 text-xs">Portfolio Construction & Health</h3>
                <div className="bg-zinc-50 p-6 border border-zinc-100 space-y-4">
                  <p className="text-zinc-800">{report.portfolio_construction}</p>
                  <p className="text-zinc-800">{report.portfolio_health}</p>
                  
                  <div className="pt-4 mt-4 border-t border-zinc-200 grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs uppercase text-zinc-500 mb-2">Key Drivers</span>
                      <ul className="space-y-1">
                        {report.top_companies.map((c: string, i: number) => (
                          <li key={i} className="text-sm text-zinc-800 flex items-center gap-2">
                            <Check className="w-3 h-3 text-emerald-500" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="block text-xs uppercase text-zinc-500 mb-2">Areas of Focus</span>
                      <ul className="space-y-1">
                        {report.companies_needing_support.map((c: string, i: number) => (
                          <li key={i} className="text-sm text-zinc-800 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-amber-500" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-4 text-xs">Reserve Strategy</h3>
                <p className="text-zinc-800 leading-relaxed">{report.reserve_strategy}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-4 text-xs">Market Commentary</h3>
                <p className="text-zinc-800 leading-relaxed italic text-sm">{report.market_commentary}</p>
              </section>

              <section>
                <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-4 text-xs">Next Quarter Priorities</h3>
                <ul className="list-disc pl-5 space-y-2 text-zinc-800">
                  {report.next_quarter_priorities.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </section>

              <div className="pt-8 border-t border-zinc-200 text-center text-xs text-zinc-400">
                STRICTLY CONFIDENTIAL. DO NOT DISTRIBUTE.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
