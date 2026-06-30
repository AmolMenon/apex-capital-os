"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FundFitAssessmentCard } from "@/components/fund/FundFitAssessmentCard";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { PageHelpBanner } from "@/components/ui/PageHelpBanner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DealFundFitPage() {
  const params = useParams();
  const id = params.id as string;
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadAssessment = async () => {
    try {
      const res = await fetch(`${"http://127.0.0.1:8000"}/fund/deals/${id}/fit`);
      if (res.ok) {
        setAssessment(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessment();
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${"http://127.0.0.1:8000"}/fund/deals/${id}/fit`, {
        method: 'POST'
      });
      if (res.ok) {
        setAssessment(await res.json());
        toast.success("Fund fit assessment generated");
      } else {
        toast.error("Failed to generate assessment");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHelpBanner 
        title="Fund Fit & Strategy" 
        explanation="A good deal must also be a good fund fit. This evaluates power-law outcomes, check size, and portfolio construction."
      />
      <div className="flex justify-between items-end">
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Re-Run Assessment
        </Button>
      </div>

      {!assessment ? (
        <EmptyState 
          title="No Fund Fit Assessment" 
          description="Evaluate how this deal fits into the broader fund strategy, including ownership targets and reserves."
          icon={RefreshCw}
          primaryActionLabel="Run Assessment"
          onPrimaryAction={handleGenerate}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-12">
          <FundFitAssessmentCard assessment={assessment} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg bg-card p-6">
              <h3 className="font-semibold mb-4 text-lg">Ownership Math</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Valuation (Pre)</span>
                  <span className="font-medium">₹{(assessment.ownership_scenarios.pre_money_valuation / 10000000).toFixed(1)} Cr</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Check Size</span>
                  <span className="font-medium">₹{(assessment.ownership_scenarios.check_size / 10000000).toFixed(1)} Cr</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Post-Dilution Ownership</span>
                  <span className="font-medium text-primary">{(assessment.ownership_scenarios.post_dilution_ownership * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center pt-2 bg-muted/20 p-3 rounded-lg">
                  <span className="text-sm font-semibold">Exit Required for 1x Fund</span>
                  <span className="font-bold text-lg">₹{(assessment.ownership_scenarios.required_exit_value_1x_fund / 10000000).toFixed(0)} Cr</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg bg-card p-6">
              <h3 className="font-semibold mb-4 text-lg">Reserve Strategy</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Initial Check</span>
                  <span className="font-medium">₹{(assessment.reserve_strategy.initial_check / 10000000).toFixed(1)} Cr</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Recommended Reserve</span>
                  <span className="font-medium">₹{(assessment.reserve_strategy.recommended_reserve / 10000000).toFixed(1)} Cr</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Reserve Ratio</span>
                  <span className="font-medium">{assessment.reserve_strategy.reserve_ratio}:1</span>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-muted-foreground block mb-1">Capital Allocation Priority</span>
                  <span className={`text-sm px-2 py-1 rounded-md font-medium ${
                    assessment.reserve_strategy.capital_allocation_priority === 'High' ? 'bg-green-500/20 text-green-600' :
                    assessment.reserve_strategy.capital_allocation_priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-600' :
                    'bg-red-500/20 text-red-600'
                  }`}>
                    {assessment.reserve_strategy.capital_allocation_priority} Priority
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
