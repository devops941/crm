"use client";

import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const students = [
  { name: "—", course: "—", day: 45, total: 180, topicsCompleted: 120, topicsTotal: 540, avgRating: 4.2, lastActive: "—" },
  { name: "—", course: "—", day: 12, total: 90, topicsCompleted: 28, topicsTotal: 270, avgRating: 3.8, lastActive: "—" },
  { name: "—", course: "—", day: 78, total: 180, topicsCompleted: 210, topicsTotal: 540, avgRating: 4.5, lastActive: "—" },
  { name: "—", course: "—", day: 270, total: 270, topicsCompleted: 810, topicsTotal: 810, avgRating: 4.7, lastActive: "—" },
];

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Progress Reports</h1>
        <Badge variant="secondary">TRACKING</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-t-4 border-t-blue-500"><CardContent className="pt-4"><div className="text-2xl font-bold">—</div><div className="text-xs text-muted-foreground">Active Enrollments</div></CardContent></Card>
        <Card className="border-t-4 border-t-emerald-500"><CardContent className="pt-4"><div className="text-2xl font-bold">— %</div><div className="text-xs text-muted-foreground">Avg Completion Rate</div></CardContent></Card>
        <Card className="border-t-4 border-t-yellow-500"><CardContent className="pt-4"><div className="text-2xl font-bold">— / 5</div><div className="text-xs text-muted-foreground">Avg Student Rating</div></CardContent></Card>
        <Card className="border-t-4 border-t-violet-500"><CardContent className="pt-4"><div className="text-2xl font-bold">—</div><div className="text-xs text-muted-foreground">Topics Completed Today</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="All Courses" /></SelectTrigger><SelectContent><SelectItem value="all">All Courses</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem></SelectContent></Select>
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students..." className="pl-9" /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead><TableHead>Course</TableHead><TableHead>Day Progress</TableHead>
                <TableHead>Topics</TableHead><TableHead>Avg Rating</TableHead><TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s, i) => {
                const dayPct = Math.round((s.day / s.total) * 100);
                const topicPct = Math.round((s.topicsCompleted / s.topicsTotal) * 100);
                return (
                  <TableRow key={i}>
                    <TableCell className="font-semibold">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.course}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <Progress value={dayPct} className="h-2 flex-1" />
                        <span className="text-[10px] text-muted-foreground w-20">Day {s.day}/{s.total}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <Progress value={topicPct} className="h-2 flex-1" />
                        <span className="text-[10px] text-muted-foreground w-16">{topicPct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{"⭐".repeat(Math.round(s.avgRating))} <span className="text-xs text-muted-foreground">{s.avgRating}</span></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{s.lastActive}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table></div>
        </CardContent>
      </Card>
    </div>
  );
}
