"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ArrowUpRight, ArrowDownRight, ArrowRight, HeartPulse } from "lucide-react"

interface HealthFactor {
  name: string;
  score: number;
  trend: "up" | "down" | "flat";
  explanation: string;
}

export function DealHealthEngine({ factors }: { factors: HealthFactor[] }) {
  if (!factors || factors.length === 0) return null;

  // Compute average score for the radar chart fill color logic if needed
  const avg = factors.reduce((acc, f) => acc + f.score, 0) / factors.length;
  const isHealthy = avg >= 75;

  return (
    <div className="space-y-6">
      
      {/* Radar Chart */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-2 border-b bg-muted/20">
          <CardTitle className="text-base flex items-center gap-2">
            <HeartPulse className={`w-4 h-4 ${isHealthy ? 'text-emerald-500' : 'text-amber-500'}`} /> 
            Deal Health Engine
          </CardTitle>
          <CardDescription>Dynamic 10-factor investment viability score</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={factors}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Health Score"
                  dataKey="score"
                  stroke={isHealthy ? "var(--emerald-500)" : "var(--amber-500)"}
                  fill={isHealthy ? "var(--emerald-500)" : "var(--amber-500)"}
                  fillOpacity={0.2}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Factor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factors.map((factor) => (
          <Card key={factor.name} className="shadow-sm border-border/50 hover:border-primary/50 transition-colors group">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-foreground/80">{factor.name}</span>
                <div className={`flex items-center text-xs font-bold ${
                  factor.trend === 'up' ? 'text-emerald-500' : 
                  factor.trend === 'down' ? 'text-rose-500' : 'text-muted-foreground'
                }`}>
                  <span className="mr-1">{factor.score}/100</span>
                  {factor.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                  {factor.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                  {factor.trend === 'flat' && <ArrowRight className="w-3 h-3" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 group-hover:text-foreground transition-colors">
                {factor.explanation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  )
}
