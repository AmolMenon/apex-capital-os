"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DealsService } from "@/services/deals";
import { Deal } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompany() {
      try {
        const deals = await DealsService.getDeals();
        if (deals && deals.length > 0) {
          setDeal(deals[0]);
        } else {
          router.push("/onboarding");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCompany();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Activity className="w-6 h-6 animate-pulse text-muted-foreground" />
      </div>
    );
  }

  if (!deal) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your fundraise preparation.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Fundraising Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold">42</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[42%]" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Status: <span className="text-warning font-semibold">Not Ready to Pitch</span>
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Next Critical Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            {[
              { title: "Resolve TAM Contradiction", desc: "Slide 4 vs Slide 12 pricing model mismatch.", type: "blocking" },
              { title: "Upload Q3 Financials", desc: "Required to substantiate MoM growth claims.", type: "warning" }
            ].length > 0 ? (
              <>
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors border border-border/50 cursor-pointer" onClick={() => router.push('/dashboard/action-center')}>
                  <ShieldAlert className="w-5 h-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Resolve TAM Contradiction</h4>
                    <p className="text-xs text-muted-foreground mt-1">Slide 4 vs Slide 12 pricing model mismatch.</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">Fix <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors border border-border/50 cursor-pointer" onClick={() => router.push('/dashboard/action-center')}>
                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Upload Q3 Financials</h4>
                    <p className="text-xs text-muted-foreground mt-1">Required to substantiate MoM growth claims.</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">Fix <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center border rounded-lg bg-muted/10">
                <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-3" />
                <h4 className="font-semibold">All caught up!</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Re-run the Investor Review to see how your score improved.</p>
                <Button>Run Review</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Narrative Integrity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Team Experience</span>
              <span className="text-success font-medium">Verified</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-destructive" /> Market Size</span>
              <span className="text-destructive font-medium">Contradiction</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" /> Unit Economics</span>
              <span className="text-warning font-medium">Insufficient Evidence</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Product Architecture</span>
              <span className="text-success font-medium">Verified</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-primary bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded border border-border bg-background shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm">Pitch Deck v4 Analyzed</div>
                    <time className="text-xs font-medium text-muted-foreground">Today</time>
                  </div>
                  <div className="text-xs text-muted-foreground">Simulation found 3 critical risks.</div>
                </div>
              </div>
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-primary bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded border border-border bg-background shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm">Company Created</div>
                    <time className="text-xs font-medium text-muted-foreground">Yesterday</time>
                  </div>
                  <div className="text-xs text-muted-foreground">Workspace initialized.</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
