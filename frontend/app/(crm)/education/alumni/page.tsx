"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

export default function AlumniPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Alumni</h1>
        <Badge variant="outline" className="text-xs">Phase 2</Badge>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-sm text-muted-foreground">
            Alumni directory, alumni 360, and relationship tracking — coming in Phase 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
