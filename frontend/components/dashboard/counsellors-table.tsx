"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CrudActions } from "@/components/dashboard/crud-actions";
import { staff as staffData } from "@/lib/dummy-data";

const roleColors: Record<string, string> = {
  Teacher: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Counsellor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Branch Admin": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export function StaffTable() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Branch</TableHead>
              <TableHead>Role</TableHead><TableHead>Courses</TableHead><TableHead>Sessions</TableHead>
              <TableHead>Status</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffData.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-semibold">{s.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{s.email}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{s.branch}</TableCell>
                <TableCell><Badge variant="outline" className={`text-[10px] ${roleColors[s.role] || ""}`}>{s.role}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs max-w-[150px] truncate">{s.courses}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{s.sessions}</TableCell>
                <TableCell><Badge variant={s.active ? "default" : "secondary"}>{s.active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell><CrudActions data={s} label="staff" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
      </CardContent>
    </Card>
  );
}

export { StaffTable as CounsellorsTable };
