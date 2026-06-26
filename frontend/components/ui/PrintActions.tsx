"use client"

import { Button } from "@/components/ui/button"
import { Printer, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

interface PrintActionsProps {
  documentTitle: string
  summaryTextToCopy?: string
}

export function PrintActions({ documentTitle, summaryTextToCopy }: PrintActionsProps) {
  const [copied, setCopied] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    if (summaryTextToCopy) {
      navigator.clipboard.writeText(summaryTextToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-3 print:hidden">
      {summaryTextToCopy && (
        <Button variant="outline" size="sm" onClick={handleCopy} className="bg-background">
          {copied ? (
            <><CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Copied!</>
          ) : (
            <><Copy className="mr-2 h-4 w-4" /> Copy Executive Summary</>
          )}
        </Button>
      )}
      <Button variant="default" size="sm" onClick={handlePrint} className="shadow-sm">
        <Printer className="mr-2 h-4 w-4" /> Print {documentTitle}
      </Button>
    </div>
  )
}
