"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CrudActions } from "@/components/dashboard/crud-actions";
import { branches } from "@/lib/dummy-data";

export function BranchesTable() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch</TableHead><TableHead>Location</TableHead><TableHead>GPS / Radius</TableHead>
              <TableHead>Admin</TableHead><TableHead>Staff</TableHead><TableHead>Students</TableHead>
              <TableHead>Status</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-semibold">{b.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{b.location}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{b.lat}, {b.lng}</div>
                  <span className="text-[10px]">Radius: {b.radius}</span>
                </TableCell>
                <TableCell className={b.admin === "—" ? "text-muted-foreground italic text-xs" : "text-muted-foreground text-xs"}>{b.admin}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{b.staff}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{b.students}</TableCell>
                <TableCell><Badge variant={b.active ? "default" : "secondary"}>{b.active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell><CrudActions data={b} label="branch" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
      </CardContent>
    </Card>
  );
}
