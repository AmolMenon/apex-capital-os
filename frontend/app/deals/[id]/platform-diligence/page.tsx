"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Activity, Search, AlertTriangle, ArrowRight, ArrowLeft, Target, Globe, TerminalSquare } from 'lucide-react';

export default function PlatformDiligencePage() {
  const params = useParams();
  const dealId = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [deal, setDeal] = useState<any>(null);
  const [latestRun, setLatestRun] = useState<any>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchData();
  }, [dealId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dealData = await api.getDeal(dealId);
      setDeal(dealData);
      
      try {
        const runData = await api.getLatestPlatformDiligence(dealId);
        setLatestRun(runData);
      } catch (e) {
        setLatestRun(null);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleRunDiligence = async () => {
    setRunning(true);
    try {
      const config = {
        include_reddit: true,
        include_reviews: true,
        include_social: true,
        include_competitors: true
      };
      await api.runPlatformDiligence(dealId, config);
      await fetchData();
    } catch (e) {
      console.error("Failed to run diligence", e);
      alert("Failed to run Platform Diligence");
    }
    setRunning(false);
  };

  const handleMapToEvidence = async () => {
    if (!latestRun) return;
    try {
      await api.mapPlatformRunToEvidence(dealId, latestRun.run_id);
      alert("Signals mapped to Evidence Center successfully.");
    } catch (e) {
      alert("Failed to map evidence.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin text-emerald-500"><Activity className="w-8 h-8" /></div>
    </div>
  );

  return (
    <div className="space-y-6 bg-gradient-to-br from-background to-emerald-500/5 dark:to-emerald-900/10 min-h-screen p-8 rounded-xl border border-emerald-500/10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/deals/${dealId}`} className="text-muted-foreground hover:text-foreground transition-colors flex items-center text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-1" /> Deal Room
            </Link>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="w-8 h-8 text-emerald-600" /> Platform Diligence: <span className="text-primary">{deal?.startup_name}</span>
          </h1>
          <p className="text-muted-foreground mt-2">Aggregated outside-in public customer, competitor, and market signals.</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="default"
            size="lg"
            onClick={handleRunDiligence} 
            disabled={running}
            className="shadow-md hover:scale-[1.02] transition-transform duration-300 font-semibold"
          >
            {running ? <Activity className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
            {running ? "Running Analysis..." : "Run Platform Diligence"}
          </Button>
        </div>
      </div>

      {!latestRun ? (
        <Card className="bg-muted/10 border-dashed border-2 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <TerminalSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Platform Diligence Run Yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Scan Reddit, reviews, forums, GitHub, Product Hunt, and the broader public web to synthesize outside-in customer and market signals.
            </p>
            <Button size="lg" onClick={handleRunDiligence}>Start Initial Scan</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          
          {/* Latest Run Snapshot */}
          <Card className="bg-background/80 backdrop-blur-md shadow-lg border-primary/20">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Latest Analysis Run
                </CardTitle>
                <CardDescription>Status: {latestRun.status}</CardDescription>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleMapToEvidence}>
                  Map to Evidence
                </Button>
                <Link href={`/deals/${dealId}/platform-diligence/runs/${latestRun.run_id}`}>
                  <Button size="sm" className="font-semibold group">
                    Open Full Report <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-background/80 backdrop-blur-md shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                  <Search className="w-4 h-4" /> Platforms Checked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  {latestRun.report?.platforms_checked.map((p: string) => (
                    <Badge key={p} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {p}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/80 backdrop-blur-md shadow-md border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-emerald-700 uppercase tracking-wider">
                  <Target className="w-4 h-4" /> Signal Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold capitalize text-emerald-600 tracking-tight">
                  {latestRun.report?.metadata?.overall_confidence}
                </p>
                {latestRun.report?.metadata?.bias_and_limitations_note && (
                  <p className="text-xs text-amber-600 mt-2 p-2 bg-amber-500/10 rounded border border-amber-500/20">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    {latestRun.report.metadata.bias_and_limitations_note}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-background/80 backdrop-blur-md shadow-md border-amber-500/20">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-700">
                <ShieldAlert className="w-5 h-5" /> Top Customer Pain Points
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {latestRun.report?.pain_points.map((pp: any, idx: number) => (
                  <div key={idx} className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-xl transition-all hover:bg-amber-500/10">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg text-foreground">{pp.pain_point}</h4>
                      <Badge variant="outline" className="border-amber-500/30 text-amber-700 bg-amber-500/10">
                        Urgency: {pp.urgency}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                      Sources: {pp.platforms.join(", ")}
                    </div>
                    <div className="text-sm italic text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/50 border-l-2 border-l-amber-500">
                      "{pp.example_snippets[0]}"
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-md shadow-md border-destructive/20">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" /> Reputation Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {latestRun.report?.reputation_risks?.length === 0 ? (
                 <p className="text-muted-foreground italic flex items-center gap-2 p-4 bg-muted/20 rounded-lg">
                   <ShieldAlert className="w-4 h-4 opacity-50" /> No major reputation risks detected in public footprint.
                 </p>
              ) : (
                <div className="space-y-4">
                  {latestRun.report?.reputation_risks.map((risk: any, idx: number) => (
                    <div key={idx} className="p-4 bg-destructive/5 text-destructive border border-destructive/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-base mb-1">{risk.risk}</div>
                        <div className="text-xs opacity-80 uppercase tracking-wider font-medium">Source: {risk.source}</div>
                      </div>
                      <Badge variant="destructive" className="self-start sm:self-auto font-bold shadow-sm">
                        Severity: {risk.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
        </div>
      )}
    </div>
  );
}
