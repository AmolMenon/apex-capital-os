"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { InvestmentCaseResponse } from "@/types/investment-case";
import { InvestmentCaseService } from "@/services/investment-case";

interface InvestmentCaseContextValue {
  investmentCase: InvestmentCaseResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshInvestmentCase: () => Promise<void>;
}

const InvestmentCaseContext = createContext<InvestmentCaseContextValue | undefined>(undefined);

export function InvestmentCaseProvider({
  decisionId,
  children,
}: {
  decisionId: string;
  children: React.ReactNode;
}) {
  const [investmentCase, setInvestmentCase] = useState<InvestmentCaseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestmentCase = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await InvestmentCaseService.getInvestmentCase(decisionId);
      setInvestmentCase(data);
    } catch (err: any) {
      console.error("Failed to load canonical investment case:", err);
      setError(err.message || "Failed to load investment case");
    } finally {
      setIsLoading(false);
    }
  }, [decisionId]);

  useEffect(() => {
    if (decisionId) {
      fetchInvestmentCase();
    }
  }, [fetchInvestmentCase, decisionId]);

  return (
    <InvestmentCaseContext.Provider
      value={{
        investmentCase,
        isLoading,
        error,
        refreshInvestmentCase: fetchInvestmentCase,
      }}
    >
      {children}
    </InvestmentCaseContext.Provider>
  );
}

export function useInvestmentCase() {
  const context = useContext(InvestmentCaseContext);
  if (context === undefined) {
    throw new Error("useInvestmentCase must be used within an InvestmentCaseProvider");
  }
  return context;
}
