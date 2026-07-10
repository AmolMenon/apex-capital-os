"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Construction } from "lucide-react"

export default function ScenariosPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto mt-12">
      <Card className="border-dashed bg-muted/30 p-12 flex flex-col items-center justify-center text-center">
        <Construction className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-bold mb-2">Scenarios Workspace</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This capability is not currently active for this deal. Please rely on the primary analysis in the Diligence tab.
        </p>
      </Card>
    </div>
  )
}
