"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Reports</h1>
          <Badge variant="outline" className="text-xs font-semibold">Phase 3</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Custom reports, dashboards, and data exports across all modules.
        </p>
      </div>
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Coming soon — this module will be built in Phase 3.
        </CardContent>
      </Card>
    </div>
  );
}
