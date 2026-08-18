"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function CertificationsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">4 — Certifications</CardTitle>
        <Badge variant="secondary" className="text-[10px]">CREDENTIALS</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto"><Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Provider</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            <TableRow><TableCell>—</TableCell><TableCell className="text-muted-foreground">—</TableCell><TableCell><button className="text-xs text-destructive hover:underline">Delete</button></TableCell></TableRow>
          </TableBody>
        </Table></div>
        <div className="flex gap-3 mt-3 items-end">
          <div className="flex-1 space-y-1"><Label className="text-xs">Name</Label><Input placeholder="Certification name" /></div>
          <div className="flex-1 space-y-1"><Label className="text-xs">Provider</Label><Input placeholder="Issuing body" /></div>
          <Button variant="outline" size="sm">+ Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}
