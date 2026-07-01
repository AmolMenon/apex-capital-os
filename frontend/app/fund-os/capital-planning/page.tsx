"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Landmark, DollarSign, Download } from "lucide-react";

export default function CapitalPlanningPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getCapitalCalls();
        setCalls(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading capital planning...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6 mb-4">
        <div className="flex items-center gap-4">
          <Link href="/fund-os" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-2">Capital Calls & Distributions</h1>
            <p className="text-zinc-400">Manage liquidity events and LP cashflows.</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">Model New Capital Call</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-400" /> Capital Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {calls.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-zinc-800 rounded">
                <p className="text-zinc-500 mb-4">No historical capital calls recorded.</p>
                <Button variant="outline" className="border-zinc-700 text-zinc-300">Evaluate Initial Call Draft</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {calls.map((call, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-zinc-950 rounded border border-zinc-800">
                    <div>
                      <div className="font-medium text-white">{call.timing}</div>
                      <div className="text-sm text-zinc-500">{call.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-medium">${(call.suggested_amount / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" /> Distributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 border border-dashed border-zinc-800 rounded">
              <p className="text-zinc-500 mb-4">Fund is currently in active deployment phase. No realized proceeds available for distribution.</p>
              <Button disabled variant="outline" className="border-zinc-800 text-zinc-600">Model Distribution</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
