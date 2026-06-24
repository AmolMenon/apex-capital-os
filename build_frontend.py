import os

base_path = "frontend/app/operations"
os.makedirs(base_path, exist_ok=True)
os.makedirs(os.path.join(base_path, "tasks"), exist_ok=True)
os.makedirs(os.path.join(base_path, "workflows"), exist_ok=True)
os.makedirs(os.path.join(base_path, "alerts"), exist_ok=True)
os.makedirs(os.path.join(base_path, "approvals"), exist_ok=True)
os.makedirs(os.path.join(base_path, "cadence"), exist_ok=True)

files = {
    "page.tsx": """
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OperationsHQ() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // We can just fetch tasks and alerts for now as a summary
    Promise.all([
      api.getTasks(),
      api.getAlerts(),
      api.getNextActions(),
    ]).then(([tasks, alerts, nextActions]) => {
      setData({ tasks, alerts, nextActions });
    });
  }, []);

  if (!data) return <div className="p-8">Loading Operations HQ...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Operations HQ</h1>
        <div className="space-x-2">
          <Button onClick={() => api.generateTasks()}>Generate Tasks</Button>
          <Button variant="outline" onClick={() => api.refreshAlerts()}>Refresh Alerts</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Today's Priorities</CardTitle></CardHeader>
          <CardContent>
            {data.tasks.filter((t: any) => t.priority === "critical" || t.priority === "high").slice(0,5).map((t: any) => (
              <div key={t.task_id} className="mb-4 border-b pb-2">
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-muted-foreground">{t.owner} • Due: {new Date(t.due_date).toLocaleDateString()}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Active Alerts</CardTitle></CardHeader>
          <CardContent>
            {data.alerts.map((a: any) => (
              <div key={a.alert_id} className="mb-4 border-b pb-2">
                <div className="font-medium text-red-500">{a.title}</div>
                <div className="text-sm text-muted-foreground">{a.reason}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Next Best Actions</CardTitle></CardHeader>
          <CardContent>
            {data.nextActions.slice(0,5).map((a: any) => (
              <div key={a.action_id} className="mb-4 border-b pb-2">
                <div className="font-medium">{a.action}</div>
                <div className="text-sm text-muted-foreground">{a.why_now}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
""",
    "tasks/page.tsx": """
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    api.getTasks().then(setTasks);
  }, []);

  const completeTask = async (id: string) => {
    await api.completeTask(id);
    api.getTasks().then(setTasks);
  };
  
  const blockTask = async (id: string) => {
    await api.blockTask(id);
    api.getTasks().then(setTasks);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Task Board</h1>
      <div className="grid gap-4">
        {tasks.map(t => (
          <Card key={t.task_id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{t.title}</h3>
                <p className="text-sm text-muted-foreground">Owner: {t.owner} | Priority: {t.priority} | Status: {t.status}</p>
                <p className="text-sm mt-2">{t.description}</p>
              </div>
              <div className="space-x-2 flex">
                <Button variant="outline" onClick={() => completeTask(t.task_id)}>Complete</Button>
                <Button variant="destructive" onClick={() => blockTask(t.task_id)}>Block</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
""",
    "workflows/page.tsx": """
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
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
              <p className="text-sm text-muted-foreground">Stage: {w.current_stage} -> {w.next_stage || 'Done'}</p>
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
""",
    "alerts/page.tsx": """
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    api.getAlerts().then(setAlerts);
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">System Alerts</h1>
      <div className="grid gap-4">
        {alerts.map(a => (
          <Card key={a.alert_id} className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-red-500">{a.title}</h3>
              <p className="text-sm mt-1">{a.reason}</p>
              <p className="text-sm font-medium mt-2">Action: {a.recommended_action}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
""",
    "approvals/page.tsx": """
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);

  useEffect(() => {
    api.getApprovals().then(setApprovals);
  }, []);

  const approve = async (id: string) => {
    await api.approveRequest(id);
    api.getApprovals().then(setApprovals);
  };

  const reject = async (id: string) => {
    await api.rejectRequest(id);
    api.getApprovals().then(setApprovals);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Pending Approvals</h1>
      <div className="grid gap-4">
        {approvals.map(a => (
          <Card key={a.approval_id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{a.action}</h3>
                <p className="text-sm text-muted-foreground">Requester: {a.requester} | Status: {a.status}</p>
                <p className="text-sm mt-2">{a.reason}</p>
              </div>
              {a.status === 'pending' && (
                <div className="space-x-2 flex">
                  <Button onClick={() => approve(a.approval_id)}>Approve</Button>
                  <Button variant="destructive" onClick={() => reject(a.approval_id)}>Reject</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
""",
    "cadence/page.tsx": """
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CadencePage() {
  const [daily, setDaily] = useState<any>(null);
  const [weekly, setWeekly] = useState<any>(null);

  useEffect(() => {
    api.getDailyCadence().then(setDaily);
    api.getWeeklyPartnerCadence().then(setWeekly);
  }, []);

  if (!daily || !weekly) return <div className="p-8">Loading Cadence...</div>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Operating Cadence</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>{daily.title}</CardTitle></CardHeader>
          <CardContent>
            <h4 className="font-medium mt-2">Agenda</h4>
            <ul className="list-disc pl-5 text-sm">
              {daily.agenda.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
            <h4 className="font-medium mt-4">Required Prep</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {daily.required_prep.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{weekly.title}</CardTitle></CardHeader>
          <CardContent>
            <h4 className="font-medium mt-2">Agenda</h4>
            <ul className="list-disc pl-5 text-sm">
              {weekly.agenda.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
            <h4 className="font-medium mt-4">Required Prep</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {weekly.required_prep.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"""
}

for filename, content in files.items():
    path = os.path.join(base_path, filename)
    with open(path, "w") as f:
        f.write(content.strip() + "\n")

print("Frontend files created.")
