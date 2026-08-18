"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stages = [
  { name: "New", count: 45, color: "bg-blue-500", pct: 100 },
  { name: "Counselled", count: 32, color: "bg-cyan-500", pct: 71 },
  { name: "Course Selected", count: 24, color: "bg-violet-500", pct: 53 },
  { name: "Follow-up", count: 18, color: "bg-yellow-500", pct: 40 },
  { name: "Seat Attended", count: 14, color: "bg-pink-500", pct: 31 },
  { name: "Registration", count: 10, color: "bg-orange-500", pct: 22 },
  { name: "Enrolled", count: 8, color: "bg-emerald-500", pct: 18 },
];

export function ConversionFunnel() {
  const conversionRate = Math.round((stages[stages.length - 1].count / stages[0].count) * 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Conversion Funnel</CardTitle>
        <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20">
          {conversionRate}% conversion
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {stages.map((stage, i) => (
          <div key={stage.name} className="flex items-center gap-3">
            <span className="w-28 text-xs text-muted-foreground text-right flex-shrink-0">{stage.name}</span>
            <div className="flex-1">
              <div className="h-8 bg-muted rounded overflow-hidden relative">
                <div className={`h-full rounded ${stage.color} transition-all`} style={{ width: `${stage.pct}%` }} />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold">{stage.count}</span>
              </div>
            </div>
            {i > 0 && (
              <span className="text-[10px] text-muted-foreground w-10 flex-shrink-0">
                {Math.round((stage.count / stages[i - 1].count) * 100)}%
              </span>
            )}
          </div>
        ))}
        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">New → Enrolled</span>
          <span className="font-semibold text-emerald-500">{stages[0].count} → {stages[stages.length - 1].count} ({conversionRate}%)</span>
        </div>
      </CardContent>
    </Card>
  );
}
