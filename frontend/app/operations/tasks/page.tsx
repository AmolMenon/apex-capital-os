"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
