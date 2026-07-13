with open("frontend/app/deals/[id]/evidence-center/page.tsx", "r") as f:
    content = f.read()

if "getDataRoomReport" not in content:
    content = content.replace(
        "const [loading, setLoading] = useState(true)",
        "const [loading, setLoading] = useState(true)\n  const [dataRoom, setDataRoom] = useState<any>(null)\n  const [filter, setFilter] = useState('All')"
    )
    content = content.replace(
        "const d = await api.getDeal(resolvedParams.id)",
        "const d = await api.getDeal(resolvedParams.id)\n        try { const dr = await api.getDataRoomReport(resolvedParams.id); setDataRoom(dr); } catch(e){}"
    )
    
    ui_patch = """
      <div className="flex space-x-2 mb-6">
        {['All', 'Public', 'Private Data Room', 'Contradictions'].map(f => (
          <Badge key={f} variant={filter === f ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter(f)}>
            {f}
          </Badge>
        ))}
      </div>
      
      {dataRoom && dataRoom.data_room_completeness_score > 0 && (filter === 'All' || filter === 'Private Data Room' || filter === 'Contradictions') && (
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold flex items-center"><Database className="mr-2 h-5 w-5 text-emerald-500" /> Private Data Room Evidence</h2>
          {dataRoom.metrics_extracted?.map((m: any, i: number) => (
            <Card key={`dr-${i}`}>
              <CardContent className="p-4 flex justify-between items-center bg-emerald-50/50">
                <div>
                  <div className="font-semibold text-emerald-900">{m.metric_name}: {m.metric_value}</div>
                  <div className="text-xs text-emerald-700 mt-1 flex items-center"><FileText className="w-3 h-3 mr-1"/> {m.source_document} ({m.confidence})</div>
                </div>
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">Verified Private</Badge>
              </CardContent>
            </Card>
          ))}
          {dataRoom.contradictions?.map((c: any, i: number) => (
             <Card key={`drc-${i}`} className="border-amber-200">
              <CardContent className="p-4 bg-amber-50">
                <div className="font-semibold text-amber-900 flex items-center"><AlertTriangle className="w-4 h-4 mr-2"/> {c.issue}</div>
                <div className="text-sm text-amber-800 mt-1">{c.evidence_a} vs {c.evidence_b}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
"""
    content = content.replace('className="max-w-4xl mx-auto p-8">\n      <div className="mb-8">', 'className="max-w-4xl mx-auto p-8">\n      <div className="mb-8">\n' + ui_patch)
    with open("frontend/app/deals/[id]/evidence-center/page.tsx", "w") as f:
        f.write(content)

