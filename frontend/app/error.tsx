"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global Application Error:", error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-8">
        The application encountered an unexpected error. This might be due to a disconnected backend or missing data.
      </p>
      
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg w-full text-left mb-8 max-h-48 text-sm text-slate-600 shadow-sm">
        <p className="font-medium">Please verify your connection and try reloading.</p>
        <p className="mt-2 text-xs text-slate-500">If the problem persists, contact platform support.</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Try again
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="w-4 h-4" /> Back to Safety
          </Button>
        </Link>
      </div>
    </div>
  )
}
