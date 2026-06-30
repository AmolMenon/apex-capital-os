"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { 
  Search,
  LayoutDashboard, 
  FilePlus, 
  Database, 
  Presentation, 
  Briefcase,
  Settings,
  Upload,
  Bot,
  FileText
} from "lucide-react"
import { useGlobalPortfolio } from "./GlobalPortfolioProvider"

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { deals } = useGlobalPortfolio()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!isOpen) return null

  const handleSelect = (route: string) => {
    setIsOpen(false)
    router.push(route)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
        <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <Command className="w-full flex flex-col overflow-hidden bg-popover text-popover-foreground rounded-lg border shadow-md">
            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input 
                autoFocus 
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type a command or search deals..." 
              />
            </div>
            
            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>

              <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                <Command.Item onSelect={() => handleSelect('/command-center')} className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <LayoutDashboard className="mr-2 h-4 w-4 text-indigo-500" /> Command Center
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/pipeline')} className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <Database className="mr-2 h-4 w-4 text-emerald-500" /> Deal Pipeline
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/deals/new')} className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <FilePlus className="mr-2 h-4 w-4" /> Create New Deal
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/compare')} className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <Presentation className="mr-2 h-4 w-4" /> Compare Deals
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/portfolio')} className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <Database className="mr-2 h-4 w-4 text-blue-500" /> Portfolio Intelligence
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/settings')} className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Command.Item>
              </Command.Group>

              <Command.Separator className="-mx-1 my-1 h-px bg-border" />
              
              <Command.Group heading="AI Actions" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                <Command.Item onSelect={() => handleSelect('/assistant')} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <div className="flex items-center">
                    <Search className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Ask Global Copilot</span>
                  </div>
                  <span className="text-xs text-muted-foreground">⌘+A</span>
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/deals/new')} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <div className="flex items-center">
                    <FilePlus className="mr-2 h-4 w-4 text-blue-500" />
                    <span>Create Deal</span>
                  </div>
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/deals/new')} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Generate Memo</span>
                  </div>
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/portfolio')} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4 text-purple-500" />
                    <span>Open Portfolio</span>
                  </div>
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/assistant')} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>Run Research</span>
                  </div>
                </Command.Item>
                <Command.Item onSelect={() => handleSelect('/deals/new')} className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted">
                  <div className="flex items-center">
                    <Upload className="mr-2 h-4 w-4 text-rose-500" />
                    <span>Upload Pitch Deck</span>
                  </div>
                </Command.Item>
              </Command.Group>
              
              {deals && deals.length > 0 && (
                <Command.Group heading="Deals" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {deals.map(deal => (
                    <Command.Item 
                      key={deal.id} 
                      onSelect={() => handleSelect(`/deals/${deal.id}/deal-room`)}
                      className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted aria-selected:bg-muted aria-selected:text-accent-foreground data-[selected=true]:bg-muted"
                    >
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{deal.startup_name}</span>
                        <span className="ml-2 text-xs text-muted-foreground line-clamp-1 opacity-50">- {deal.founder_name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{deal.stage}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </div>
      </div>
    </div>
  )
}
