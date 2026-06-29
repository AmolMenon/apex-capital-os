"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

export interface DealState {
  deal: any;
  autonomous: {
    stage: string;
    progress: number;
    logs: string[];
    timeline: any[];
  };
  research: any;
  deck: any;
  diligence: any;
  fund_fit: any;
  analysis: any;
  partner_questions: string[];
}

interface GlobalDealContextType {
  state: DealState | null;
  loading: boolean;
  error: any;
  simulateAutonomous: () => void;
}

const GlobalDealContext = createContext<GlobalDealContextType>({
  state: null,
  loading: true,
  error: null,
  simulateAutonomous: () => {}
});

export function GlobalDealProvider({ children, dealId }: { children: React.ReactNode, dealId: string }) {
  const [state, setState] = useState<DealState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchState = async () => {
    try {
      const res = await api.get(`/deals/${dealId}/autonomous-state`);
      setState(res);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch autonomous state", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchState();
    
    // Poll every 3 seconds for autonomous updates
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [dealId]);

  const simulateAutonomous = async () => {
    try {
      await api.post(`/deals/${dealId}/simulate-autonomous`, {});
      fetchState(); // fetch immediately after starting
    } catch (err) {
      console.error("Failed to start simulation", err);
    }
  };

  return (
    <GlobalDealContext.Provider value={{ state, loading, error, simulateAutonomous }}>
      {children}
    </GlobalDealContext.Provider>
  );
}

export function useGlobalDeal() {
  const context = useContext(GlobalDealContext);
  if (context === undefined) {
    throw new Error('useGlobalDeal must be used within a GlobalDealProvider');
  }
  return context;
}
