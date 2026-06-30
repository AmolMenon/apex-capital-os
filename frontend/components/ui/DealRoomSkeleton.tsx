import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DealRoomSkeleton() {
  return (
    <div className="space-y-8 pb-20 animate-pulse">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-muted rounded-md"></div>
          <div className="h-4 w-96 bg-muted rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-muted rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <div className="h-5 w-32 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-16 bg-muted rounded mb-2"></div>
              <div className="h-3 w-40 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/5">
          <div className="h-6 w-48 bg-muted rounded"></div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 w-1/3 bg-muted rounded"></div>
                  <div className="h-4 w-20 bg-muted rounded"></div>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-5/6 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
