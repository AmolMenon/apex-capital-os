"use client";

import React, { useState } from 'react';
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Activity, MessageSquare, AlertCircle, TrendingDown, Target } from "lucide-react";
import { api } from "@/lib/api";
import { DealRoomSkeleton } from "@/components/ui/DealRoomSkeleton";

export default function DecisionLab() {
  const { state, loading } = useGlobalDeal();
  const deal = state?.deal;

  const [revenueDrop, setRevenueDrop] = useState(0);
  const [cacIncrease, setCacIncrease] = useState(0);
  const [founderLeaves, setFounderLeaves] = useState(false);

  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  if (loading) return <DealRoomSkeleton />;

  const runSimulation = async () => {
    setIsSimulating(true);
    setResults(null);
    try {
      const res = await api.post(`/api/deals/${deal?.id}/simulate-scenario`, {
        revenue_drop_pct: revenueDrop,
        cac_increase_pct: cacIncrease,
        founder_leaves: founderLeaves
      });
      setResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="w-8 h-8 text-indigo-500" />
          Decision Lab & Scenario Simulator
        </h1>
        <p className="text-muted-foreground mt-1">Stress test the investment thesis against adverse scenarios and watch the AI agents debate the outcomes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Scenario Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg">Scenario Parameters</CardTitle>
              <CardDescription>Adjust variables to simulate stress conditions.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-500" /> Revenue Drop
                  </Label>
                  <span className="text-sm font-mono">{revenueDrop}%</span>
                </div>
                <Slider 
                  value={[revenueDrop]} 
                  onValueChange={(v) => setRevenueDrop(v[0])} 
                  max={50} 
                  step={5} 
                />
                <p className="text-xs text-muted-foreground">Simulate loss of major customers or market contraction.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-amber-500" /> CAC Increase
                  </Label>
                  <span className="text-sm font-mono">{cacIncrease}%</span>
                </div>
                <Slider 
                  value={[cacIncrease]} 
                  onValueChange={(v) => setCacIncrease(v[0])} 
                  max={100} 
                  step={10} 
                />
                <p className="text-xs text-muted-foreground">Simulate worsening unit economics or channel saturation.</p>
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-6">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" /> Founder Departure
                  </Label>
                  <p className="text-xs text-muted-foreground">Simulate key person risk event.</p>
                </div>
                <Switch 
                  checked={founderLeaves} 
                  onCheckedChange={setFounderLeaves} 
                />
              </div>

              <Button 
                onClick={runSimulation} 
                disabled={isSimulating}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isSimulating ? "Simulating..." : (
                  <><Play className="w-4 h-4 mr-2" /> Run Multi-Agent Simulation</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {results ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                 <Card className="bg-indigo-500/5 border-indigo-500/20">
                   <CardHeader className="pb-2">
                     <CardTitle className="text-sm text-indigo-500 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Synthesized Health Score
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="text-3xl font-bold text-indigo-500 flex items-end gap-2">
                        {results.new_health_score}/100
                        <span className={`text-sm font-medium ${results.health_delta < 0 ? 'text-red-500' : 'text-emerald-500'} mb-1`}>
                          ({results.health_delta < 0 ? '' : '+'}{results.health_delta})
                        </span>
                      </div>
                   </CardContent>
                 </Card>

                 <Card className={
                    results.new_health_score < 40 ? "bg-red-500/5 border-red-500/20" :
                    results.new_health_score < 65 ? "bg-amber-500/5 border-amber-500/20" :
                    "bg-emerald-500/5 border-emerald-500/20"
                 }>
                   <CardHeader className="pb-2">
                     <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                        <Target className="w-4 h-4" /> Final Recommendation
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="text-2xl font-bold text-foreground">
                        {results.recommendation}
                      </div>
                   </CardContent>
                 </Card>
              </div>

              <Card>
                <CardHeader className="border-b border-border/50">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-500" /> Live Agent Debate
                  </CardTitle>
                  <CardDescription>Watch the Investment Brain debate the scenario.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {results.debate_logs.map((log: any, idx: number) => (
                      <div key={idx} className={`p-4 flex gap-4 ${log.agent === 'System' ? 'bg-muted/10' : ''}`}>
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {log.agent === 'System' ? <Activity className="w-5 h-5 text-primary" /> : <span className="font-bold text-primary">{log.agent[0]}</span>}
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="font-semibold text-sm">{log.agent}</span>
                               <Badge variant="secondary" className="text-[10px] uppercase tracking-wider px-1.5 py-0">
                                 {log.role}
                               </Badge>
                               <span className="text-xs text-muted-foreground ml-auto">
                                  {new Date(log.timestamp * 1000).toLocaleTimeString()}
                               </span>
                            </div>
                            <p className="text-sm text-foreground/90">{log.message}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed bg-muted/5">
              <div className="text-center max-w-md p-6">
                <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Simulate</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Adjust the scenario parameters on the left and click "Run" to spawn specialized AI agents that will debate the impact of these conditions on the deal.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
