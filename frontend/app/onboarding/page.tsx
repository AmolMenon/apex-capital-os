"use client";

import { useState, useEffect, useRef } from "react";
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

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateCompany = async () => {
    if (!companyName) return;
    setErrorMsg(null);
    try {
      const deal = await DealsService.createDeal({
        startup_name: companyName,
        stage: "Seed",
        description: `Raising ${raiseAmount || "capital"}`,
        status: "active"
      });
      setDealId(deal.id);
      setStep(2);
    } catch (e: any) {
      // APM logging
      setErrorMsg(e.message || "Failed to create company. Please try again.");
    }
  };

  const handleUploadClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && dealId) {
      await processRealUpload(file, dealId);
    }
  };

  const processRealUpload = async (file: File, dealId: number) => {
    setStep(3);
    setErrorMsg(null);
    setLogs(["Uploading deck..."]);
    
    try {
      // 1. Upload
      const uploadRes = await DealsService.uploadDeck(dealId, file);
      const documentId = uploadRes.document_id;
      setLogs(prev => [...prev, "Extracting evidence and narrative pillars..."]);
      
      // 2. Extract Claims
      await DealsService.extractClaims(dealId, documentId);
      setLogs(prev => [...prev, "Building Canonical Investment Case..."]);
      
      // 3. Review
      setLogs(prev => [...prev, "Generating Investor Review..."]);
      await DealsService.runInvestorReview(dealId);
      
      setLogs(prev => [...prev, "Complete."]);
      
      // Navigate to dashboard automatically
      setTimeout(() => router.push("/dashboard"), 1000);
      
    } catch (e: any) {
      // APM logging
      setErrorMsg(e.message || "An error occurred during upload or analysis.");
      setStep(2); // Go back to upload step to let them retry
    }
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
              {errorMsg && (
                <div className="mt-4 p-3 rounded bg-destructive/10 text-destructive text-sm border border-destructive/20 text-center">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Upload your Pitch Deck</h2>
              <p className="text-muted-foreground">Our engine will instantly run diligence verification.</p>
            </div>
            
            <div 
              onClick={handleUploadClick}
              className="border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4"
            >
              <input 
                type="file" 
                ref={hiddenFileInput} 
                onChange={handleFileChange} 
                style={{ display: "none" }} 
                accept=".pdf,.pptx"
              />
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <p className="font-medium text-lg">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PDF or PPTX (Max 20MB)</p>
              </div>
            </div>
            {errorMsg && (
              <div className="mt-4 p-4 rounded bg-destructive/10 text-destructive text-sm border border-destructive/20">
                <div className="font-bold mb-1">Upload Failed</div>
                <p>{errorMsg}</p>
                <Button variant="outline" size="sm" className="mt-3 text-foreground" onClick={() => setErrorMsg(null)}>
                  Retry
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <Terminal className="w-6 h-6 text-primary animate-pulse" />
              <h2 className="text-xl font-mono font-bold tracking-tight">Processing Documentation...</h2>
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

        {step === 4 && null /* We skip step 4 and navigate directly to dashboard now */}

      </div>
    </div>
  );
}
