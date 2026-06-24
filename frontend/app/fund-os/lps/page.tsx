"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Building, ShieldCheck, TrendingUp } from "lucide-react";

export default function LPsPage() {
  const [lps, setLPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getLPs();
        setLPs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading LP profiles...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-6">
        <Link href="/fund-os" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">LP Relationships</h1>
          <p className="text-zinc-400">Manage institutional and family office LP intelligence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lps.map((lp) => (
          <Card key={lp.lp_id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-zinc-800 flex items-center justify-center text-indigo-400 shrink-0">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-white">{lp.name}</h3>
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400 font-normal">{lp.type}</Badge>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-zinc-400">
                      <span>Committed: ${(lp.committed_amount / 1000000).toFixed(1)}M</span>
                      <span>Relationship: {lp.relationship_status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Key Interests</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {lp.key_interests.map((interest: string, i: number) => (
                      <Badge key={i} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-normal">{interest}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-800/50">
                <div className="flex items-start gap-2 text-sm text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <span className="font-medium text-zinc-300">Notes:</span> {lp.notes}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
