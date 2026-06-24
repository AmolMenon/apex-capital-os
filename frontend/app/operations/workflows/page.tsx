"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);

  useEffect(() => {
    api.getWorkflows().then(setWorkflows);
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Workflows</h1>
      <div className="grid gap-4">
        {workflows.map(w => (
          <Card key={w.entity_id}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg capitalize">{w.entity_type}: {w.entity_id}</h3>
              <p className="text-sm text-muted-foreground">Stage: {w.current_stage} &rarr; {w.next_stage || 'Done'}</p>
              <div className="mt-2 w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${w.completion_percentage}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
