"use client";

import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const sessions = [
  { student: "—", counsellor: "—", branch: "—", course: "—", status: "Active", date: "—" },
  { student: "—", counsellor: "—", branch: "—", course: "—", status: "Active", date: "—" },
  { student: "—", counsellor: "—", branch: "—", course: "—", status: "Completed", date: "—" },
  { student: "—", counsellor: "—", branch: "—", course: "—", status: "Completed", date: "—" },
];

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Counselling Sessions</h1>
        <Badge variant="secondary">CRM</Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Select>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Branches" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Branches</SelectItem></SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Counsellors" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Counsellors</SelectItem></SelectContent>
            </Select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search sessions..." className="pl-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead><TableHead>Counsellor</TableHead><TableHead>Branch</TableHead>
                <TableHead>Course Selected</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="font-semibold">{s.student}</TableCell>
                  <TableCell className="text-muted-foreground">{s.counsellor}</TableCell>
                  <TableCell className="text-muted-foreground">{s.branch}</TableCell>
                  <TableCell className="text-muted-foreground">{s.course}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Active" ? "default" : "secondary"}>{s.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.date}</TableCell>
                  <TableCell className="text-xs"><a href="#" className="text-primary hover:underline">View Details</a></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        </CardContent>
      </Card>

     
    </div>
  );
}
