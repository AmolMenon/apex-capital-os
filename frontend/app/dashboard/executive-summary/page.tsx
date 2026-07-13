"use client";

import { useEffect, useState } from "react";
import { DealsService } from "@/services/deals";
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText } from "lucide-react";

export default function ExecutiveSummaryPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { deal } = useGlobalDeal();

  useEffect(() => {
    if (deal) {
      setLoading(true);
      DealsService.getExecutiveSummary(deal.id)
        .then(data => {
          setSummary(data.summary);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [deal]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Activity className="w-6 h-6 animate-pulse text-muted-foreground" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-muted-foreground">
        <FileText className="w-12 h-12 mb-4 opacity-20" />
        <p>No executive summary available.</p>
        <p className="text-sm">Run an investor review first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Executive Summary</h1>
          <p className="text-muted-foreground mt-1">Generated from your verified claims and assumptions.</p>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{summary.overview}</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {summary.strengths?.map((strength: string, i: number) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Critical Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-destructive">
              {summary.risks?.map((risk: string, i: number) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
