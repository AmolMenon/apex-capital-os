"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, BrainCircuit, LayoutDashboard, Settings } from "lucide-react"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4 pb-4">
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      
      <Command 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        loop
      >
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-500 mr-3" />
          <Command.Input 
            autoFocus
            placeholder="Search decisions, evidence, agents..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 text-lg"
          />
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="p-4 text-center text-slate-400">No results found.</Command.Empty>
          
          <Command.Group heading="Navigation" className="text-xs font-semibold text-slate-500 px-2 py-2 uppercase tracking-wider">
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/'))}
              className="flex items-center px-3 py-3 rounded-lg text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer transition-colors mt-1"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Go to Dashboard
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/decisions'))}
              className="flex items-center px-3 py-3 rounded-lg text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer transition-colors"
            >
              <BrainCircuit className="w-4 h-4 mr-3" />
              View All Decisions
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/settings'))}
              className="flex items-center px-3 py-3 rounded-lg text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer transition-colors"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
