"use client"
import { Deal } from "@/types"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ChecklistModeProps {
  deal: Deal
  hasFundFit?: boolean
}

export function ChecklistMode({ deal, hasFundFit = false }: ChecklistModeProps) {
  const checklist = [
    {
      id: "basic",
      label: "Basic deal profile completed",
      completed: !!deal,
      href: `/deal/${deal.id}/deal-room`
    },
    {
      id: "scorecard",
      label: "Scorecard generated",
      completed: !!deal.analysis?.scorecard,
      href: `/deal/${deal.id}/deal-room`
    },
    {
      id: "risks",
      label: "Key risks identified",
      completed: !!deal.analysis?.risks && deal.analysis.risks.length > 0,
      href: `/deal/${deal.id}/deal-room`
    },
    {
      id: "research",
      label: "Research brief generated",
      completed: !!deal.analysis,
      href: `/deal/${deal.id}/research`
    },
    {
      id: "evidence",
      label: "Evidence score reviewed",
      completed: !!deal.analysis,
      href: `/deal/${deal.id}/research`
    },
    {
      id: "deck",
      label: "Pitch deck analyzed",
      completed: !!deal.analysis,
      href: `/deal/${deal.id}/deck`
    },
    {
      id: "unsupported",
      label: "Unsupported claims reviewed",
      completed: !!deal.analysis,
      href: `/deal/${deal.id}/deck`
    },
    {
      id: "diligence_plan",
      label: "Diligence plan generated",
      completed: !!deal.analysis,
      href: `/deal/${deal.id}/diligence`
    },
    {
      id: "founder",
      label: "Founder follow-ups prepared",
      completed: !!deal.analysis,
      href: `/deal/${deal.id}/diligence`
    },
    {
      id: "customer",
      label: "Customer reference questions prepared",
      completed: !!deal.analysis,
      href: `/deal/${deal.id}/diligence`
    },
    {
      id: "dataroom",
      label: "Data room requests prepared",
      completed: !!deal.analysis,
      href: `/deal/${deal.id}/diligence`
    },
    {
      id: "fundfit",
      label: "Fund fit reviewed",
      completed: hasFundFit,
      href: `/deal/${deal.id}/fund-fit`
    },
    {
      id: "memo",
      label: "Memo prepared",
      completed: !!deal.analysis?.memo,
      href: `/deal/${deal.id}/memo`
    },
    {
      id: "ic",
      label: "IC one-pager prepared",
      completed: !!deal.analysis?.ic_one_pager,
      href: `/deal/${deal.id}/ic-one-pager`
    },
    {
      id: "final",
      label: "Final recommendation reviewed",
      completed: deal.status !== "New" && deal.status !== "Screening" && deal.status !== "Research",
      href: `/deal/${deal.id}/deal-room`
    }
  ]

  const completedCount = checklist.filter(i => i.completed).length
  const totalCount = checklist.length
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Pre-IC Checklist</h3>
          <p className="text-sm text-muted-foreground">Before IC, complete all required analysis steps.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{progress}%</span>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ready</p>
        </div>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
        {checklist.map(item => (
          <div key={item.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40" />
                )}
              </div>
              <span className={cn(
                "text-sm truncate",
                item.completed ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </div>
            {!item.completed && (
              <Link href={item.href} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary">Go <ArrowRight className="ml-1 h-3 w-3" /></Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
