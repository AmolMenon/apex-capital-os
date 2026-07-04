"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BrainCircuit, Network, BookOpen, Settings } from "lucide-react"

const NAV_ITEMS = [
  { name: "Pipeline", href: "/", icon: LayoutDashboard },
  { name: "Monitoring", href: "/monitoring", icon: BrainCircuit },
  { name: "Decision Memory", href: "/memory", icon: BookOpen },
]

export function WorkspaceNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-white/10 flex flex-col pt-16 z-10 backdrop-blur-xl bg-opacity-80">
      <div className="px-6 pb-6">
        <h2 className="text-white/50 text-xs font-semibold tracking-wider uppercase mb-4">Workspace</h2>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <Link
          href="/settings"
          className="flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200 group"
        >
          <Settings className="w-5 h-5 mr-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  )
}
