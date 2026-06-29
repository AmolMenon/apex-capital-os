"use client"

import { Button } from "@/components/ui/button"
import { CircleHelp, ChevronRight } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function HelpDrawer() {
  const pathname = usePathname()
  
  // Dynamic help based on current route
  let title = "Apex Capital Help"
  let description = "Learn how to use the Agentic VC Analyst OS."
  let tips = [
    "Navigate to the Pipeline to see all deals.",
    "Click 'New Deal' to intake a startup.",
    "Go to the Dashboard to see an overview."
  ]

  if (pathname.includes('/deals/')) {
    title = "Deal Room Help"
    description = "You are currently reviewing a specific startup."
    tips = [
      "Follow the workflow bar at the top, moving left to right.",
      "Check the 'Next Best Action' card to see what to do next.",
      "Green checks mean a step is completed and saved.",
      "You can skip steps, but it will impact the final Investment Memo quality."
    ]
  } else if (pathname.includes('/pipeline')) {
    title = "Pipeline Help"
    description = "This is your CRM and fund tracking center."
    tips = [
      "The 'Completion' bar shows how close a deal is to Investment Committee (IC).",
      "Click 'Open Deal Room' to jump straight into analysis.",
      "Use the 'Next Action' buttons to quickly move deals forward."
    ]
  } else if (pathname.includes('/new')) {
    title = "New Deal Intake Help"
    description = "Add a startup into the Apex system."
    tips = [
      "If you just want to test the app, click one of the 'Sample Data' buttons on the right.",
      "The 'Submit' button will automatically run the first AI analysis step."
    ]
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <CircleHelp className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">{title}</SheetTitle>
          <SheetDescription>
            {description}
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Contextual Tips</h3>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="mt-0.5 bg-primary/10 p-0.5 rounded text-primary">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/demo">
                <Button variant="outline" className="w-full justify-start text-primary border-primary/20 hover:bg-primary/5">
                  <CircleHelp className="w-4 h-4 mr-2" /> Resume Demo Walkthrough
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
