"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Deal } from '@/types';

interface GlobalPortfolioContextType {
  deals: Deal[];
  loading: boolean;
  error: any;
  refreshPortfolio: () => void;
  updateDealStage: (dealId: number | string, newStage: string) => Promise<void>;
}

const GlobalPortfolioContext = createContext<GlobalPortfolioContextType>({
  deals: [],
  loading: true,
  error: null,
  refreshPortfolio: () => {},
  updateDealStage: async () => {}
});

export function GlobalPortfolioProvider({ children }: { children: React.ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    try {
      const data = await api.getDeals();
      setDeals(data);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch portfolio", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    
    // Poll every 10 seconds for portfolio updates (less frequent than single deal)
    const interval = setInterval(fetchPortfolio, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateDealStage = async (dealId: number | string, newStage: string) => {
    // Optimistic update
    setDeals(current => 
      current.map(d => d.id.toString() === dealId.toString() ? { ...d, status: newStage } : d)
    );
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/deals/${dealId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStage })
      });
      // Optionally trigger autonomous simulation here if moving to certain stages
      if (newStage === 'Research' || newStage === 'Due Diligence') {
         fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/deals/${dealId}/simulate-autonomous`, {
            method: 'POST'
         });
      }
    } catch (err) {
      console.error("Failed to update deal stage", err);
      fetchPortfolio(); // revert on failure
    }
  };

  return (
    <GlobalPortfolioContext.Provider value={{ deals, loading, error, refreshPortfolio: fetchPortfolio, updateDealStage }}>
      {children}
    </GlobalPortfolioContext.Provider>
  );
}

export function useGlobalPortfolio() {
  const context = useContext(GlobalPortfolioContext);
  if (context === undefined) {
    throw new Error('useGlobalPortfolio must be used within a GlobalPortfolioProvider');
  }
  return context;
}
