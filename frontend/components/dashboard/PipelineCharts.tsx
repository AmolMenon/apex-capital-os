"use client"

import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Deal } from "@/types";

interface PipelineChartsProps {
  deals: Deal[];
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

export function PipelineCharts({ deals }: PipelineChartsProps) {
  
  // 1. Stage Distribution
  const stageData = useMemo(() => {
    const counts: Record<string, number> = {};
    deals.forEach(d => {
      counts[d.status] = (counts[d.status] || 0) + 1;
    });
    
    // Sort by typical funnel order if possible, or just raw counts
    const funnelOrder = ["New", "Deal Intake", "Startup Eval", "Claim Verification", "Due Diligence", "AI Research", "Investment Thesis", "IC Memo", "Approved", "Passed", "Portfolio Tracking"];
    
    return Object.keys(counts)
      .map(key => ({ name: key, count: counts[key] }))
      .sort((a, b) => {
        const idxA = funnelOrder.indexOf(a.name);
        const idxB = funnelOrder.indexOf(b.name);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        return b.count - a.count; // fallback to count desc
      });
  }, [deals]);

  // 2. Sector Distribution
  const sectorData = useMemo(() => {
    const counts: Record<string, number> = {};
    deals.forEach(d => {
      if (d.sector) {
        counts[d.sector] = (counts[d.sector] || 0) + 1;
      }
    });
    return Object.keys(counts)
      .map(key => ({ name: key, count: counts[key] }))
      .sort((a, b) => b.count - a.count);
  }, [deals]);

  // 3. Deal Size/Valuation Bubble (Simulated Timeline for now since we don't have dates)
  const timelineData = useMemo(() => {
    // We'll just generate a mock monthly deal flow trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((m, i) => ({
      name: m,
      newDeals: Math.floor(Math.random() * 20) + 5,
      passed: Math.floor(Math.random() * 10) + 2,
    }));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Funnel Chart (Bar Chart as proxy) */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Pipeline Funnel</CardTitle>
          <CardDescription>Deals mapped by their current evaluation stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <RechartsTooltip 
                  cursor={{fill: 'hsl(var(--muted))', opacity: 0.4}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={32}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sector Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Allocation</CardTitle>
          <CardDescription>Pipeline distribution by industry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="hsl(var(--background))" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {sectorData.slice(0, 6).map((entry, i) => (
              <div key={i} className="flex items-center text-xs">
                <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground truncate max-w-[80px]">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Deal Flow */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Monthly Deal Flow</CardTitle>
          <CardDescription>Volume of new opportunities vs passes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="newDeals" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorNew)" name="New Deals" />
                <Area type="monotone" dataKey="passed" stroke="#ef4444" fillOpacity={1} fill="url(#colorPassed)" name="Passed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
