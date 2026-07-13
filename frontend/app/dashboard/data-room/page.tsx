"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, File, UploadCloud, CheckCircle2, ShieldAlert, AlertTriangle, MoreVertical } from "lucide-react";

export default function DataRoomPage() {
  const files = [
    { id: 1, name: "Acme_Pitch_Deck_v4.pdf", type: "pdf", size: "4.2 MB", status: "analyzed", uploaded: "2 hours ago" },
    { id: 2, name: "Acme_Financial_Model_2026.xlsx", type: "excel", size: "1.1 MB", status: "analyzed", uploaded: "2 hours ago" },
    { id: 3, name: "Q3_Board_Deck.pdf", type: "pdf", size: "3.5 MB", status: "analyzed", uploaded: "Yesterday" },
    { id: 4, name: "Customer_Cohort_Analysis_Raw.csv", type: "csv", size: "845 KB", status: "error", uploaded: "Yesterday" },
    { id: 5, name: "Cap_Table_Current.xlsx", type: "excel", size: "156 KB", status: "processing", uploaded: "Just now" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Data Room</h1>
          <p className="text-muted-foreground mt-1">Manage documents used by the Intelligence Engine.</p>
        </div>
        <Button>
          <UploadCloud className="w-4 h-4 mr-2" /> Upload Files
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg">Uploaded Files</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {files.length > 0 ? files.map(file => (
                  <div key={file.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        {file.type === 'pdf' && <FileText className="w-5 h-5 text-destructive" />}
                        {file.type === 'excel' && <FileSpreadsheet className="w-5 h-5 text-success" />}
                        {file.type === 'csv' && <File className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.uploaded}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {file.status === 'analyzed' && <div className="flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 className="w-3.5 h-3.5" /> Analyzed</div>}
                      {file.status === 'processing' && <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground animate-pulse">Processing...</div>}
                      {file.status === 'error' && <div className="flex items-center gap-1 text-xs font-medium text-destructive"><AlertTriangle className="w-3.5 h-3.5" /> Parse Error</div>}
                      
                      <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <UploadCloud className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">Your Data Room is empty</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Upload your Pitch Deck and Financial Model to allow the engine to generate an Investor Review.
                    </p>
                    <Button className="mt-6">
                      <UploadCloud className="w-4 h-4 mr-2" /> Upload Files
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Data Completeness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Pitch Deck</span>
                <span className="text-muted-foreground text-xs">Uploaded</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Financial Model</span>
                <span className="text-muted-foreground text-xs">Uploaded</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Cap Table</span>
                <span className="text-muted-foreground text-xs">Uploaded</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-destructive" /> Historical P&L</span>
                <span className="text-destructive font-medium text-xs">Missing</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-destructive" /> Cohort Data</span>
                <span className="text-destructive font-medium text-xs">Missing</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <ShieldAlert className="w-8 h-8 text-destructive mx-auto" />
              <div>
                <h3 className="font-bold">Missing Required Data</h3>
                <p className="text-sm text-muted-foreground mt-2">You cannot achieve a Readiness Score above 60 without providing historical financials.</p>
              </div>
              <Button className="w-full" variant="outline">View Requirements</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
