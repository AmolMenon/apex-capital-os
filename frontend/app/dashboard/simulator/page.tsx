"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Copy, FileText, Target, AlertTriangle, HelpCircle, CheckCircle } from "lucide-react";
import { DealsService } from "@/services/deals";
import { useSearchParams } from "next/navigation";

export default function InvestorReviewPage() {
  const searchParams = useSearchParams();
  const decisionId = searchParams.get("id") || "1"; // Default to 1 if no param
  
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DealsService.runInvestorReview(decisionId);
      setReview(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate Investor Review");
    } finally {
      setLoading(false);
    }
  };

  const exportToMarkdown = () => {
    if (!review) return;
    const { memo, perspectives, investor_questions, decision, action_plan } = review;
    
    let md = `# Investor Review: ${decision.outcome}\n\n`;
    md += `## Executive Summary\n${memo.executive_summary}\n\n`;
    
    md += `## Perspectives\n`;
    md += `### Areas of Alignment\n${perspectives.areas_of_alignment.map((a: string) => `- ${a}`).join("\n")}\n\n`;
    md += `### Areas of Concern\n${perspectives.areas_of_concern.map((a: string) => `- ${a}`).join("\n")}\n\n`;
    md += `### Split Opinions\n${perspectives.split_opinions.map((a: string) => `- ${a}`).join("\n")}\n\n`;

    md += `## Investor Questions\n`;
    investor_questions.forEach((q: any) => {
      md += `### ${q.question} [${q.importance}]\n`;
      md += `**Why Ask:** ${q.why_ask}\n`;
      md += `**Existing Evidence:** ${q.existing_evidence}\n`;
      md += `**Missing Evidence:** ${q.missing_evidence}\n`;
      md += `**How to Prepare:** ${q.how_to_prepare}\n\n`;
    });

    md += `## Founder Action Plan\n`;
    action_plan.forEach((a: any) => {
      md += `### [${a.priority}] ${a.title}\n`;
      md += `**Reason:** ${a.reason}\n`;
      md += `**Effort:** ${a.estimated_effort}\n`;
      md += `**Impact:** ${a.expected_investor_impact}\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "investor_review.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = () => {
    if (!review) return;
    // minimal copy version
    navigator.clipboard.writeText(`Investor Review: ${review.decision.outcome}\n${review.memo.executive_summary}`);
  };

  if (!review && !loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12 text-center animate-in fade-in">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Investor Review</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate a comprehensive, institutional-grade evaluation of your investment case based entirely on the evidence in your Data Room.
        </p>
        <Button size="lg" onClick={handleRunReview} className="mt-8 font-semibold text-lg px-8 h-14">
          Generate Investor Review
        </Button>
        {error && <div className="text-destructive mt-4 font-medium">{error}</div>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">Synthesizing Investment Case...</h3>
          <p className="text-muted-foreground">Evaluating claims, assumptions, and conflicts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Investor Review</h1>
            <Badge variant={review.decision.outcome.includes("Pass") ? "destructive" : "default"} className="text-sm">
              {review.decision.outcome}
            </Badge>
          </div>
          <p className="text-muted-foreground">Generated from canonical Data Room evidence.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" /> Copy Summary
          </Button>
          <Button variant="outline" onClick={exportToMarkdown}>
            <Download className="w-4 h-4 mr-2" /> Export .md
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Investment Memo
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-6 text-sm">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">{review.memo.executive_summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Strengths</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {review.memo.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Critical Risks</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {review.memo.critical_risks.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-2">Recommendation Rationale</h3>
                  <p className="text-muted-foreground leading-relaxed">{review.decision.rationale}</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              Diligence Questions
            </h2>
            <div className="space-y-4">
              {review.investor_questions.map((q: any, i: number) => (
                <Card key={i} className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg leading-snug">{q.question}</CardTitle>
                      <Badge variant={q.importance === "High" ? "destructive" : "secondary"}>{q.importance}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                      <span className="font-semibold block mb-1">Why an investor would ask this:</span>
                      <span className="text-muted-foreground">{q.why_ask}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold block mb-1">Existing Evidence:</span>
                        <span className="text-muted-foreground">{q.existing_evidence}</span>
                      </div>
                      <div>
                        <span className="font-semibold block mb-1">Missing Evidence:</span>
                        <span className="text-muted-foreground">{q.missing_evidence}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Perspectives
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-emerald-500 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Areas of Alignment
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2 pl-6 list-disc">
                    {review.perspectives.areas_of_alignment.map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div className="p-4 border-b border-border bg-destructive/5">
                  <h3 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Areas of Concern
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2 pl-6 list-disc">
                    {review.perspectives.areas_of_concern.map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-amber-500 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Split Opinions
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2 pl-6 list-disc">
                    {review.perspectives.split_opinions.map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Action Plan
            </h2>
            <div className="space-y-3">
              {review.action_plan.map((action: any, i: number) => (
                <Card key={i} className="bg-card border-border shadow-sm">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">{action.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 text-sm space-y-2">
                    <p className="text-muted-foreground">{action.reason}</p>
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/50 text-xs text-muted-foreground">
                      <span>Effort: {action.estimated_effort}</span>
                      <Button variant="link" className="h-auto p-0 text-xs">Go to {action.navigation_target} →</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
