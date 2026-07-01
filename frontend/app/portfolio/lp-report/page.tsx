"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

export default function LPReportHQ() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getLPReport();
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Generating LP Report...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/portfolio" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-1">LP Reporting Engine</h1>
            <p className="text-zinc-400">Automated quarterly updates generated from real-time portfolio intelligence.</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metadata & Overview */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-4 border-b border-zinc-800">
              <CardTitle className="text-lg font-medium text-white flex items-center justify-between">
                Report Metadata
                <Badge className="bg-emerald-500/10 text-emerald-500 font-normal">Evaluated</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Period</p>
                <p className="text-sm font-medium text-white">{report?.period}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Key Metrics</p>
                <p className="text-sm text-zinc-300">{report?.key_metrics_summary}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Top Performers</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {report?.top_performers.map((p: string, i: number) => (
                    <Badge key={i} variant="outline" className="border-indigo-500/30 text-indigo-400">{p}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-4 border-b border-zinc-800">
              <CardTitle className="text-lg font-medium text-white">Next Quarter Priorities</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {report?.next_quarter_priorities.map((p: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Full Report Draft */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800 min-h-[600px]">
            <CardHeader className="pb-4 border-b border-zinc-800 bg-zinc-950/50">
              <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Draft Review
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 prose prose-invert max-w-none prose-h1:text-2xl prose-h1:font-light prose-h1:text-white prose-h2:text-xl prose-h2:font-medium prose-h2:text-zinc-200 prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-zinc-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {`# Apex Capital ${report?.period} Update\n\n## Portfolio Overview\n${report?.portfolio_summary}\n\n## Value Creation\n${report?.value_creation_work}\n\n## Risk Management\nWe are actively monitoring the following:\n${report?.portfolio_risks.map((r: string) => `- ${r}`).join('\n')}\n\n## Reserve Strategy\n${report?.reserve_allocation_view}\n\n## Market Commentary\n${report?.market_commentary}`}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
