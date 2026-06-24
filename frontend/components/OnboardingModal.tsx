"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlayCircle, PlusCircle, Database, X } from "lucide-react"

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("apex_onboarding_seen")
    if (!hasSeenOnboarding) {
      setIsOpen(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("apex_onboarding_seen", "true")
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl border border-primary/20 bg-card p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl font-bold text-primary">A</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome to Apex Capital</h2>
          <p className="text-muted-foreground mt-2 px-4">
            Apex Capital helps you evaluate startups like a VC analyst. You can start with the guided demo, analyze a new startup, or continue from the pipeline.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/demo" onClick={handleDismiss} className="block">
            <Button className="w-full h-12 text-md shadow-md justify-start px-6" size="lg">
              <PlayCircle className="mr-3 h-5 w-5" /> Start Guided Demo
            </Button>
          </Link>
          <Link href="/new" onClick={handleDismiss} className="block">
            <Button variant="outline" className="w-full h-12 text-md justify-start px-6">
              <PlusCircle className="mr-3 h-5 w-5 text-primary" /> Create New Deal
            </Button>
          </Link>
          <Link href="/pipeline" onClick={handleDismiss} className="block">
            <Button variant="outline" className="w-full h-12 text-md justify-start px-6 border-muted-foreground/30">
              <Database className="mr-3 h-5 w-5 text-muted-foreground" /> Open Pipeline
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={handleDismiss}
            className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
