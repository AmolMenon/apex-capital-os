"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ShieldAlert, AlertTriangle, Send } from "lucide-react";
import { analytics } from "@/lib/analytics";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DealsService } from "@/services/deals";
import { useGlobalDeal } from "@/components/GlobalDealProvider";

export default function ReadinessPage() {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const { deal } = useGlobalDeal();

  useEffect(() => {
    if (deal) {
      DealsService.getTimeline(deal.id).then(data => {
        if (data.timeline) {
          setTimeline(data.timeline);
        }
      });
    }
  }, [deal]);

  const scores = [
    { category: "Market Size", score: 40, status: "destructive", text: "TAM contradiction detected." },
    { category: "Team", score: 95, status: "success", text: "Strong domain expertise verified." },
    { category: "Product", score: 85, status: "success", text: "Architecture and differentiation clear." },
    { category: "Traction", score: 60, status: "warning", text: "Missing cohort retention data." },
    { category: "Unit Economics", score: 45, status: "destructive", text: "CAC/LTV ratio unsubstantiated." },
  ];

  const handleFeedbackSubmit = () => {
    if (!selectedFeedback) return;
    analytics.track("FeedbackSubmitted", { feedback: selectedFeedback });
    setFeedbackSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Fundraising Readiness</h1>
          <p className="text-muted-foreground mt-1">Diagnostic view of how investors will evaluate you.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 bg-card">
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray="282.7" strokeDashoffset="163.9" className="text-primary" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-extrabold">42</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">/ 100</span>
              </div>
            </div>
            <p className="mt-8 text-center text-muted-foreground">
              You are currently <strong className="text-foreground">below</strong> the threshold required for a successful Series A fundraise.
            </p>
          </CardContent>
        </Card>

        <div className="col-span-2 space-y-4">
          <h3 className="font-bold text-lg px-2">Category Breakdown</h3>
          <div className="space-y-4">
            {scores.map(item => (
              <Card key={item.category} className="bg-card">
                <CardContent className="p-4 flex items-center gap-6">
                  <div className="w-48 font-semibold shrink-0">{item.category}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.text}</span>
                      <span className="font-bold">{item.score}/100</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                  <div className="w-8 flex justify-end shrink-0">
                    {item.status === "success" && <CheckCircle2 className="w-5 h-5 text-success" />}
                    {item.status === "warning" && <AlertTriangle className="w-5 h-5 text-warning" />}
                    {item.status === "destructive" && <ShieldAlert className="w-5 h-5 text-destructive" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Feedback Module */}
      <div className="mt-8 border-t border-border pt-8 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          {feedbackSubmitted ? (
            <div className="bg-success/10 border border-success/30 rounded-xl p-8 flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-success mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Thank you for your feedback!</h3>
              <p className="text-slate-600">Your input helps Apex improve its recommendations.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">What did you do after reading this recommendation?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
                {[
                  "Updated my deck",
                  "Uploaded more evidence",
                  "I disagreed",
                  "I didn't understand it",
                  "I'll revisit later"
                ].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => setSelectedFeedback(opt)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedFeedback === opt 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:bg-muted text-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <Button onClick={handleFeedbackSubmit} disabled={!selectedFeedback} className="w-full sm:w-auto">
                <Send className="w-4 h-4 mr-2" /> Submit Feedback
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mt-8 pt-8">
        <h3 className="font-bold text-lg mb-4">Activity Timeline</h3>
        <div className="space-y-4">
          {timeline.length === 0 ? (
            <p className="text-muted-foreground">No events recorded yet.</p>
          ) : (
            timeline.map((event: any) => (
              <div key={event.id} className="flex gap-4 p-4 border rounded-lg bg-card">
                <div className="w-32 text-sm text-muted-foreground shrink-0 mt-0.5">
                  {new Date(event.created_at).toLocaleDateString()}
                </div>
                <div>
                  <div className="font-medium">{event.event_type}</div>
                  <div className="text-sm text-muted-foreground">
                    {event.entity_type} {event.entity_id ? `#${event.entity_id}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
