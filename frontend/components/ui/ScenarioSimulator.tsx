// @ts-nocheck
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function ScenarioSimulator({ baseArr, baseValuation }: { baseArr: number, baseValuation: number }) {
  const [arrGrowth, setArrGrowth] = useState(150); // % YoY
  const [multiple, setMultiple] = useState(10); // ARR Multiple at exit
  const [years, setYears] = useState(5); // Years to exit

  // Calculate projected Exit Value
  const projectedARR = baseArr * Math.pow((1 + arrGrowth / 100), years);
  const exitValue = projectedARR * multiple;
  const moic = exitValue / baseValuation; // Very simplified MOIC (assumes no dilution)

  const data = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Year ${i}`,
    arr: (baseArr * Math.pow((1 + arrGrowth / 100), i)) / 1000000,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 shadow-sm border-border/50 bg-background">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-muted-foreground">ARR Growth (YoY)</span>
              <span className="font-bold">{arrGrowth}%</span>
            </div>
            <Slider 
              value={[arrGrowth]} 
              onValueChange={(v) => setArrGrowth(v[0])} 
              max={300} 
              step={5} 
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-muted-foreground">Exit Multiple (ARR)</span>
              <span className="font-bold">{multiple}x</span>
            </div>
            <Slider 
              value={[multiple]} 
              onValueChange={(v) => setMultiple(v[0])} 
              max={30} 
              min={2}
              step={1} 
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-muted-foreground">Years to Exit</span>
              <span className="font-bold">{years} yrs</span>
            </div>
            <Slider 
              value={[years]} 
              onValueChange={(v) => setYears(v[0])} 
              max={10} 
              min={1}
              step={1} 
            />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 shadow-sm border-border/50">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Projected Outcomes
          </CardTitle>
          <div className="flex gap-4">
             <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Est. MOIC</div>
                <div className={`text-lg font-black ${moic >= 3 ? 'text-emerald-500' : moic >= 1 ? 'text-amber-500' : 'text-red-500'}`}>
                  {moic.toFixed(1)}x
                </div>
             </div>
             <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Exit Val</div>
                <div className="text-lg font-black text-primary">
                  ${(exitValue / 1000000).toFixed(1)}M
                </div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(val) => `$${val}M`} tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                formatter={(value: number) => [`$${value.toFixed(1)}M`, 'Projected ARR']}
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="arr" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3} 
                dot={{r: 4, fill: "hsl(var(--primary))", strokeWidth: 0}}
                activeDot={{r: 6, fill: "hsl(var(--primary))", strokeWidth: 0}}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
