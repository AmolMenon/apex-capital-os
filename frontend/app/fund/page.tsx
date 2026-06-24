"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { FundProfileCard } from "@/components/fund/FundProfileCard";
import { PortfolioConstructionGrid } from "@/components/fund/PortfolioConstructionGrid";
import { FundReturnSimulation } from "@/components/fund/FundReturnSimulation";
import { ConcentrationRiskCard } from "@/components/fund/ConcentrationRiskCard";
import { Loader2 } from "lucide-react";

export default function FundStrategyPage() {
  const [profile, setProfile] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [returnModel, setReturnModel] = useState<any>(null);
  const [concentration, setConcentration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundData = async () => {
      try {
        const [profRes, portRes, retRes, concRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/fund/profile"),
          fetch("http://127.0.0.1:8000/fund/portfolio-construction"),
          fetch("http://127.0.0.1:8000/fund/return-model"),
          fetch("http://127.0.0.1:8000/fund/concentration"),
        ]);
        
        setProfile(await profRes.json());
        setPortfolio(await portRes.json());
        setReturnModel(await retRes.json());
        setConcentration(await concRes.json());
      } catch (err) {
        console.error("Failed to load fund data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFundData();
  }, []);

  return (
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col h-full max-w-7xl mx-auto p-8 space-y-6">
            
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Fund Strategy Command Center</h1>
                <p className="text-muted-foreground mt-1 text-lg">Portfolio construction, concentration risk, and return modeling.</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                <div className="space-y-6">
                  <FundProfileCard profile={profile} />
                  <FundReturnSimulation data={returnModel} />
                </div>
                <div className="space-y-6">
                  <PortfolioConstructionGrid data={portfolio} />
                  <ConcentrationRiskCard data={concentration} />
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
  );
}
