"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export function EmptyState({ title, description, actionLabel, onAction, actionHref, icon, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed bg-card/50">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {icon || <Search className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        {description}
      </p>
      {actionLabel && (actionHref ? (
        <Link href={actionHref}>
          <Button>
            {actionLabel}
          </Button>
        </Link>
      ) : onAction ? (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null)}
      {children}
    </div>
  )
}
