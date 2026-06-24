"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function ThesisDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [thesis, setThesis] = useState<any>(null);
  const [marketMap, setMarketMap] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [t, m, c] = await Promise.all([
          api.getThesis(id),
          api.getMarketMap(id),
          api.discoverCompanies(id)
        ]);
        setThesis(t);
        setMarketMap(m);
        setCompanies(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  const handleDiscover = async () => {
    setDiscovering(true);
    try {
      const results = await api.discoverCompanies(id);
      setCompanies(results);
    } catch (err) {
      console.error(err);
    } finally {
      setDiscovering(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Thesis...</div>;
  if (!thesis) return <div className="p-8 text-white">Thesis not found.</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">{thesis.name}</h1>
          <div className="flex gap-2">
            <Badge className="bg-indigo-500/20 text-indigo-400">{thesis.geography.join(", ")}</Badge>
            <Badge className="bg-zinc-800 text-zinc-300">{thesis.stage_preference.join(", ")}</Badge>
            <Badge className="bg-emerald-500/10 text-emerald-400">{thesis.cheque_size}</Badge>
          </div>
        </div>
        <Button 
          onClick={handleDiscover} 
          disabled={discovering}
          className="bg-indigo-600 hover:bg-indigo-700 text-white border-0"
        >
          {discovering ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
          Discover Companies
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-zinc-100">Discovered Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {companies.length === 0 ? (
                <p className="text-zinc-500 text-sm">No companies discovered yet. Click Discover Companies to scan the market.</p>
              ) : (
                <div className="space-y-4">
                  {companies.map(c => (
                    <div key={c.company_id} className="flex justify-between items-center p-4 border border-zinc-800 rounded bg-zinc-950/50">
                      <div>
                        <h4 className="text-lg font-medium text-zinc-200">{c.company_name}</h4>
                        <p className="text-sm text-zinc-400">{c.public_description.substring(0, 80)}...</p>
                      </div>
                      <Link href={`/sourcing/companies/${c.company_id}`}>
                        <Button variant="outline" size="sm" className="border-zinc-700 bg-zinc-900 text-zinc-300">View Profile</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {marketMap && marketMap.categories.length > 0 && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-zinc-100">Market Map</CardTitle>
              </CardHeader>
              <CardContent>
                {marketMap.categories.map((cat: any) => (
                  <div key={cat.category_name} className="mb-6 last:mb-0">
                    <h4 className="text-md font-medium text-indigo-400 mb-3">{cat.category_name}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-xs text-zinc-500 uppercase">Target Companies</span>
                        <div className="flex flex-wrap gap-2">
                          {cat.companies.map((c: string) => <Badge key={c} variant="secondary" className="bg-zinc-800 text-zinc-300">{c}</Badge>)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-zinc-500 uppercase">Benchmarks</span>
                        <div className="flex flex-wrap gap-2">
                          {cat.benchmark_companies.map((b: string) => <Badge key={b} variant="outline" className="border-zinc-700 text-zinc-400">{b}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-zinc-100">Must Have Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2 text-sm text-zinc-300">
                {thesis.must_have_signals.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-red-400">Red Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2 text-sm text-zinc-300">
                {thesis.red_flags.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-zinc-100">Fund Math</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">{thesis.fund_math_constraints}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
