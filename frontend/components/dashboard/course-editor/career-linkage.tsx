"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CareerLinkageSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">5 — Career Linkage</CardTitle>
        <Badge variant="secondary" className="text-[10px]">LINK</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <Label>Career Path</Label>
          <Select><SelectTrigger><SelectValue placeholder="Select career path..." /></SelectTrigger>
            <SelectContent><SelectItem value="p1">Path 1</SelectItem><SelectItem value="p2">Path 2</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground mb-2">Linked Roles:</div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">— ×</Badge>
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">— ×</Badge>
        </div>
        <Button variant="outline" size="sm" className="mt-3">+ Link Path</Button>
      </CardContent>
    </Card>
  );
}
