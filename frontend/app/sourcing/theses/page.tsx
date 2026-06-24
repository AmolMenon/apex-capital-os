"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ThesesPage() {
  const [theses, setTheses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const t = await api.getTheses();
        setTheses(t);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Theses...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">Fund Theses Map</h1>
        <p className="text-zinc-400">Strategic investment mandates guiding company discovery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theses.map(thesis => (
          <Link key={thesis.thesis_id} href={`/sourcing/theses/${thesis.thesis_id}`}>
            <Card className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-zinc-100">{thesis.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300">
                    {thesis.stage_preference[0]}
                  </Badge>
                  <Badge variant="outline" className="border-zinc-700 bg-zinc-800 text-zinc-300">
                    {thesis.geography[0]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Sector Focus</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {thesis.sector_focus.slice(0, 3).join(", ")}
                    {thesis.sector_focus.length > 3 && ", ..."}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Benchmarks</h4>
                  <div className="flex flex-wrap gap-2">
                    {thesis.benchmark_companies.map((b: string) => (
                      <span key={b} className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400">{b}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
