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
      
      if (evData) {
        setEvidence(evData)
      }
      
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
          
          {evidence.length === 0 && (
             <div className="text-sm text-muted-foreground italic p-4 bg-muted/10 rounded-lg border">No source documents uploaded.</div>
          )}
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
              <div className="space-y-4">
                {claims.filter(c => c.category === 'conflict' || c.is_conflict).length > 0 ? claims.filter(c => c.category === 'conflict' || c.is_conflict).map((conflict, idx) => (
                  <div key={idx} className="bg-rose-50 border border-rose-200 p-6 rounded-xl flex flex-col shadow-sm">
                    <div className="flex items-center justify-between border-b border-rose-200 pb-4 mb-4">
                      <div className="flex items-center text-rose-800">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <h3 className="font-bold tracking-wide uppercase text-sm">Evidence Conflict</h3>
                      </div>
                    </div>
                    <p className="text-foreground text-sm font-medium leading-relaxed">"{conflict.statement}"</p>
                  </div>
                )) : (
                  <p className="text-muted-foreground italic bg-muted/20 p-6 rounded-xl border border-dashed text-center">No conflicts detected in the current evidence base.</p>
                )}
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
