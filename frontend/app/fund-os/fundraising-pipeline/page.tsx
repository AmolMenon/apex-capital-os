"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Calendar } from "lucide-react";

export default function FundraisingPipelinePage() {
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getFundraisingPipeline();
        setPipeline(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading pipeline...</div>;

  const stages = ["Target", "First Meeting", "Diligence", "Data Room", "Committed"];

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-6">
        <Link href="/fund-os" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Fundraising Pipeline</h1>
          <p className="text-zinc-400">CRM for LP prospecting and capital raising.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const items = pipeline.filter(p => p.stage === stage);
          return (
            <div key={stage} className="space-y-4 min-w-[250px]">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="font-medium text-zinc-300">{stage}</h3>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">{items.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {items.map(item => (
                  <Card key={item.item_id} className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-4">
                      <div className="font-medium text-white mb-1">{item.lp_name}</div>
                      <div className="text-xs text-zinc-500 mb-3">{item.lp_type}</div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-emerald-400">${(item.target_amount / 1000000).toFixed(1)}M</span>
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                          <Target className="w-3 h-3" /> {Math.round(item.probability * 100)}%
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-zinc-400 flex items-start gap-1">
                        <Calendar className="w-3 h-3 mt-0.5 shrink-0" />
                        Next: {item.next_action}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="text-sm text-zinc-600 italic p-2 border border-dashed border-zinc-800 rounded">
                    No LPs in this stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
