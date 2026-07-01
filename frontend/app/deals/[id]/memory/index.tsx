"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, TrendingUp, TrendingDown, Clock } from "lucide-react"

const MEMORY_SNAPSHOTS = [
  {
    date: "Oct 24, 2024",
    conviction: 82,
    recommendation: "INVEST",
    risk: "LOW",
    reason: "New Enterprise contract signed. ARR crossed $1M.",
    partner: null
  },
  {
    date: "Oct 15, 2024",
    conviction: 75,
    recommendation: "WAIT",
    risk: "MEDIUM",
    reason: "Wait for Q3 financial close.",
    partner: "Partner Override: WAIT (AI proposed INVEST)"
  },
  {
    date: "Sep 01, 2024",
    conviction: 60,
    recommendation: "WAIT",
    risk: "HIGH",
    reason: "Customer concentration risk detected (90% revenue from 1 client).",
    partner: null
  },
  {
    date: "Aug 10, 2024",
    conviction: 45,
    recommendation: "PASS",
    risk: "HIGH",
    reason: "Initial deck review. Valuation expectations too high.",
    partner: null
  }
]

export default function AIMemory() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <History className="w-8 h-8 text-primary" /> AI Memory Timeline
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Historical tracking of conviction scores and risk factors.</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50 hidden md:block" />
        
        <div className="space-y-12">
          {MEMORY_SNAPSHOTS.map((snapshot, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              <div className="flex-1 w-full md:text-right">
                {index % 2 === 0 ? (
                  <Card className="hover:border-primary/50 transition-colors shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline">{snapshot.date}</Badge>
                        <Badge className={snapshot.recommendation === 'INVEST' ? 'bg-emerald-500' : snapshot.recommendation === 'WAIT' ? 'bg-amber-500' : 'bg-rose-500'}>
                          {snapshot.recommendation}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold mb-2">Conviction: {snapshot.conviction}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{snapshot.reason}</p>
                      {snapshot.partner && (
                        <div className="mt-4 p-3 bg-amber-500/10 text-amber-500 text-xs font-bold rounded flex items-center gap-2">
                          <Clock className="w-4 h-4"/> {snapshot.partner}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="hidden md:block">
                    <div className="text-4xl font-black text-muted/30">{snapshot.conviction}</div>
                  </div>
                )}
              </div>
              
              <div className="w-12 h-12 rounded-full bg-background border-4 border-primary flex items-center justify-center relative z-10 shrink-0">
                {index < MEMORY_SNAPSHOTS.length - 1 && MEMORY_SNAPSHOTS[index].conviction > MEMORY_SNAPSHOTS[index+1].conviction ? (
                   <TrendingUp className="w-5 h-5 text-emerald-500" />
                ) : (
                   <TrendingDown className="w-5 h-5 text-rose-500" />
                )}
              </div>
              
              <div className="flex-1 w-full text-left">
                {index % 2 !== 0 ? (
                   <Card className="hover:border-primary/50 transition-colors shadow-lg">
                   <CardContent className="p-6">
                     <div className="flex justify-between items-start mb-4">
                       <Badge variant="outline">{snapshot.date}</Badge>
                       <Badge className={snapshot.recommendation === 'INVEST' ? 'bg-emerald-500' : snapshot.recommendation === 'WAIT' ? 'bg-amber-500' : 'bg-rose-500'}>
                         {snapshot.recommendation}
                       </Badge>
                     </div>
                     <h3 className="text-lg font-bold mb-2">Conviction: {snapshot.conviction}</h3>
                     <p className="text-muted-foreground text-sm leading-relaxed">{snapshot.reason}</p>
                     {snapshot.partner && (
                        <div className="mt-4 p-3 bg-amber-500/10 text-amber-500 text-xs font-bold rounded flex items-center gap-2">
                          <Clock className="w-4 h-4"/> {snapshot.partner}
                        </div>
                      )}
                   </CardContent>
                 </Card>
                ) : (
                  <div className="hidden md:block text-right">
                    <div className="text-4xl font-black text-muted/30">{snapshot.conviction}</div>
                  </div>
                )}
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
