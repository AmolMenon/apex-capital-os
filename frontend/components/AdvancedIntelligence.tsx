import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCommit, Search, GitBranch, ArrowRight, History } from "lucide-react";

export function DecisionAuditTrail({ logs = [] }: { logs?: any[] }) {
  if (!logs || logs.length === 0) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
          <History className="w-4 h-4" /> Decision Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {logs.map((log, index) => (
            <div key={index} className="p-4 flex items-start gap-4">
              <div className="w-12 text-center text-xs text-muted-foreground pt-1">
                 {new Date(log.created_at).toLocaleDateString()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">{log.previous_recommendation || 'None'}</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                    {log.current_recommendation}
                  </Badge>
                  <span className={`text-xs font-bold ${log.confidence_change > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {log.confidence_change > 0 ? '+' : ''}{log.confidence_change}% Confidence
                  </span>
                </div>
                <p className="text-sm text-foreground/90 mb-1 font-medium">{log.reason_changed}</p>
                {log.evidence_responsible && (
                  <p className="text-xs text-muted-foreground">Source: {log.evidence_responsible}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioPatternMatch() {
  return (
    <Card className="bg-indigo-500/5 border-indigo-500/20">
      <CardHeader className="pb-3 border-b border-indigo-500/20">
        <CardTitle className="flex items-center gap-2 text-indigo-400 text-sm">
          <Search className="w-4 h-4" /> Portfolio Pattern Recognition
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p className="text-sm text-indigo-300 font-medium leading-relaxed">
          This company highly resembles our previous investments in <strong>Acme Corp</strong> and <strong>Globex</strong>.
        </p>
        <div className="bg-background/80 p-3 rounded border border-border/50 text-xs text-muted-foreground space-y-2">
           <p><strong>Similarities:</strong> Both targeted enterprise SMBs with a PLG motion before transitioning to field sales.</p>
           <p><strong>Past Failures:</strong> In Globex, the transition caused CAC to triple over 6 months.</p>
           <p><strong>Recommendation:</strong> Diligence their enterprise sales cycle length and ask for cohort analysis on their first 5 enterprise customers.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function EvidenceGraphMock() {
  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
          <GitBranch className="w-4 h-4" /> Evidence Graph
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-muted p-3 rounded-lg border border-border text-xs w-48 shadow-sm">Founder Interview Transcript</div>
          <ArrowRight className="w-4 h-4 text-emerald-500 rotate-90" />
          <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-lg border border-emerald-500/30 text-xs font-semibold w-48 shadow-sm">Strong Founder Score</div>
          <ArrowRight className="w-4 h-4 text-emerald-500 rotate-90" />
          <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-lg border border-emerald-500/30 text-xs font-semibold w-48 shadow-sm">High Execution Probability</div>
          <ArrowRight className="w-4 h-4 text-emerald-500 rotate-90" />
          <div className="bg-primary p-3 rounded-lg border border-primary-foreground/20 text-primary-foreground text-sm font-bold w-48 shadow-md">Investment Thesis: Bull Case</div>
        </div>
      </CardContent>
    </Card>
  );
}
