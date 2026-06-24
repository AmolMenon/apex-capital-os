import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert, Sparkles, User, HelpCircle } from "lucide-react"

export type EvidenceType = "verified" | "founder-provided" | "deck-supported" | "research-supported" | "mock-estimate" | "unsupported" | "assumption" | "needs-verification"

interface EvidenceLabelProps {
  type: EvidenceType
  text?: string
}

export function EvidenceLabel({ type, text }: EvidenceLabelProps) {
  const getStyling = () => {
    switch(type) {
      case "verified":
      case "research-supported":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <ShieldCheck className="w-3 h-3" /> }
      case "founder-provided":
      case "deck-supported":
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", icon: <User className="w-3 h-3" /> }
      case "mock-estimate":
        return { bg: "bg-purple-50 text-purple-700 border-purple-200", icon: <Sparkles className="w-3 h-3" /> }
      case "unsupported":
      case "needs-verification":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: <ShieldAlert className="w-3 h-3" /> }
      case "assumption":
        return { bg: "bg-slate-100 text-slate-700 border-slate-200", icon: <HelpCircle className="w-3 h-3" /> }
      default:
        return { bg: "bg-muted text-muted-foreground", icon: null }
    }
  }

  const { bg, icon } = getStyling()
  const defaultText = type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())

  return (
    <Badge variant="outline" className={`font-mono text-[10px] tracking-wider uppercase flex items-center gap-1 ${bg}`}>
      {icon}
      <span>{text || defaultText}</span>
    </Badge>
  )
}
