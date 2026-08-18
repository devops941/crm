"use client";

import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CrudActions } from "@/components/dashboard/crud-actions";
import { students } from "@/lib/dummy-data";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Dropped: "bg-red-500/10 text-red-500 border-red-500/20",
  "Not Enrolled": "bg-muted text-muted-foreground",
};

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Students</h1>
          <Badge variant="secondary">{students.length} total</Badge>
        </div>
        <Link href="/dashboard/students/create"><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Create Student</Button></Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem><SelectItem value="chennai">Chennai Main</SelectItem><SelectItem value="bangalore">Bangalore</SelectItem><SelectItem value="mumbai">Mumbai</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="dropped">Dropped</SelectItem><SelectItem value="not_enrolled">Not Enrolled</SelectItem></SelectContent></Select>
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students..." className="pl-9" /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Mobile</TableHead>
                <TableHead>Qualification</TableHead><TableHead>Course</TableHead><TableHead>Branch</TableHead>
                <TableHead>Status</TableHead><TableHead>Last Active</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-semibold">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.email}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.mobile}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.qualification}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.enrollment}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.branch}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${statusColors[s.status]}`}>{s.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{s.lastActive}</TableCell>
                  <TableCell><CrudActions data={s} label="student" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Showing 1-{students.length} of {students.length}</span>
            <Pagination><PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent></Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
