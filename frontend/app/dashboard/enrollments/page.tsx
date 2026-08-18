"use client";

import { useState } from "react";
import { Plus, Search, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CrudActions } from "@/components/dashboard/crud-actions";
import { enrollments } from "@/lib/dummy-data";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Dropped: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function EnrollmentsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Enrollments</h1>
          <Badge variant="secondary">{enrollments.length} total</Badge>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Enrollment</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="dropped">Dropped</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="All Courses" /></SelectTrigger><SelectContent><SelectItem value="all">All Courses</SelectItem></SelectContent></Select>
            <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search enrollments..." className="pl-9" /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead><TableHead>Course</TableHead><TableHead>Level</TableHead>
                <TableHead>Start</TableHead><TableHead>Progress</TableHead><TableHead>Batch</TableHead>
                <TableHead>Fee</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((e) => {
                const [current, total] = e.day.split("/").map(Number);
                const pct = Math.round((current / total) * 100);
                return (
                  <TableRow key={e.id}>
                    <TableCell className="font-semibold">{e.student}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{e.course}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{e.level}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{e.start}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={pct} className="h-2 flex-1" />
                        <span className="text-[10px] text-muted-foreground w-14">Day {e.day}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{e.batch}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {e.fee} {e.paid ? <Badge variant="outline" className="text-[9px] text-emerald-500 ml-1">Paid</Badge> : <Badge variant="outline" className="text-[9px] text-red-500 ml-1">Unpaid</Badge>}
                    </TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${statusColors[e.status]}`}>{e.status}</Badge></TableCell>
                    <TableCell><CrudActions data={e} label="enrollment" /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table></div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Enrollment</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Student</Label><Select><SelectTrigger><SelectValue placeholder="Select student..." /></SelectTrigger><SelectContent><SelectItem value="s1">Student 1</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Course</Label><Select><SelectTrigger><SelectValue placeholder="Select course..." /></SelectTrigger><SelectContent><SelectItem value="c1">Course 1</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Level</Label><Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="learner">Learner</SelectItem><SelectItem value="expert">Expert</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Batch</Label><Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="morning">Morning</SelectItem><SelectItem value="evening">Evening</SelectItem><SelectItem value="weekend">Weekend</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label><Calendar className="h-3.5 w-3.5 inline mr-1" />Start Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Branch</Label><Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="b1">Chennai Main</SelectItem><SelectItem value="b2">Bangalore</SelectItem><SelectItem value="b3">Mumbai</SelectItem></SelectContent></Select></div>
            </div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => setOpen(false)}>Create Enrollment</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
