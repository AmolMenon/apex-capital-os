"use client";

import React, { createContext, useContext } from 'react';
import { Deal } from '@/types';

interface DealContextType {
  deal: Deal | null;
}

const DealContext = createContext<DealContextType>({ deal: null });

export function DealProvider({ children, deal }: { children: React.ReactNode, deal: Deal | null }) {
  return (
    <DealContext.Provider value={{ deal }}>
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const context = useContext(DealContext);
  if (context === undefined) {
    throw new Error('useDeal must be used within a DealProvider');
  }
  return context.deal;
}
