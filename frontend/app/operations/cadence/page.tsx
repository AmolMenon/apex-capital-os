"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
