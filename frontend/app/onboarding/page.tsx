"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rocket, UploadCloud, Terminal } from "lucide-react";
import { DealsService } from "@/services/deals";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [companyName, setCompanyName] = useState("");
  const [raiseAmount, setRaiseAmount] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [dealId, setDealId] = useState<number | null>(null);

  const handleCreateCompany = async () => {
    if (!companyName) return;
    try {
      const deal = await DealsService.createDeal({
        startup_name: companyName,
        stage: "Seed",
        description: `Raising ${raiseAmount || "capital"}`,
        status: "active"
      });
      setDealId(deal.id);
      setStep(2);
    } catch (e) {
      console.error(e);
      // Fallback for demo purposes
      setStep(2);
    }
  };

  const simulateProcessing = () => {
    setStep(3);
    const script = [
      "Initializing Diligence Engine...",
      "Extracting narrative pillars from Pitch Deck...",
      "Mapping claims to market realities...",
      "Cross-referencing metrics against industry benchmarks...",
      "Simulating Investor Review...",
      "Generating Bear Case and Bull Case...",
      "Identifying logical contradictions...",
      "Calculating Fundraising Readiness Score...",
      "Finalizing Action Plan..."
    ];
    
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < script.length) {
        setLogs(prev => [...prev, script[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep(4), 1000);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-4">
                <Rocket className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome to Apex.</h1>
              <p className="text-muted-foreground text-lg">Let's prepare for your fundraise.</p>
            </div>
            
            <div className="space-y-4 bg-card p-8 rounded-xl border border-border/50 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Name</label>
                <Input 
                  placeholder="e.g. Acme Corp" 
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Raise Amount</label>
                <Input 
                  placeholder="e.g. $2M" 
                  value={raiseAmount}
                  onChange={e => setRaiseAmount(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button 
                className="w-full mt-4" 
                size="lg"
                disabled={!companyName}
                onClick={handleCreateCompany}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Upload your Pitch Deck</h2>
              <p className="text-muted-foreground">Our engine will instantly run a diligence simulation.</p>
            </div>
            
            <div 
              onClick={simulateProcessing}
              className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="font-medium text-lg">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PDF or PPTX (Max 20MB)</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Terminal className="w-6 h-6 text-primary animate-pulse" />
              <h2 className="text-xl font-mono font-bold tracking-tight">Running Simulation...</h2>
            </div>
            
            <div className="bg-[#09090B] border border-border rounded-lg p-6 font-mono text-sm space-y-3 min-h-[300px]">
              {logs.map((log, i) => (
                <div key={i} className="text-muted-foreground animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <span className="text-primary mr-2">{">"}</span> {log}
                </div>
              ))}
              <div className="animate-pulse text-muted-foreground">_</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="text-center space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive font-bold text-sm mb-2 border border-destructive/20">
                Simulation Complete
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight">We found 3 critical risks.</h2>
              <p className="text-muted-foreground text-lg">Your Fundraising Readiness Score is currently <span className="font-bold text-foreground">42/100</span>.</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="p-4 rounded-lg bg-background border border-destructive/20 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
                <div>
                  <h4 className="font-bold mb-1">Unjustified Market Size (TAM)</h4>
                  <p className="text-sm text-muted-foreground">You claim a $10B TAM, but your bottom-up pricing model requires 83M users. This is mathematically contradictory.</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-background border border-warning/20 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                <div>
                  <h4 className="font-bold mb-1">Missing Cohort Analysis</h4>
                  <p className="text-sm text-muted-foreground">You state 20% MoM growth, but no historical P&L or retention data was found to substantiate this claim.</p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-14 text-lg font-bold" 
              onClick={() => router.push("/dashboard")}
            >
              Go to Action Center
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
