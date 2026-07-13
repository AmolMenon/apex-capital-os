"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ShieldAlert, AlertTriangle, ArrowRight } from "lucide-react";
import { DealsService } from "@/services/deals";
import { useGlobalDeal } from "@/components/GlobalDealProvider";

export default function ActionCenterPage() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const { deal } = useGlobalDeal();

  useEffect(() => {
    if (deal) {
      DealsService.getWorkQueue(deal.id).then(data => {
        if (data.work_queue) {
          setTasks(data.work_queue.map((t: any) => ({
            id: t.id,
            title: t.title,
            severity: t.priority === "HIGH" ? "blocking" : "warning",
            status: t.status === "OPEN" ? "todo" : "done",
            description: `Action needed regarding assumption ${t.linked_assumption_id} or conflict ${t.linked_conflict_id}`,
            action: "Review the flagged finding in the data room and upload new evidence or edit assumptions.",
            explainability: {
              why: "This item was automatically added by the Investor Review system.",
              concern: "Unresolved risks affect your investment readiness score.",
              expectedImprovement: "+5 pts"
            }
          })));
        }
      });
    }
  }, [deal]);

  const activeTaskData = tasks.find(t => t.id === selectedTask);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-end justify-between border-b border-border pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Action Center</h1>
          <p className="text-muted-foreground mt-1">Your prioritized checklist to become fundable.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* Task List */}
        <div className="w-1/2 flex flex-col border border-border rounded-xl overflow-hidden bg-card">
          <div className="p-4 border-b border-border bg-muted/20 flex gap-4 text-sm font-semibold text-muted-foreground">
            <button className="text-foreground border-b-2 border-primary pb-1">To Do ({tasks.length})</button>
            <button className="hover:text-foreground transition-colors">Done (0)</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {tasks.map(task => (
              <button 
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={`w-full text-left p-4 rounded-lg flex gap-4 transition-colors border border-transparent ${
                  selectedTask === task.id ? "bg-primary/5 border-primary/20" : "hover:bg-muted"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {task.status === "done" ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {task.severity === "blocking" && <ShieldAlert className="w-4 h-4 text-destructive" />}
                    {task.severity === "warning" && <AlertTriangle className="w-4 h-4 text-warning" />}
                    <span className="font-semibold truncate">{task.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Task Details Panel */}
        <div className="w-1/2 border border-border rounded-xl bg-card overflow-hidden flex flex-col">
          {activeTaskData ? (
            <>
              <div className="p-6 border-b border-border flex items-start gap-4 bg-muted/10">
                <div className="shrink-0 mt-1">
                  {activeTaskData.severity === "blocking" && <ShieldAlert className="w-6 h-6 text-destructive" />}
                  {activeTaskData.severity === "warning" && <AlertTriangle className="w-6 h-6 text-warning" />}
                  {activeTaskData.severity === "recommendation" && <CheckCircle2 className="w-6 h-6 text-success" />}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    {activeTaskData.severity === "blocking" && <span className="text-destructive">Critical Block</span>}
                    {activeTaskData.severity === "warning" && <span className="text-warning">Investor Concern</span>}
                    {activeTaskData.severity === "recommendation" && <span className="text-success">Recommendation</span>}
                  </div>
                  <h2 className="text-2xl font-bold">{activeTaskData.title}</h2>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">The Issue</h3>
                  <p className="text-foreground leading-relaxed">{activeTaskData.description}</p>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">How to Fix It</h3>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <p className="font-medium text-primary-foreground leading-relaxed">{activeTaskData.action}</p>
                    </CardContent>
                  </Card>
                </div>

                {activeTaskData.explainability && (
                  <div className="bg-muted/30 border border-border rounded-lg p-4 text-sm space-y-4">
                    <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-slate-500" /> Why am I seeing this?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold text-slate-700 block">The Core Concern:</span>
                        <span className="text-slate-600">{activeTaskData.explainability.why}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Investor Concern:</span>
                        <span className="text-slate-600">{activeTaskData.explainability.concern}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Evidence Used:</span>
                        <span className="text-slate-600">{activeTaskData.explainability.evidenceUsed}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">Missing Evidence:</span>
                        <span className="text-slate-600">{activeTaskData.explainability.evidenceMissing}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-semibold text-slate-700 block">Assumptions Made:</span>
                        <span className="text-slate-600">{activeTaskData.explainability.assumptions}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-semibold text-slate-700 block">What Would Convince An Investor:</span>
                        <span className="text-slate-600">{activeTaskData.explainability.convince}</span>
                      </div>
                      <div className="md:col-span-2 mt-2 pt-4 border-t border-border">
                        <span className="font-semibold text-success block">Expected Improvement:</span>
                        <span className="text-slate-800 font-medium">{activeTaskData.explainability.expectedImprovement}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3 shrink-0">
                <Button variant="outline">Dismiss</Button>
                <Button>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Resolved
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a task</p>
              <p className="text-sm">Choose an item from the list to view details and resolution steps.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
