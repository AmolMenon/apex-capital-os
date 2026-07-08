import React, { useState, useEffect, useRef } from "react"
import { FileText, Link as LinkIcon, AlertCircle, FileQuestion, Sparkles, CheckCircle2, XCircle, Loader2, Upload } from "lucide-react"
import { api } from "@/lib/api"

export function EvidenceExplorer({ decisionId }: { decisionId: string }) {
  const [evidence, setEvidence] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [extractingId, setExtractingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'conflicts' | 'assumptions'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const facts = claims.filter(c => c.category !== 'assumption')
  const assumptions = claims.filter(c => c.category === 'assumption')

  const fetchData = async () => {
    try {
      const [evData, clData] = await Promise.all([
        api.get(`/api/v1/decisions/${decisionId}/evidence`).catch(() => []),
        api.get(`/api/v1/decisions/${decisionId}/claims`).catch(() => [])
      ])
      
      // Mock documents for the demo
      setEvidence([
        { title: "Nexus Series A Pitch Deck.pdf", type: "Management Presentation", status: "Extracted" },
        { title: "Founder Update Email - Q3.txt", type: "Internal Communication", status: "Extracted" },
        { title: "Nexus Financials YTD.csv", type: "Financial Data", status: "Extracted" }
      ])
      
      if (clData) {
        setClaims(clData)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [decisionId])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/v1/decisions/${decisionId}/upload`, {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        await fetchData()
      } else {
        alert("Upload failed")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleExtractClaims = async (docIdStr: string) => {
    const docId = docIdStr.replace('doc_', '')
    setExtractingId(docIdStr)
    try {
      const data = await api.post(`/api/v1/decisions/${decisionId}/documents/${docId}/extract-claims`, {})
      if (data) {
        await fetchData()
      } else {
        alert(`Extraction failed`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setExtractingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 border border-slate-800/50 border-dashed rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 font-medium tracking-wide">Reviewing Evidence Room...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Evidence Room</h2>
        <div className="text-sm text-slate-400 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
          <Sparkles className="w-4 h-4 inline mr-2 text-blue-400" />
          Intelligence extracted from {evidence.length} documents
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Source Documents Sidebar */}
        <div className="space-y-4 col-span-1 border-r border-slate-800/50 pr-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Source Documents</h3>
          {evidence.map((doc, idx) => (
            <div key={idx} className="group bg-slate-900/20 border border-slate-800/30 p-3 rounded-lg flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer">
              <div className="flex items-center">
                <FileText className="w-4 h-4 text-slate-400 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-slate-300 truncate w-40">{doc.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{doc.type}</p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
            </div>
          ))}
          
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Missing Information</h3>
            <div className="bg-rose-950/20 border border-rose-900/30 p-3 rounded-lg flex items-start">
              <FileQuestion className="w-4 h-4 text-rose-400 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-rose-300">Customer Churn Data</h4>
                <p className="text-xs text-rose-400/70 mt-1">Not found in any provided document.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Ledger */}
        <div className="col-span-2 space-y-6">
          
          <div className="flex space-x-2 border-b border-slate-800 pb-px">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Extracted Claims ({facts.length})
            </button>
            <button 
              onClick={() => setActiveTab('conflicts')}
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'conflicts' ? 'border-rose-500 text-rose-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Conflicts (1)
            </button>
            <button 
              onClick={() => setActiveTab('assumptions')}
              className={`pb-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'assumptions' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              Unverified Assumptions ({assumptions.length})
            </button>
          </div>

          <div className="space-y-4 mt-4">
            
            {activeTab === 'all' && facts.map((claim, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
                <p className="text-slate-200 font-medium">"{claim.statement}"</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] uppercase font-semibold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                    Management Claim
                  </span>
                  <button className="text-xs text-slate-500 flex items-center hover:text-blue-400 transition-colors">
                    <LinkIcon className="w-3 h-3 mr-1.5" />
                    Trace to Source: {claim.provenance_type}
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'conflicts' && (
              <div className="bg-rose-950/10 border border-rose-900/30 p-6 rounded-xl flex flex-col shadow-sm">
                <div className="flex items-center justify-between border-b border-rose-900/30 pb-4 mb-4">
                  <div className="flex items-center text-rose-400">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold tracking-wide uppercase text-sm">Material Evidence Conflict</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500 bg-rose-500/10 px-2 py-1 rounded">High Severity</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 relative">
                  <div className="flex-1 bg-slate-900/60 border border-slate-700/50 p-5 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Claim A</span>
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded uppercase font-semibold">Management Claim</span>
                      </div>
                      <p className="text-slate-200 text-sm font-medium leading-relaxed">"{claims.find(c => c.id === 1)?.statement || 'Claim data unavailable.'}"</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center text-xs text-slate-400">
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      Source: Nexus Series A Pitch Deck.pdf (Slide 4)
                    </div>
                  </div>
                  
                  <div className="hidden md:flex flex-col justify-center items-center px-2 z-10">
                    <div className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-rose-500/30">Versus</div>
                  </div>
                  
                  <div className="flex-1 bg-slate-900/60 border border-slate-700/50 p-5 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Claim B</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-semibold">Financial Evidence</span>
                      </div>
                      <p className="text-slate-200 text-sm font-medium leading-relaxed">"{claims.find(c => c.id === 2)?.statement || 'Claim data unavailable.'}"</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center text-xs text-slate-400">
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      Source: Nexus Financials YTD.csv (Row 42)
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Investment Implication</h4>
                  <p className="text-sm text-slate-300">
                    The difference in ARR definition materially alters the valuation multiple and growth trajectory. This conflict triggers an automatic <strong>Challenge Finding</strong> and blocks the recommendation until explicitly overridden by the IC.
                  </p>
                </div>
                
              </div>
            )}

            {activeTab === 'assumptions' && assumptions.map((claim, idx) => (
              <div key={idx} className="bg-amber-950/10 border border-amber-900/30 p-4 rounded-xl flex items-start">
                <XCircle className="w-5 h-5 text-amber-500/70 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-200 font-medium text-sm">"{claim.statement}"</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] uppercase font-semibold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                      Unverified Assumption
                    </span>
                    <span className="text-xs text-slate-500">
                      Requires Diligence
                    </span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  )
}
