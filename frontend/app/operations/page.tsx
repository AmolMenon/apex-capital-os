"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, ArrowRight, Zap, Target } from "lucide-react";
import Link from "next/link";

export default function OperationsHQ() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.getTasks(),
      api.getAlerts(),
      api.getNextActions(),
      api.getWorkflows()
    ]).then(([tasks, alerts, nextActions, workflows]) => {
      setData({ tasks, alerts, nextActions, workflows });
    });
  }, []);

  if (!data) return <div className="p-8 text-center animate-pulse">Loading Operations Autopilot...</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="w-8 h-8 text-indigo-600" /> Operations Autopilot
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Apex Capital's autonomous workflow engine. It orchestrates the entire firm by synthesizing IC Packets, Trust Center audits, and email threads into deterministic tasks and alerts.
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100" onClick={() => api.generateTasks()}>
            <Zap className="w-4 h-4 mr-2" /> Force Agent Loop
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Best Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600"/> Firm-Wide Next Best Actions
          </h2>
          <div className="space-y-4">
            {data.nextActions.slice(0, 5).map((a: any) => (
              <Card key={a.action_id} className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs uppercase tracking-wider">{a.entity_type}</Badge>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{a.entity_id.toUpperCase()}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{a.action}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{a.why_now}</p>
                      <div className="flex gap-2">
                        {a.open_blockers?.map((b: string) => (
                          <Badge key={b} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-50">{b}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-none">{a.owner}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> Due: {new Date(a.due_date).toLocaleDateString()}</span>
                      <Button size="sm" className="mt-2" variant="outline">Execute <ArrowRight className="w-4 h-4 ml-2"/></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5"/> Critical Alerts
          </h2>
          <div className="space-y-4">
            {data.alerts.filter((a: any) => a.status === 'active').map((a: any) => (
              <Card key={a.alert_id} className={`border-t-4 shadow-sm ${a.severity === 'critical' ? 'border-t-red-600 bg-red-50/50 dark:bg-red-900/10' : 'border-t-amber-500 bg-amber-50/50 dark:bg-amber-900/10'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={a.severity === 'critical' ? 'destructive' : 'default'} className={a.severity !== 'critical' ? 'bg-amber-500' : ''}>
                      {a.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">{a.source_module}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 mt-2">{a.title}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{a.reason}</p>
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-neutral-800 p-2 border rounded">
                    Agent Rec: {a.recommended_action}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-xl font-bold flex items-center gap-2 mt-8">
            <CheckCircle className="w-5 h-5 text-indigo-600"/> High Priority Tasks
          </h2>
          <Card className="shadow-sm">
            <CardContent className="p-0 divide-y">
               {data.tasks.filter((t: any) => t.priority === "critical" || t.priority === "high").slice(0,5).map((t: any) => (
                <div key={t.task_id} className="p-4 hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100 leading-tight">{t.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{t.description}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase">{t.owner}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
