"use client"

import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Badge } from "@/components/ui/badge"

export function ConvictionHistoryGraph({ baseScore }: { baseScore: number }) {
  // Generate a plausible historical trend ending at the base score
  const data = [
    { date: 'Initial', score: Math.max(0, baseScore - 25), event: 'First Screen', explanation: 'Strong TAM and team background identified.' },
    { date: 'Wk 1', score: Math.max(0, baseScore - 15), event: 'Founder Call', explanation: 'Founders demonstrated deep domain expertise.' },
    { date: 'Wk 2', score: Math.max(0, baseScore - 10), event: 'Deck Analysis', explanation: 'Financial projections appear realistic.' },
    { date: 'Wk 3', score: baseScore + 5, event: 'Customer Refs', explanation: '3/3 customers cited superior UX over incumbents.' },
    { date: 'Wk 4', score: baseScore - 10, event: 'Market DD', explanation: 'Identified high customer concentration risk.' },
    { date: 'Today', score: baseScore, event: 'Final Review', explanation: 'Contingency plans validated. Ready for IC.' }
  ];

  return (
    <div className="w-full h-32 mt-4 relative">
      <div className="absolute top-0 right-0 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Conviction Trend</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="date" tick={{fontSize: 10, fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-card border shadow-lg p-3 rounded-md w-[200px]">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-sm">{data.event}</div>
                      <div className="text-primary font-bold">{data.score}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {data.explanation}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3} 
            dot={{r: 4, fill: "hsl(var(--primary))", strokeWidth: 0}}
            activeDot={{r: 6, fill: "hsl(var(--primary))", strokeWidth: 0}}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
