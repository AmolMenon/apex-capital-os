"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search,
  LayoutDashboard, 
  FilePlus, 
  Database, 
  Presentation, 
  Briefcase,
  Search as SearchIcon,
  Activity,
  FileText,
  Settings
} from "lucide-react"

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

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

  const actions = [
    { id: "dashboard", name: "Open Dashboard", icon: LayoutDashboard, route: "/dashboard" },
    { id: "pipeline", name: "Open Pipeline", icon: Database, route: "/pipeline" },
    { id: "new", name: "Create New Deal", icon: FilePlus, route: "/new" },
    { id: "demo", name: "Open Demo Checklist", icon: Presentation, route: "/demo" },
    { id: "presentation", name: "Open Presentation Mode", icon: Presentation, route: "/presentation" },
    { id: "settings", name: "Open Settings", icon: Settings, route: "/settings" },
    { id: "deal", name: "Open NeuralDesk Deal Room", icon: Briefcase, route: "/deals/1000/deal-room" },
    { id: "research", name: "Open NeuralDesk Research", icon: SearchIcon, route: "/deals/1000/research" },
    { id: "diligence", name: "Open NeuralDesk Diligence", icon: Activity, route: "/deals/1000/diligence" },
    { id: "memo", name: "Open NeuralDesk Memo", icon: FileText, route: "/deals/1000/memo" },
  ]

  const filteredActions = actions.filter(action => 
    action.name.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (route: string) => {
    setIsOpen(false)
    setQuery("")
    router.push(route)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
        <div className="w-full max-w-xl overflow-hidden rounded-xl border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              autoFocus
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded border">ESC</div>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredActions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Suggestions
                </div>
                {filteredActions.map((action, i) => (
                  <button
                    key={action.id}
                    className={`flex w-full items-center rounded-md px-2 py-2.5 text-sm transition-colors hover:bg-muted hover:text-foreground text-left ${i === 0 && query ? 'bg-muted' : ''}`}
                    onClick={() => handleSelect(action.route)}
                  >
                    <action.icon className="mr-2 h-4 w-4 opacity-70" />
                    <span>{action.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="border-t p-2 px-3 text-xs text-muted-foreground flex justify-between bg-muted/30">
            <span>Apex Capital Command Palette</span>
            <span>Use arrow keys to navigate (coming soon)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
