"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HelpCircle } from "lucide-react"

interface ExplanationPopoverProps {
  title: string
  explanation: string
  children: React.ReactNode
}

export function ExplanationPopover({ title, explanation, children }: ExplanationPopoverProps) {
  return (
    <div className="flex items-center gap-1.5">
      {children}
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none">
            <HelpCircle className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <h4 className="font-bold text-sm mb-2 text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
