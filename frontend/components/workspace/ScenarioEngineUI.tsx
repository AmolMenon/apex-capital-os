"use client"

import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity } from "lucide-react"

const mockData = [
  { name: 'Q1', worst: 4000, expected: 6000, best: 8000 },
  { name: 'Q2', worst: 3000, expected: 6500, best: 9000 },
  { name: 'Q3', worst: 2000, expected: 7000, best: 11000 },
  { name: 'Q4', worst: 1500, expected: 8000, best: 14000 },
]

export function ScenarioEngineUI({ decisionId }: { decisionId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Scenario Engine</h2>
          <p className="text-sm text-slate-400 mt-1">Simulating risk propagation and expected value.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-slate-900/40 p-6 rounded-xl border border-slate-800/50">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-400" />
            Financial Projection Simulation
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="best" stroke="#34d399" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Best Case" />
                <Line type="monotone" dataKey="expected" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Expected Case" />
                <Line type="monotone" dataKey="worst" stroke="#fb7185" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Worst Case" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5 border-l-2 border-l-emerald-400">
            <h4 className="text-sm font-semibold text-emerald-400 mb-1">Best Case Strategy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Aggressive hiring in Q1. Expected upside captures 40% market share.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5 border-l-2 border-l-blue-400">
            <h4 className="text-sm font-semibold text-blue-400 mb-1">Expected Strategy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Phased rollout. Validates unit economics before scaling.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5 border-l-2 border-l-rose-400">
            <h4 className="text-sm font-semibold text-rose-400 mb-1">Worst Case Risk</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Regulatory block. Capital tied up for 12 months with no return.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
