"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function OperationsPanel({ entityType, entityId }: { entityType: string, entityId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [nextActions, setNextActions] = useState<any[]>([]);

  useEffect(() => {
    // In a real implementation this would filter by entity
    api.getTasks().then(allTasks => {
      setTasks(allTasks.filter((t: any) => t.source_entity_id === entityId));
    });
    
    // Using the specific endpoint if it exists, else filtering all
    api.getNextActions().then(allActions => {
      setNextActions(allActions.filter((a: any) => a.entity_id === entityId));
    });
  }, [entityId]);

  if (tasks.length === 0 && nextActions.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-blue-500 mb-6 bg-blue-50/50 dark:bg-blue-900/10">
      <CardHeader>
        <CardTitle className="text-blue-700 dark:text-blue-400">Operations Autopilot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nextActions.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-2">Next Best Action</h4>
            {nextActions.map(a => (
              <div key={a.action_id} className="bg-background rounded p-3 text-sm shadow-sm border">
                <span className="font-medium">{a.action}</span>
                <p className="text-muted-foreground mt-1">{a.why_now}</p>
              </div>
            ))}
          </div>
        )}
        
        {tasks.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-2">Open Tasks</h4>
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t.task_id} className="flex justify-between items-center bg-background rounded p-3 text-sm shadow-sm border">
                  <div>
                    <span className="font-medium">{t.title}</span>
                    <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">{t.status}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => api.completeTask(t.task_id)}>
                    Complete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
