"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const revenueData = [
  { name: 'Q1 2023', SaaS: 4000, Marketplace: 2400, DeepTech: 2400 },
  { name: 'Q2 2023', SaaS: 3000, Marketplace: 1398, DeepTech: 2210 },
  { name: 'Q3 2023', SaaS: 2000, Marketplace: 9800, DeepTech: 2290 },
  { name: 'Q4 2023', SaaS: 2780, Marketplace: 3908, DeepTech: 2000 },
  { name: 'Q1 2024', SaaS: 1890, Marketplace: 4800, DeepTech: 2181 },
  { name: 'Q2 2024', SaaS: 2390, Marketplace: 3800, DeepTech: 2500 },
  { name: 'Q3 2024', SaaS: 3490, Marketplace: 4300, DeepTech: 2100 },
];

const sectorData = [
  { name: 'AI/ML', value: 400 },
  { name: 'Fintech', value: 300 },
  { name: 'DevTools', value: 300 },
  { name: 'HealthTech', value: 200 },
];
const COLORS = ['#10b981', '#3b82f6', '#6366f1', '#f59e0b'];

export function PortfolioRevenueChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={revenueData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }}/>
          <Line type="monotone" dataKey="SaaS" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="Marketplace" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="DeepTech" stroke="#8b5cf6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PortfolioSectorChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sectorData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {sectorData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
