"use client"

import React from "react"
import { KnowledgeGraphUI } from "@/components/workspace/KnowledgeGraphUI"

export default function KnowledgeGraphPage() {
  return (
    <div className="flex flex-col h-full text-slate-100 animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-3xl font-light tracking-tight">Organization Knowledge Graph</h1>
        <p className="text-slate-400 mt-2">
          Explore the relationships between decisions, assumptions, evidence, and outcomes across the platform.
        </p>
      </header>
      
      <div className="flex-1">
        <KnowledgeGraphUI />
      </div>
    </div>
  )
}
