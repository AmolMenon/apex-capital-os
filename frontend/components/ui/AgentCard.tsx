import React from "react"
import { Brain } from "lucide-react"

interface AgentCardProps {
  name: string
  stance: string
  opinion: string
  color: string
  bgClass: string
}

export function AgentCard({ name, stance, opinion, color, bgClass }: AgentCardProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center mr-3`}>
            <Brain className={`w-4 h-4 ${color}`} />
          </div>
          <h4 className="text-sm font-medium text-slate-200">{name}</h4>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border border-slate-800 ${color}`}>
          {stance}
        </span>
      </div>
      <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
        &quot;{opinion}&quot;
      </p>
      <div className="mt-4 pt-4 border-t border-slate-800/50 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
        View full reasoning chain →
      </div>
    </div>
  )
}
