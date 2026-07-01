"use client"

import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Badge } from "@/components/ui/badge"

export function ConvictionHistoryGraph({ baseScore }: { baseScore: number }) {
  // Generate a plausible historical trend ending at the base score
  const data = [
    { date: 'Initial', score: Math.max(0, baseScore - 25), event: 'First Screen' },
    { date: 'Wk 1', score: Math.max(0, baseScore - 15), event: 'Founder Call' },
    { date: 'Wk 2', score: Math.max(0, baseScore - 10), event: 'Deck Analysis' },
    { date: 'Wk 3', score: baseScore + 5, event: 'Customer Refs (Positive)' },
    { date: 'Wk 4', score: baseScore - 10, event: 'Market Deep Dive (Saturated)' },
    { date: 'Today', score: baseScore, event: 'Final Review' }
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
                return (
                  <div className="bg-card border shadow-md p-2 rounded text-xs">
                    <div className="font-bold">{payload[0].payload.event}</div>
                    <div className="text-primary mt-1">Score: {payload[0].value}</div>
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
