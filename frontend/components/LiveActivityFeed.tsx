"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CircleDot, Zap, MessageSquare, TrendingUp } from "lucide-react";

interface ActivityEvent {
  id: number;
  action: string;
  details: string;
  created_at: string;
}

export function LiveActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/portfolio/activity-feed`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (action: string) => {
    if (action.includes("Research") || action.includes("Autonomous")) return <Zap className="w-4 h-4 text-amber-500" />;
    if (action.includes("Comment") || action.includes("Note")) return <MessageSquare className="w-4 h-4 text-blue-500" />;
    if (action.includes("Score") || action.includes("Updated")) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <CircleDot className="w-4 h-4 text-primary" />;
  };

  return (
    <Card className="h-full flex flex-col border-border/50 shadow-sm">
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Live Firm Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {events.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No recent activity.</div>
        ) : (
          <div className="divide-y divide-border/30">
            {events.map(event => (
              <div key={event.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex gap-3">
                  <div className="mt-1">
                    {getIcon(event.action)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{event.action}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{event.details}</div>
                    <div className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider font-semibold">
                      {event.created_at}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
