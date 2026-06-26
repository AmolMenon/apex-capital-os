"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function DataRoomPage() {
  const [dataRoom, setDataRoom] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getFundDataRoom();
        setDataRoom(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading data room checklist...</div>;

  const categories = Array.from(new Set(dataRoom.map(i => i.category)));

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex items-center gap-4 mb-4 border-b border-zinc-800 pb-6">
        <Link href="/fund-os" className="text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Fund Data Room Completeness</h1>
          <p className="text-zinc-400">Checklist of required LP diligence materials.</p>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map(cat => (
          <div key={cat as string}>
            <h2 className="text-xl font-medium text-zinc-100 mb-4">{cat as string}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dataRoom.filter(i => i.category === cat).map(item => (
                <Card key={item.item_id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {item.status === 'Completed' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : item.status === 'In Progress' ? (
                        <Clock className="w-5 h-5 text-amber-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-zinc-600" />
                      )}
                      <div>
                        <div className="font-medium text-white">{item.document_name}</div>
                        {item.owner && <div className="text-xs text-zinc-500 mt-1">Owner: {item.owner}</div>}
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      item.status === 'Completed' ? 'border-emerald-500/50 text-emerald-400' :
                      item.status === 'In Progress' ? 'border-amber-500/50 text-amber-400' :
                      'border-zinc-700 text-zinc-400'
                    }>
                      {item.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
