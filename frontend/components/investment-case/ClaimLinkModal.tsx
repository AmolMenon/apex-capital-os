import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvestmentCaseService } from "@/services/investment-case";
import { useInvestmentCase } from "@/context/InvestmentCaseContext";
import { Assumption } from "@/types/investment-case";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ClaimLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionId: string;
}

export function ClaimLinkModal({ isOpen, onClose, decisionId }: ClaimLinkModalProps) {
  const { investmentCase, refreshInvestmentCase } = useInvestmentCase();
  const [allClaims, setAllClaims] = useState<any[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);
  
  const [selectedAssumptionId, setSelectedAssumptionId] = useState<string>("");
  const [selectedClaimId, setSelectedClaimId] = useState<string>("");
  const [relationship, setRelationship] = useState<"SUPPORTS" | "CONTRADICTS" | "CONTEXT">("SUPPORTS");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingClaims(true);
      InvestmentCaseService.getClaimInventory(decisionId)
        .then(setAllClaims)
        .catch(() => setError("Failed to load claims inventory"))
        .finally(() => setIsLoadingClaims(false));
    } else {
      // Reset state
      setSelectedAssumptionId("");
      setSelectedClaimId("");
      setRelationship("SUPPORTS");
      setError(null);
    }
  }, [isOpen, decisionId]);

  if (!investmentCase) return null;

  const allAssumptions = Object.values(investmentCase.investment_case_assumptions).flat();

  const handleSubmit = async () => {
    if (!selectedAssumptionId || !selectedClaimId || !relationship) {
      setError("Please select an assumption, a claim, and a relationship.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await InvestmentCaseService.linkClaimToAssumption(
        decisionId,
        parseInt(selectedAssumptionId, 10),
        parseInt(selectedClaimId, 10),
        relationship
      );
      await refreshInvestmentCase();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to link claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Link Claim to Assumption</DialogTitle>
          <DialogDescription>
            Map an extracted piece of evidence to a critical assumption in the investment case.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="space-y-2">
            <label className="text-sm font-semibold">Select Assumption</label>
            <Select value={selectedAssumptionId} onValueChange={setSelectedAssumptionId} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an assumption..." />
              </SelectTrigger>
              <SelectContent>
                {allAssumptions.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.statement}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Select Claim (Evidence)</label>
            {isLoadingClaims ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading claims...
              </div>
            ) : (
              <Select value={selectedClaimId} onValueChange={setSelectedClaimId} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a claim from inventory..." />
                </SelectTrigger>
                <SelectContent>
                  {allClaims.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.statement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Relationship</label>
            <Select value={relationship} onValueChange={(val: any) => setRelationship(val)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPPORTS">Supports</SelectItem>
                <SelectItem value="CONTRADICTS">Contradicts</SelectItem>
                <SelectItem value="CONTEXT">Context</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Link to Assumption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
