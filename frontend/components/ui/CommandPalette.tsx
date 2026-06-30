"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search, Folder, Database, FileText, Settings, User, Building, Activity, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!open) return null

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[20%] z-50 w-full max-w-lg translate-x-[-50%] p-4">
        <Command
          className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl"
          label="Global Command Menu"
          shouldFilter={true}
          loop
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search deals, founders, actions..."
              autoFocus
            />
            <button onClick={() => setOpen(false)} className="ml-2 rounded-sm opacity-50 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
            
            <Command.Group heading="Quick Actions" className="p-2 text-xs font-medium text-muted-foreground">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/pipeline'))}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 mt-1"
              >
                <Activity className="mr-2 h-4 w-4" />
                <span>View Pipeline</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/portfolio'))}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 mt-1"
              >
                <Folder className="mr-2 h-4 w-4" />
                <span>View Portfolio</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Active Deal Actions" className="p-2 text-xs font-medium text-muted-foreground mt-2 border-t pt-4">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/deals/active/deal-room'))}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 mt-1"
              >
                <Database className="mr-2 h-4 w-4" />
                <span>Go to Deal Room</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/deals/active/research'))}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 mt-1"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Open Research Report</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/deals/active/ic-memo'))}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 mt-1"
              >
                <Building className="mr-2 h-4 w-4" />
                <span>Generate IC Memo</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
