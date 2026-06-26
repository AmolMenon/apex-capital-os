"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, Loader2, AlertTriangle, MessageSquare, Hash, Globe, Users, Target, Activity, ShieldAlert, Printer, CheckCircle, CircleX, User, Flame, Wrench, CheckSquare, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = {
  positive: '#22c55e', // green-500
  negative: '#ef4444', // red-500
  mixed: '#f59e0b',    // amber-500
  neutral: '#64748b'   // slate-500
};

export default function PlatformDiligenceReportPage() {
  const params = useParams();
  const dealId = params.id as string;
  const runId = params.run_id as string;

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [dealId, runId]);

  const fetchData = async () => {
    try {
      const data = await api.getPlatformDiligenceReport(dealId, runId);
      setReport(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-slate-400">Report not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20 dark:bg-[#0B0C10] dark:text-gray-200 print:bg-white print:text-black print:m-0 print:p-4 print:max-w-none print:space-y-6 print:pb-0">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end border-b border-gray-200 dark:border-white/10 pb-6 print:hidden">
        <div>
          <Link href={`/deals/${dealId}/platform-diligence`} className="inline-flex items-center text-sm text-blue-500 hover:text-blue-400 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Platform Diligence
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
            Intelligence Report
          </h1>
          <div className="text-gray-500 dark:text-gray-400 font-medium">Run ID: <span className="font-mono text-xs text-gray-400 dark:text-gray-500">{runId}</span> • Status: <Badge variant="secondary" className="uppercase bg-blue-500/10 text-blue-500 border-blue-500/20">{report.status}</Badge></div>
        </div>
        <div>
           <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors">
              <Printer className="h-4 w-4" /> Export PDF
           </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block border-b border-gray-200 pb-6 mb-8">
         <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Platform Diligence Report</h1>
         <div className="text-gray-500 font-medium">Generated for Deal ID: {dealId}</div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-5 rounded-xl shadow-sm backdrop-blur-md flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
        <div className="text-sm">
          <span className="font-semibold block mb-1">Analyst Disclaimer</span>
          Public platform diligence output is considered directional signal only and requires further primary verification. <br/>
          <span className="opacity-80 italic mt-1 block">{report.metadata?.bias_and_limitations_note}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Sentiments & Insights */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Executive Synthesis */}
          <section className="bg-gradient-to-br from-gray-900 to-black dark:from-white/10 dark:to-white/5 print:bg-none print:bg-gray-100 print:text-black print:border-gray-300 border border-gray-800 dark:border-white/20 rounded-2xl p-6 shadow-xl text-white print:shadow-none print:break-inside-avoid">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-indigo-400" /> Executive Synthesis</h2>
             <div className="mb-5 p-4 bg-white/10 rounded-xl border border-white/10">
               <span className="text-sm font-semibold block mb-2 text-indigo-300">General Consensus</span>
               <p className="text-sm text-gray-200 leading-relaxed">{report.sentiment_summary?.general_consensus || report.decision_impact}</p>
             </div>
             
             <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2 text-green-400 mb-2"><CheckCircle className="h-4 w-4" /> The Good</h4>
                  <ul className="space-y-2">
                    {report.sentiment_summary?.the_good?.map((g: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-green-500 shrink-0"></span>{g}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2 text-red-400 mb-2 mt-4"><CircleX className="h-4 w-4" /> The Bad</h4>
                  <ul className="space-y-2">
                    {report.sentiment_summary?.the_bad?.map((b: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-red-500 shrink-0"></span>{b}</li>
                    ))}
                  </ul>
                </div>
             </div>
          </section>

          <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md break-inside-avoid print:shadow-none print:border-gray-300">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Activity className="h-5 w-5 text-indigo-500" /> Sentiment Matrix</h2>
            
            {/* Visual Analytics */}
            <div className="mb-6 bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-100 dark:border-white/5 min-h-[250px] flex items-center justify-center relative">
              {(report.sentiment_summary?.positive === 0 && report.sentiment_summary?.negative === 0 && report.sentiment_summary?.mixed === 0) ? (
                <div className="text-gray-400">Not enough data to visualize.</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Positive', value: report.sentiment_summary?.positive || 0, color: COLORS.positive },
                        { name: 'Negative', value: report.sentiment_summary?.negative || 0, color: COLORS.negative },
                        { name: 'Mixed', value: report.sentiment_summary?.mixed || 0, color: COLORS.mixed },
                        { name: 'Neutral', value: report.sentiment_summary?.neutral || 0, color: COLORS.neutral }
                      ].filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {
                        [
                          { name: 'Positive', value: report.sentiment_summary?.positive || 0, color: COLORS.positive },
                          { name: 'Negative', value: report.sentiment_summary?.negative || 0, color: COLORS.negative },
                          { name: 'Mixed', value: report.sentiment_summary?.mixed || 0, color: COLORS.mixed },
                          { name: 'Neutral', value: report.sentiment_summary?.neutral || 0, color: COLORS.neutral }
                        ].filter(d => d.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111318', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Overlay center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-gray-800 dark:text-gray-100">{report.sentiment_summary?.sample_size || 0}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Signals</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 print:hidden">
              <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl text-center border border-green-100 dark:border-green-500/20">
                <div className="text-3xl font-black text-green-600 dark:text-green-400">{report.sentiment_summary?.positive || 0}</div>
                <div className="text-xs font-semibold text-green-800 dark:text-green-500 uppercase tracking-wider mt-1">Positive</div>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-xl text-center border border-red-100 dark:border-red-500/20">
                <div className="text-3xl font-black text-red-600 dark:text-red-400">{report.sentiment_summary?.negative || 0}</div>
                <div className="text-xs font-semibold text-red-800 dark:text-red-500 uppercase tracking-wider mt-1">Negative</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Dominant Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {report.sentiment_summary?.strongest_themes?.map((t: string) => (
                    <Badge key={t} variant="outline" className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30">{t}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 mt-4">Vulnerabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {report.sentiment_summary?.weakest_themes?.map((t: string) => (
                    <Badge key={t} variant="outline" className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 shadow-sm backdrop-blur-xl break-inside-avoid print:bg-none print:bg-indigo-50 print:border-indigo-200 print:shadow-none">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="h-5 w-5 text-indigo-500" /> Next Actions</h2>
             
             <ul className="space-y-3">
               {report.next_actions?.map((q: string, idx: number) => (
                 <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                   <div className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                   <span>{q}</span>
                 </li>
               ))}
             </ul>
          </section>
          
          <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm backdrop-blur-xl break-inside-avoid print:shadow-none print:border-gray-300">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-indigo-500" /> Diligence Questions</h2>
             <ul className="space-y-3">
               {report.questions_generated?.map((q: string, idx: number) => (
                 <li key={idx} className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 text-sm text-gray-800 dark:text-gray-200 font-medium">
                   {q}
                 </li>
               ))}
             </ul>
          </section>

        </div>

        {/* Right Column: Deep Dives */}
        <div className="lg:col-span-2 space-y-8">

          {/* Pain Points */}
          <section>
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3"><AlertTriangle className="h-6 w-6 text-orange-500" /> Core Pain Points</h2>
            {report.pain_points?.length === 0 ? <p className="text-gray-500 italic">No pain points identified.</p> : (
              <div className="grid gap-4">
                {report.pain_points?.map((p: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/10 rounded-xl p-0 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group print:shadow-none print:border-gray-300 print:break-inside-avoid">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.urgency?.toLowerCase() === 'critical' || p.urgency?.toLowerCase() === 'high' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}></div>
                    
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="mt-1 text-gray-400">
                          {p.urgency?.toLowerCase() === 'critical' ? <Flame className="h-5 w-5 text-red-500" /> : <AlertTriangle className="h-5 w-5 text-orange-500" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight">{p.pain_point}</h3>
                          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-500">
                            <span className="flex items-center gap-1"><User className="h-3 w-3" /> {p.customer_persona}</span>
                            <Badge variant="outline" className={`capitalize text-[10px] ${p.urgency?.toLowerCase() === 'critical' || p.urgency?.toLowerCase() === 'high' ? 'text-red-600 border-red-200 bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30' : 'text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30'}`}>{p.urgency} Priority</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50/50 dark:bg-black/20">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 italic border-l-2 border-gray-300 dark:border-gray-700 pl-3">"{p.user_language}"</p>
                      <div className="flex items-start gap-2 text-xs">
                        <Wrench className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                           <span className="text-gray-400 font-semibold uppercase tracking-wider block mb-1 text-[10px]">Existing Workaround</span>
                           <p className="font-medium text-gray-800 dark:text-gray-300">{p.existing_workaround}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reputation Risks */}
          <section>
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3"><ShieldAlert className="h-6 w-6 text-red-500" /> Reputation Risks</h2>
            {report.reputation_risks?.length === 0 ? <p className="text-gray-500 italic">No reputation risks detected.</p> : (
              <div className="grid gap-4">
                {report.reputation_risks?.map((r: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/10 rounded-xl p-0 relative overflow-hidden flex print:shadow-none print:border-gray-300 print:break-inside-avoid">
                    <div className="w-1 bg-red-500 shrink-0"></div>
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
                           <ShieldAlert className="h-5 w-5 text-red-500" /> {r.risk || r.risk_type}
                        </h3>
                        <Badge className="bg-red-500 hover:bg-red-600 text-white capitalize shadow-sm">{r.severity} Severity</Badge>
                      </div>
                      {r.source && <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium uppercase tracking-wider">Source: {r.source}</p>}
                      {r.description && <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{r.description}</p>}
                      
                      <label className="flex items-start gap-3 bg-red-50/50 dark:bg-red-500/5 p-3 rounded-lg border border-red-100 dark:border-red-500/10 cursor-pointer group">
                        <div className="mt-0.5 text-gray-400 group-hover:text-indigo-500 transition-colors">
                           <Square className="h-5 w-5" />
                        </div>
                        <div className="text-sm">
                          <span className="font-bold text-red-800 dark:text-red-400 block mb-1">Diligence Action Required</span>
                          <p className="text-gray-700 dark:text-gray-300">{r.suggested_diligence_action || r.diligence_required}</p>
                        </div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Social Signals */}
          <section>
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3"><Hash className="h-6 w-6 text-sky-500" /> Social & Public Signals</h2>
            {[...(report.social_findings || []), ...(report.reddit_findings || []), ...(report.review_platform_findings || [])].length === 0 ? <p className="text-gray-500 italic">No public signals found.</p> : (
              <div className="space-y-4">
                {[...(report.social_findings || []), ...(report.reddit_findings || []), ...(report.review_platform_findings || [])].map((s: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/10 rounded-xl p-5 hover:shadow-md transition-shadow print:shadow-none print:border-gray-300 print:break-inside-avoid">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-lg flex items-center gap-2">
                          {s.source_title} 
                          <span className="text-xs font-normal text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">{s.platform}</span>
                        </a>
                      </div>
                      <Badge variant="outline" className={`capitalize ${s.sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30' : s.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30' : 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10'}`}>
                        {s.sentiment}
                      </Badge>
                    </div>
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 mb-4 text-gray-600 dark:text-gray-300 text-sm italic">
                      "{s.snippet}"
                    </blockquote>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                      <div><span className="font-semibold uppercase tracking-wider text-[10px]">Signal:</span> <span className="capitalize">{s.signal_type?.replace('_', ' ')}</span></div>
                      <div><span className="font-semibold uppercase tracking-wider text-[10px]">Impact:</span> <span className="capitalize">{s.decision_impact}</span></div>
                      {s.bias_warning && <div className="text-amber-600 dark:text-amber-400"><span className="font-semibold uppercase tracking-wider text-[10px]">Bias:</span> {s.bias_warning}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Competitor Findings */}
          <section>
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-3"><Users className="h-6 w-6 text-purple-500" /> Competitor Intelligence</h2>
            {report.competitor_findings?.length === 0 ? <p className="text-gray-500 italic">No competitor intelligence found.</p> : (
              <div className="space-y-6">
                {report.competitor_findings?.map((c: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-gradient-to-b dark:from-[#151821] dark:to-[#0B0C10] border border-gray-200 dark:border-purple-500/20 rounded-2xl p-6 shadow-sm print:bg-none print:bg-white print:border-gray-300 print:shadow-none print:break-inside-avoid">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-white/5">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-black text-xl">
                        {c.competitor_name?.charAt(0) || "C"}
                      </div>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{c.competitor_name}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50/50 dark:bg-green-500/5 p-5 rounded-xl border border-green-100 dark:border-green-500/10">
                          <h4 className="font-bold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><CheckCircle className="h-4 w-4" /> Praised For</h4>
                          <ul className="space-y-2.5">
                            {c.praised_for?.map((p: string) => <li key={p} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><div className="mt-1.5 h-1 w-1 rounded-full bg-green-500 shrink-0"></div> {p}</li>)}
                          </ul>
                        </div>
                        <div className="bg-red-50/50 dark:bg-red-500/5 p-5 rounded-xl border border-red-100 dark:border-red-500/10">
                          <h4 className="font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><AlertTriangle className="h-4 w-4" /> Complaints</h4>
                          <ul className="space-y-2.5">
                            {c.complaints?.map((p: string) => <li key={p} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"><div className="mt-1.5 h-1 w-1 rounded-full bg-red-500 shrink-0"></div> {p}</li>)}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                           <span className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs block mb-2">Feature Gaps</span>
                           <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{c.feature_gaps?.join(', ')}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                           <span className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs block mb-2">Pricing Pain</span>
                           <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{c.pricing_pain}</p>
                        </div>
                      </div>
                      
                      <div className="p-5 rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <span className="text-purple-700 dark:text-purple-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-2"><Target className="h-4 w-4" /> Market Whitespace for Apex</span>
                        <p className="text-purple-950 dark:text-purple-100 font-medium text-lg relative z-10 leading-snug">{c.market_whitespace}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
