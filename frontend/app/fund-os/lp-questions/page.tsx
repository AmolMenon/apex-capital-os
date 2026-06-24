"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, ShieldAlert, Sparkles } from "lucide-react";

export default function LPQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getLPQuestions();
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading questions...</div>;

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-6">
        <Link href="/fund-os" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Institutional LP Q&A Simulator</h1>
          <p className="text-zinc-400">Anticipate and prepare for the hardest questions from institutional allocators.</p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <Card key={q.question_id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex gap-2 items-center mb-4">
                <Badge className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20">{q.category}</Badge>
              </div>
              
              <h2 className="text-xl font-medium text-white mb-2 flex items-start gap-2">
                <MessageSquare className="w-5 h-5 text-zinc-400 mt-1 shrink-0" />
                "{q.question_text}"
              </h2>
              
              <div className="ml-7 space-y-4">
                <p className="text-sm text-zinc-400 italic mb-4">
                  Why LPs ask this: {q.why_lp_asks}
                </p>

                <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4">
                  <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Current Firm Answer
                  </h4>
                  <p className="text-zinc-300 text-sm">{q.current_answer}</p>
                </div>

                {q.evidence_missing?.length > 0 && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-md p-4">
                    <h4 className="text-sm font-medium text-rose-400 mb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Vulnerabilities / Missing Evidence
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-rose-300/80 space-y-1">
                      {q.evidence_missing.map((e: string, i: number) => <li key={i}>{e}</li>)}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-rose-500/20">
                      <span className="font-semibold text-rose-400 text-xs">Recommended Action: </span>
                      <span className="text-rose-300/80 text-xs">{q.recommended_preparation}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
