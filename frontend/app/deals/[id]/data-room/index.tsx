"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, FileText, CheckCircle, AlertTriangle, ShieldCheck, Database, RefreshCw, X, FolderOpen } from "lucide-react";

export default function DataRoomPage() {
  const params = useParams();
  const id = params.id as string;
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<string>("unknown");
  
  const [impactData, setImpactData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docs, missingImpact] = await Promise.all([
        api.getDealDocuments(id),
        api.getDocumentMissingInfoImpact(id).catch(() => null)
      ]);
      setDocuments(docs);
      setImpactData(missingImpact);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      await api.uploadDealDocument(id, selectedFile, selectedType);
      setSelectedFile(null);
      await fetchData();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload document. Max size 25MB.");
    } finally {
      setUploading(false);
    }
  };

  const handleReprocess = async (docId: string) => {
    try {
      await api.reprocessDealDocument(id, docId);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await api.deleteDealDocument(id, docId);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Room & Document Intelligence</h1>
          <p className="text-neutral-500 mt-2">Upload and manage diligence documents. Apex automatically parses, classifies, and maps claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="p-6 md:col-span-1 space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold flex items-center">
            <Upload className="w-5 h-5 mr-2" /> Upload Document
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Document Type Hint</label>
              <select 
                className="w-full border rounded p-2 text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="unknown">Auto-detect</option>
                <option value="pitch_deck">Pitch Deck</option>
                <option value="financial_model">Financial Model</option>
                <option value="cap_table">Cap Table</option>
                <option value="customer_reference">Customer References</option>
                <option value="legal_document">Legal Document</option>
              </select>
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-neutral-50 cursor-pointer">
              <input type="file" onChange={handleFileChange} className="w-full text-sm mb-4" />
              {selectedFile && (
                <div className="text-sm text-emerald-600 font-medium mb-2">{selectedFile.name} ({(selectedFile.size/1024/1024).toFixed(2)} MB)</div>
              )}
              <Button onClick={handleUpload} disabled={uploading || !selectedFile} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {uploading ? "Uploading & Parsing..." : "Upload to Data Room"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Missing Info Impact */}
        <Card className="p-6 md:col-span-2 shadow-sm bg-neutral-50/50">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <ShieldCheck className="w-5 h-5 mr-2 text-blue-600" /> Diligence Impact
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <span className="text-neutral-500 font-medium block mb-2">Resolved Gaps</span>
              {impactData?.resolved_fields?.length > 0 ? (
                <ul className="space-y-1 text-emerald-700 list-disc list-inside">
                  {impactData.resolved_fields.map((f: string) => <li key={f}>{f.replace(/_/g, ' ')}</li>)}
                </ul>
              ) : <span className="text-neutral-400 italic">No gaps resolved yet.</span>}
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <span className="text-neutral-500 font-medium block mb-2">Partially Resolved</span>
              {impactData?.partially_resolved_fields?.length > 0 ? (
                <ul className="space-y-1 text-amber-700 list-disc list-inside">
                  {impactData.partially_resolved_fields.map((f: string) => <li key={f}>{f.replace(/_/g, ' ')}</li>)}
                </ul>
              ) : <span className="text-neutral-400 italic">None.</span>}
            </div>
          </div>
        </Card>
      </div>

      {/* Document Library */}
      <h3 className="text-xl font-bold tracking-tight mt-8 flex items-center">
        <FolderOpen className="w-6 h-6 mr-2 text-emerald-600" /> Document Library
      </h3>
      
      {documents.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-lg bg-neutral-50">
          <Database className="w-10 h-10 mx-auto text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900">Data Room is Empty</h3>
          <p className="text-neutral-500 max-w-sm mx-auto mt-2">Upload your first document to populate the Evidence Center and begin deep analysis.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.document_id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="text-lg font-semibold">{doc.original_file_name}</h4>
                    {doc.processing_status === "parsed" && <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300"><CheckCircle className="w-3 h-3 mr-1" /> Parsed</Badge>}
                    {doc.processing_status === "failed" && <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</Badge>}
                  </div>
                  <div className="text-sm text-neutral-500 space-x-4 flex items-center">
                    <span>Type: <b>{doc.document_type.replace('_', ' ')}</b></span>
                    <span>•</span>
                    <span>Size: {(doc.file_size / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleReprocess(doc.document_id)}><RefreshCw className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(doc.document_id)}><X className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Trust Badges */}
              {doc.trust_status?.trust_labels?.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {doc.trust_status.trust_labels.map((lbl: string) => (
                    <Badge key={lbl} variant="outline" className="bg-neutral-100 text-neutral-700 border-neutral-300">
                      <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> {lbl}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Summary */}
              {doc.summary && (
                <div className="bg-neutral-50 p-4 rounded-md text-sm text-neutral-700 mb-4 border border-neutral-100">
                  <p className="font-medium text-neutral-900 mb-1">Parser Summary</p>
                  {doc.summary}
                </div>
              )}

              {/* Claims */}
              {doc.extracted_claims?.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold mb-3 flex items-center"><FileText className="w-4 h-4 mr-1 text-blue-500" /> Extracted Evidence Claims</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border rounded-lg">
                      <thead className="bg-neutral-50 border-b">
                        <tr>
                          <th className="px-4 py-2 font-medium">Claim</th>
                          <th className="px-4 py-2 font-medium">Category</th>
                          <th className="px-4 py-2 font-medium">Confidence</th>
                          <th className="px-4 py-2 font-medium">Verification Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {doc.extracted_claims.map((claim: any, i: number) => (
                          <tr key={i} className="hover:bg-neutral-50/50">
                            <td className="px-4 py-2 font-medium text-neutral-800">{claim.claim_text}</td>
                            <td className="px-4 py-2 text-neutral-500 capitalize">{claim.claim_category.replace('_', ' ')}</td>
                            <td className="px-4 py-2">
                              <Badge variant="outline" className={claim.confidence === 'High' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' : 'text-amber-700 border-amber-200 bg-amber-50'}>
                                {claim.confidence}
                              </Badge>
                            </td>
                            <td className="px-4 py-2 text-neutral-500 capitalize flex items-center">
                              {claim.verification_status === "needs_verification" && <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />}
                              {claim.verification_status.replace('_', ' ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
