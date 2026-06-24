"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
