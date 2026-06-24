"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Send, Bot, User, AlertCircle, ShieldAlert, FileText, Crosshair, ChevronRight, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";

export function CopilotChat({ dealId, crossDeal = false, fullHeight = false }: { dealId?: string | number, crossDeal?: boolean, fullHeight?: boolean }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!crossDeal && dealId) {
      loadSession();
      loadSuggested();
    }
  }, [dealId, crossDeal]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSession = async () => {
    try {
      const res = await api.getCopilotSession(dealId as string);
      if (res && res.messages) {
        setMessages(res.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadSuggested = async () => {
    try {
      const res = await api.getSuggestedCopilotQuestions(dealId as string);
      if (res) setSuggested(res);
    } catch (e) {
      console.error(e);
    }
  };

  const clearSession = async () => {
    if (dealId && !crossDeal) {
      await api.clearCopilotSession(dealId);
      setMessages([]);
    }
  };

  const askQuestion = async (q: string) => {
    if (!q.trim()) return;
    const newMsg = { role: "user", content: q, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      let answer;
      if (crossDeal) {
         answer = await api.askWorkspaceCopilot(q);
      } else {
         answer = await api.askDealCopilot(dealId as string, q);
      }
      
      const aiMsg = { 
        role: "copilot", 
        content: answer.answer, 
        timestamp: new Date().toISOString(),
        fullAnswer: answer 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "copilot", content: "Sorry, I encountered an error retrieving evidence.", timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const renderCopilotAnswer = (msg: any) => {
    if (!msg.fullAnswer) {
      return <p className="text-sm text-foreground/90">{msg.content}</p>;
    }
    
    const ans = msg.fullAnswer;
    return (
      <div className="space-y-4 w-full">
        {/* Main Answer Card */}
        <div className="bg-background/80 backdrop-blur-md rounded-xl p-5 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <p className="font-semibold text-foreground mb-3 text-base">{ans.short_answer}</p>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
             {ans.answer.split('\n\n').map((paragraph: string, i: number) => {
                const parts = paragraph.split('**');
                return (
                  <p key={i}>
                    {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-emerald-700 dark:text-emerald-400">{part}</strong> : part)}
                  </p>
                )
             })}
          </div>
        </div>

        {/* Guardrail Flags */}
        {ans.guardrail_flags && ans.guardrail_flags.length > 0 && (
          <div className="flex gap-2 flex-wrap px-1">
            {ans.guardrail_flags.map((f: string) => (
              <span key={f} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                {f.replace(/_/g, ' ').toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Evidence Used Widget */}
        {ans.evidence_used && ans.evidence_used.length > 0 && (
          <div className="bg-emerald-500/5 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20 shadow-sm">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-1.5" /> Verified Evidence
            </h4>
            <ul className="space-y-2.5">
              {ans.evidence_used.map((ev: any, idx: number) => (
                <li key={idx} className="text-sm text-foreground flex items-start bg-background/60 p-2 rounded-lg border border-border/50">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-emerald-500 shrink-0" />
                  <span>
                    <span className="font-semibold">{ev.label}</span> 
                    <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">{ev.module}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Unknowns Widget */}
        {ans.unknowns && ans.unknowns.length > 0 && (
          <div className="bg-destructive/5 backdrop-blur-sm rounded-xl p-4 border border-destructive/20 shadow-sm">
            <h4 className="text-xs font-bold text-destructive uppercase tracking-widest mb-3 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1.5" /> Diligence Gaps
            </h4>
            <ul className="space-y-2">
              {ans.unknowns.map((u: string, idx: number) => (
                <li key={idx} className="text-sm text-foreground/90 flex items-start">
                  <div className="w-1.5 h-1.5 bg-destructive rounded-full mr-2.5 mt-2 shrink-0 shadow-sm shadow-destructive/50"></div> 
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Impact & Action Cards */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-l-emerald-500 border-y border-r border-border/50 shadow-sm">
             <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Decision Impact</h4>
             <p className="text-sm font-semibold text-foreground leading-tight">{ans.decision_impact}</p>
           </div>
           <div className="bg-gradient-to-br from-emerald-600 to-indigo-700 rounded-xl p-4 shadow-md text-white">
             <h4 className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1.5">Next Best Action</h4>
             <p className="text-sm font-semibold leading-tight">{ans.recommended_next_action}</p>
           </div>
        </div>
        
        {/* Follow Ups */}
        {ans.follow_up_questions && ans.follow_up_questions.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center">
              <Bot className="w-3.5 h-3.5 mr-1" /> Suggested Deep Dives
            </p>
            <div className="flex flex-wrap gap-2">
              {ans.follow_up_questions.map((fq: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => askQuestion(fq.question)}
                  className="text-left text-xs font-medium bg-background/80 border border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  {fq.question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${fullHeight ? 'h-[600px] max-h-[80vh]' : 'h-full'} bg-gradient-to-br from-background via-emerald-950/5 to-indigo-950/10 rounded-xl border border-border/50 overflow-hidden shadow-2xl backdrop-blur-xl`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background/60 backdrop-blur-md border-b border-emerald-500/20 shadow-sm relative overflow-hidden">
        <div className="flex items-center relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 backdrop-blur-md flex items-center justify-center mr-3 border border-emerald-500/20 shadow-inner">
            <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base tracking-wide">Ask Apex</h3>
            <p className="text-[11px] text-muted-foreground font-medium tracking-wider uppercase">Intelligence Engine</p>
          </div>
        </div>
        {!crossDeal && messages.length > 0 && (
          <button onClick={clearSession} className="relative z-10 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-full transition-colors border border-border">
            Clear Context
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-8 relative">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 relative z-10">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-inner border border-emerald-500/20">
              <Crosshair className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold text-foreground mb-3 tracking-tight">Copilot Initialized</h4>
            <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
              I am natively connected to the Data Room and Evidence Center. Ask me to synthesize financials, analyze diligence gaps, or run fund math scenarios.
            </p>
            
            {!crossDeal && suggested.length > 0 && (
              <div className="w-full max-w-md space-y-3">
                {suggested.slice(0, 4).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => askQuestion(q)}
                    className="w-full text-left px-5 py-4 text-sm bg-background/60 hover:bg-emerald-500/5 border border-border/50 hover:border-emerald-500/30 rounded-xl transition-all flex items-center justify-between shadow-sm hover:shadow-md group backdrop-blur-sm"
                  >
                    <span className="font-medium text-foreground/80 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{q}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex relative z-10 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] w-full flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-secondary border border-border ml-3' : 'bg-gradient-to-br from-emerald-500 to-indigo-600 mr-3'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-foreground/70" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`mt-1 ${msg.role === 'user' ? 'bg-secondary border border-border/50 text-foreground px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm' : 'w-full'}`}>
                  {msg.role === 'user' ? (
                    <p className="text-sm font-medium">{msg.content}</p>
                  ) : (
                    renderCopilotAnswer(msg)
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start relative z-10">
            <div className="flex flex-row max-w-[85%]">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shrink-0 mr-3 shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
               </div>
               <div className="mt-2.5 flex space-x-1.5 bg-background/80 backdrop-blur-sm px-4 py-2.5 rounded-full border border-border/50 shadow-sm">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="p-4 bg-background/60 backdrop-blur-md border-t border-border/50 relative z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <form 
          onSubmit={(e) => { e.preventDefault(); askQuestion(input); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={crossDeal ? "Ask Apex across the fund..." : "Ask Apex about this deal..."}
            className="w-full bg-background/80 border border-border/50 rounded-full pl-5 pr-14 py-3.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-muted-foreground shadow-inner"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 w-9 h-9 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 disabled:bg-muted text-white rounded-full transition-all disabled:opacity-50 hover:scale-105 active:scale-95 shadow-sm"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        <div className="flex items-center justify-center mt-3 space-x-1.5 opacity-60">
          <ShieldAlert className="w-3 h-3 text-muted-foreground" />
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Responses grounded in verified Data Room Evidence.</p>
        </div>
      </div>
    </div>
  );
}
