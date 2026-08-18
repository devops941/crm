"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const levels = [
  { name: "Beginner", duration: "—", fee: "₹—", batch: "—", mode: "—", type: "—" },
  { name: "Learner", duration: "—", fee: "₹—", batch: "—", mode: "—", type: "—" },
  { name: "Expert", duration: "—", fee: "₹—", batch: "—", mode: "—", type: "—" },
];

export function LevelsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">2 — Course Levels</CardTitle>
        <Badge variant="secondary" className="text-[10px]">REPEATABLE</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead><TableHead>Duration</TableHead><TableHead>Fee</TableHead>
              <TableHead>Batch Size</TableHead><TableHead>Mode</TableHead><TableHead>Batch Type</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map((l) => (
              <TableRow key={l.name}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-muted-foreground">{l.duration}</TableCell>
                <TableCell className="text-muted-foreground">{l.fee}</TableCell>
                <TableCell className="text-muted-foreground">{l.batch}</TableCell>
                <TableCell className="text-muted-foreground">{l.mode}</TableCell>
                <TableCell className="text-muted-foreground">{l.type}</TableCell>
                <TableCell className="text-xs"><a href="#" className="text-primary hover:underline">Edit</a> &middot; <button className="text-destructive hover:underline">Del</button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
        <Button variant="outline" size="sm" className="mt-3">+ Add Level</Button>
      </CardContent>
    </Card>
  );
}
