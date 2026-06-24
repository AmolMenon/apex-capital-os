"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PageHelpBannerProps {
  title: string
  explanation: string
  primaryAction?: { label: string, href: string }
  secondaryAction?: { label: string, href: string }
  dismissible?: boolean
}

export function PageHelpBanner({ title, explanation, primaryAction, secondaryAction, dismissible = true }: PageHelpBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4 shadow-sm">
      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
      <div className="flex gap-3">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
        <div className="space-y-2 pr-6">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </p>
          {(primaryAction || secondaryAction) && (
            <div className="pt-2 flex flex-wrap gap-2">
              {primaryAction && (
                <Link href={primaryAction.href}>
                  <Button size="sm" className="h-8 shadow-sm">{primaryAction.label}</Button>
                </Link>
              )}
              {secondaryAction && (
                <Link href={secondaryAction.href}>
                  <Button size="sm" variant="outline" className="h-8">{secondaryAction.label}</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
