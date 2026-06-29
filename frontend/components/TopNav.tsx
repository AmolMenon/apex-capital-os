"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Search, CircleUser, ChevronRight, Camera, Route } from "lucide-react"
import { DemoNarrative } from "@/components/DemoNarrative"
import { DealSwitcher } from "@/components/DealSwitcher"
import { HelpDrawer } from "@/components/ui/HelpDrawer"
import { useScreenshotMode } from "@/components/ScreenshotProvider"
import React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Sidebar } from "@/components/Sidebar"

export function TopNav() {
  const pathname = usePathname()
  const { isScreenshotMode, toggleScreenshotMode } = useScreenshotMode()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  
  // Quick breadcrumb logic
  const segments = pathname.split('/').filter(Boolean)
  let breadcrumbs = ["Apex Capital"]
  if (segments.length === 0) breadcrumbs.push("Dashboard")
  else if (segments[0] === "pipeline") breadcrumbs.push("Pipeline")
  else if (segments[0] === "new") breadcrumbs.push("New Deal")
  else if (segments[0] === "settings") breadcrumbs.push("Settings")
  else if (segments[0] === "methodology") breadcrumbs.push("Methodology")
  else if (segments[0] === "demo-script") breadcrumbs.push("Demo Script")
  else if (segments[0] === "portfolio") breadcrumbs.push("Watchlist")
  else if (segments[0] === "deals" && segments.length >= 3) {
    breadcrumbs.push("Pipeline")
    const id = segments[1]
    const tab = segments[2].replace(/-/g, " ")
    breadcrumbs.push(`Deal ${id}`)
    breadcrumbs.push(tab.charAt(0).toUpperCase() + tab.slice(1))
  }

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex h-14 items-center justify-between border-b bg-card/50 px-4 md:px-6">
      <div className="flex flex-1 items-center space-x-2">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2 shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-card border-r">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Access all platform modules.</SheetDescription>
            <div className="h-full overflow-y-auto">
              <Sidebar mobile />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center text-xs md:text-sm text-muted-foreground font-medium truncate">
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="h-4 w-4 mx-1 opacity-50 shrink-0" />}
              <span className={i === breadcrumbs.length - 1 ? "text-foreground truncate max-w-[120px] md:max-w-none" : "capitalize truncate hidden sm:inline-block"}>
                {b}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="ml-4 flex items-center md:ml-6 space-x-4">
        <div className="hidden md:block">
          <DealSwitcher />
        </div>
        <div className="w-full max-w-sm hidden md:block">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search database..."
                className="w-full bg-background shadow-sm appearance-none rounded-md border border-input pl-8 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </form>
        </div>
        
        <Link href="/presentation">
          <Button variant="outline" size="sm" className="hidden lg:flex text-primary border-primary/20 bg-primary/5 hover:bg-primary/10">
            <Route className="mr-2 h-4 w-4" />
            Guided Walkthrough
          </Button>
        </Link>

        <Button 
          variant={isScreenshotMode ? "default" : "ghost"} 
          size="icon" 
          onClick={toggleScreenshotMode}
          className={isScreenshotMode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
          title="Toggle Screenshot Mode"
        >
          <Camera className="h-5 w-5" />
        </Button>

        <DemoNarrative />
        <HelpDrawer />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <CircleUser className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
