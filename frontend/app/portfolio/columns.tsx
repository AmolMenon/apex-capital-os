"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export type PortfolioCompany = {
  company_id: number;
  name: string;
  sector: string;
  portfolio_status: string;
  health_score: number;
}

export const columns: ColumnDef<PortfolioCompany>[] = [
  {
    accessorKey: "name",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground border">
            {company.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-medium">{company.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "portfolio_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("portfolio_status") as string
      return (
        <Badge className={
          status === 'active' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 hover:bg-emerald-500/20" :
          status === 'follow_on_candidate' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 hover:bg-amber-500/20" :
          status === 'watchlist' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0 hover:bg-rose-500/20" :
          "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-0 hover:bg-indigo-500/20"
        }>
          {status.replace(/_/g, ' ')}
        </Badge>
      )
    },
  },
  {
    accessorKey: "health_score",
    header: "Health Score",
    cell: ({ row }) => {
      const score = row.getValue("health_score") as number || 85
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${score > 80 ? 'bg-emerald-500' : score > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{score}/100</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="text-right">
          <Link href={`/portfolio/companies/${company.company_id}`}>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              View Profile
            </Button>
          </Link>
        </div>
      )
    },
  },
]
