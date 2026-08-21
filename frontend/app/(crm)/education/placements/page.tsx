"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export default function PlacementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Placements</h1>
        <Badge variant="outline" className="text-xs">Phase 2</Badge>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-sm text-muted-foreground">
            Placement drives, employer matching, and placement records — coming in Phase 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
