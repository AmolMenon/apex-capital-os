"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ShieldAlert, Target, AlertTriangle, ArrowRight, Zap, ListTodo, GitCommit } from "lucide-react";
import { DealsService } from "@/services/deals";
import { useGlobalDeal } from "@/components/GlobalDealProvider";
import { Button } from "@/components/ui/button";

export default function ExecutionWorkspacePage() {
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { deal } = useGlobalDeal();

  useEffect(() => {
    if (deal) {
      DealsService.getWorkQueue(deal.id).then(data => {
        if (data.work_queue) {
          setTasks(data.work_queue.map((t: any) => ({
            id: t.id,
            title: t.title,
            severity: t.priority === "High" ? "blocking" : "warning",
            status: t.status === "OPEN" || t.status === "TODO" ? "todo" : "done",
            problem: t.problem,
            why_investors_care: t.why_investors_care,
            definition_of_done: t.definition_of_done,
            estimated_effort: t.estimated_effort,
            expected_impact: t.expected_impact,
            verification_criteria: t.verification_criteria,
            priority_label: t.priority,
            linked_claim_text: t.linked_claim_text,
            linked_assumption_text: t.linked_assumption_text,
            linked_conflict_text: t.linked_conflict_text
          })));
        }
        setLoading(false);
      }).catch((e) => {
        // APM logging
        setErrorMsg("Failed to load tasks. Please try again.");
        setLoading(false);
      });
    }
  }, [deal]);

  const activeTaskData = tasks.find(t => t.id === selectedTask);

  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300">
        <div className="flex items-center gap-2 mb-6">
          <ListTodo className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-xl font-semibold tracking-tight">Execution Workspace</h1>
        </div>
        <div className="flex-1 flex gap-0 border border-border/50 rounded-lg bg-card shadow-sm overflow-hidden">
          <div className="w-[40%] flex flex-col border-r border-border/50 bg-background/50 p-4 space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-secondary/50 animate-pulse rounded" />)}
          </div>
          <div className="w-[60%] flex flex-col bg-background p-8 space-y-8">
            <div className="h-8 w-2/3 bg-secondary/50 animate-pulse rounded" />
            <div className="h-32 bg-secondary/50 animate-pulse rounded" />
            <div className="h-32 bg-secondary/50 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300 items-center justify-center">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground text-sm mb-6">{errorMsg}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-6">
        <ListTodo className="w-5 h-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold tracking-tight">Execution Workspace</h1>
      </div>

      <div className="flex-1 flex gap-0 border border-border/50 rounded-lg bg-card shadow-sm overflow-hidden">
        
        {/* Left Pane: Issue List */}
        <div className="w-[40%] flex flex-col border-r border-border/50 bg-background/50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background">
            <span className="text-sm font-medium text-muted-foreground">Active Tasks</span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{tasks.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground">All clear</h3>
                <p className="mt-1">No pending tasks for this version.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {tasks.map(task => (
                  <button 
                    key={task.id}
                    onClick={() => setSelectedTask(task.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${selectedTask === task.id ? 'bg-secondary/50' : 'hover:bg-secondary/30'}`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {task.status === "done" ? (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium truncate ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          {task.severity === "blocking" ? <ShieldAlert className="w-3 h-3 text-destructive" /> : <Target className="w-3 h-3 text-warning" />}
                          {task.priority_label}
                        </span>
                        <span className="text-muted-foreground truncate">{task.problem}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Issue Detail */}
        <div className="w-[60%] flex flex-col bg-background relative">
          {activeTaskData ? (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="bg-secondary px-2 py-1 rounded">APX-{activeTaskData.id}</span>
                  <span>{activeTaskData.status === 'done' ? 'Done' : 'In Progress'}</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  {activeTaskData.status === 'done' ? 'Reopen' : 'Mark Done'}
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">{activeTaskData.title}</h2>
                  <div className="flex gap-4 text-sm text-muted-foreground mb-8">
                    <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Effort: {activeTaskData.estimated_effort}</span>
                    <span className="flex items-center gap-1.5 text-success"><Target className="w-4 h-4" /> Impact: {activeTaskData.expected_impact}</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Problem</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activeTaskData.problem}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Why Investors Care</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activeTaskData.why_investors_care}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Definition of Done</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activeTaskData.definition_of_done}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Verification Criteria</h3>
                    <div className="bg-secondary/30 p-4 rounded-md text-sm text-muted-foreground border border-border/50">
                      {activeTaskData.verification_criteria}
                    </div>
                  </section>
                </div>

                {/* Provenance */}
                <div className="pt-8 mt-8 border-t border-border/30">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                    <GitCommit className="w-4 h-4" /> Provenance Chain
                  </div>
                  <div className="flex flex-col gap-4 text-muted-foreground">
                    {activeTaskData.linked_claim_text && (
                      <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 text-sm text-foreground">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Source Claim</span>
                        "{activeTaskData.linked_claim_text}"
                      </div>
                    )}
                    {activeTaskData.linked_conflict_text && (
                      <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 text-sm text-foreground">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Source Conflict</span>
                        {activeTaskData.linked_conflict_text}
                      </div>
                    )}
                    {activeTaskData.linked_assumption_text && (
                      <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 text-sm text-foreground">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Source Assumption</span>
                        {activeTaskData.linked_assumption_text}
                      </div>
                    )}
                    {!activeTaskData.linked_claim_text && !activeTaskData.linked_conflict_text && !activeTaskData.linked_assumption_text && (
                      <span className="text-sm">System generated task based on overall narrative analysis.</span>
                    )}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <ListTodo className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-foreground">No task selected</h3>
                <p className="text-sm text-muted-foreground mt-1">Select a task from the list to view details.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
