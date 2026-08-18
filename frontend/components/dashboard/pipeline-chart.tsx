import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stages = [
  { stage: "New", value: 85, color: "bg-blue-500" },
  { stage: "Counselled", value: 65, color: "bg-cyan-500" },
  { stage: "Course Selected", value: 48, color: "bg-violet-500" },
  { stage: "Follow-up", value: 35, color: "bg-yellow-500" },
  { stage: "Seat Attended", value: 25, color: "bg-pink-500" },
  { stage: "Registration", value: 18, color: "bg-orange-500" },
  { stage: "Enrolled", value: 10, color: "bg-emerald-500" },
];

export function PipelineChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Lead Pipeline</CardTitle>
        <Badge variant="secondary" className="text-[10px]">7 STAGES</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((s) => (
          <div key={s.stage} className="flex items-center gap-3">
            <span className="w-28 text-xs text-muted-foreground text-right flex-shrink-0">{s.stage}</span>
            <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
              <div className={`h-full rounded ${s.color}`} style={{ width: `${s.value}%` }} />
            </div>
            <span className="w-8 text-xs text-muted-foreground">—</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
