import React from "react";
import { getStatusPresentation } from "@/lib/investment-case-presentation";

interface InvestmentStatusProps {
  status: string | null | undefined;
  className?: string;
}

export function InvestmentStatus({ status, className = "" }: InvestmentStatusProps) {
  const { label, colorClass } = getStatusPresentation(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
