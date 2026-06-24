"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SourcedCompanyProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [company, setCompany] = useState<any>(null);
  const [outreach, setOutreach] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const c = await api.getSourcedCompany(id);
        setCompany(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  const handleConvert = async () => {
    setConverting(true);
    try {
      const res = await api.convertSourcedCompanyToDeal(id);
      if (res.success) {
        // Automatically jump to deal room or pipeline
        router.push("/pipeline");
      }
    } catch (err) {
      console.error(err);
      setConverting(false);
    }
  };

  const handleDraftOutreach = async () => {
    try {
      const res = await api.generateFounderOutreach(id);
      setOutreach(res);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading Profile...</div>;
  if (!company) return <div className="p-8 text-white">Company not found.</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-start border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">{company.company_name}</h1>
          <div className="flex gap-2 mb-2">
            <Badge className="bg-indigo-500/20 text-indigo-400">{company.sector}</Badge>
            <Badge className="bg-zinc-800 text-zinc-300">{company.stage_estimate}</Badge>
            <Badge className={company.status === "Lead" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}>
              {company.status}
            </Badge>
          </div>
          <p className="text-zinc-400 max-w-2xl">{company.public_description}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-300" onClick={handleDraftOutreach}>
            Draft Outreach
          </Button>
          <Button onClick={handleConvert} disabled={converting} className="bg-emerald-600 hover:bg-emerald-700 text-white border-0">
            {converting ? "Converting..." : "Convert to Deal"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-zinc-100">Thesis Fit</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-2">Reasons for Fit</h4>
                <ul className="list-disc pl-4 text-sm text-zinc-300 space-y-1">
                  {company.thesis_fit.reasons_for_fit.map((r: string, i: number) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">Reasons Against Fit</h4>
                <ul className="list-disc pl-4 text-sm text-zinc-300 space-y-1">
                  {company.thesis_fit.reasons_against_fit.map((r: string, i: number) => <li key={i}>{r}</li>)}
                  {company.thesis_fit.reasons_against_fit.length === 0 && <li className="text-zinc-500">None identified</li>}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-zinc-100">Public Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.signals.map((s: any, i: number) => (
                <div key={i} className="p-4 border border-zinc-800 rounded bg-zinc-950/50">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-zinc-200">{s.signal}</h4>
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400">{s.signal_type}</Badge>
                  </div>
                  <p className="text-sm text-zinc-400 mt-2">Source: <span className="text-zinc-300">{s.source}</span> ({s.confidence} confidence)</p>
                  <p className="text-sm text-zinc-500 mt-1">Why it matters: {s.why_it_matters}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {outreach && (
            <Card className="bg-zinc-900 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-indigo-400">Founder Outreach Engine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">Email Draft</h4>
                  <Textarea className="bg-zinc-950 border-zinc-800 text-zinc-300 h-32 font-mono text-sm" value={outreach.email_draft} readOnly />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">LinkedIn Message</h4>
                  <Textarea className="bg-zinc-950 border-zinc-800 text-zinc-300 h-24 font-mono text-sm" value={outreach.linkedin_message} readOnly />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-300 mb-2">Analyst Call Prep Notes</h4>
                  <p className="text-sm text-zinc-400 bg-zinc-950 p-4 rounded border border-zinc-800">{outreach.call_prep_notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-zinc-100">Sourcing Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-light text-indigo-400 mb-4 flex items-end gap-2">
                {company.sourcing_score.total_score} <span className="text-sm text-zinc-500 mb-1">/ 100</span>
              </div>
              <p className="text-xs text-zinc-500 mb-6 pb-4 border-b border-zinc-800">The overall Sourcing Score determines priority for founder outreach based on a weighted average of the metrics below.</p>
              
              <div className="space-y-4 text-sm text-zinc-400">
                <div className="space-y-1">
                  <div className="flex justify-between font-medium"><span>Thesis Fit</span><span className="text-zinc-200">{company.sourcing_score.thesis_fit}/100</span></div>
                  <p className="text-xs text-zinc-500">Measures strict alignment with our active firm strategy.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-medium"><span>Signal Strength</span><span className="text-zinc-200">{company.sourcing_score.signal_strength}/100</span></div>
                  <p className="text-xs text-zinc-500">Tracks velocity of engineering hiring, Github activity, or compute scaling.</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-medium"><span>Market Timing</span><span className="text-zinc-200">{company.sourcing_score.market_timing}/100</span></div>
                  <p className="text-xs text-zinc-500">Evaluates urgency based on competitor fundraises and sector heat.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-zinc-100">Unknowns & Risks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs uppercase text-zinc-500 mb-1">Missing Info</h4>
                <ul className="list-disc pl-4 text-sm text-zinc-300">
                  {company.unknowns.map((u: string, i: number) => <li key={i}>{u}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase text-zinc-500 mb-1">Analyst Assumptions</h4>
                <ul className="list-disc pl-4 text-sm text-zinc-300">
                  {company.assumptions.map((u: string, i: number) => <li key={i}>{u}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
