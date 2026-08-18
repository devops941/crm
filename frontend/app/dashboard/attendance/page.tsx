"use client";

import { useState } from "react";
import { Search, MapPin, Clock, UserCheck, UserX, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusColors: Record<string, string> = {
  Present: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
  Absent: "text-red-500 border-red-500/20 bg-red-500/10",
  Late: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
  "Half-day": "text-orange-500 border-orange-500/20 bg-orange-500/10",
  "Not Marked": "text-muted-foreground",
};

const batchConfig = [
  { name: "Morning", time: "09:00 AM — 12:30 PM" },
  { name: "Evening", time: "02:00 PM — 06:00 PM" },
  { name: "Weekend", time: "10:00 AM — 04:00 PM" },
];

// All students in each batch (for Take Attendance tab)
const batchStudents: Record<string, { id: string; name: string; course: string; day: number; status: string }[]> = {
  Morning: [
    { id: "s1", name: "Student 1", course: "Full Stack Developer", day: 45, status: "Not Marked" },
    { id: "s2", name: "Student 2", course: "Full Stack Developer", day: 45, status: "Not Marked" },
    { id: "s3", name: "Student 3", course: "Data Science", day: 12, status: "Not Marked" },
    { id: "s4", name: "Student 4", course: "UI/UX Design", day: 30, status: "Not Marked" },
    { id: "s5", name: "Student 5", course: "Full Stack Developer", day: 22, status: "Not Marked" },
  ],
  Evening: [
    { id: "s6", name: "Student 6", course: "Cloud & DevOps", day: 30, status: "Not Marked" },
    { id: "s7", name: "Student 7", course: "Data Science", day: 78, status: "Not Marked" },
    { id: "s8", name: "Student 8", course: "Digital Marketing", day: 15, status: "Not Marked" },
  ],
  Weekend: [
    { id: "s9", name: "Student 9", course: "Machine Learning", day: 10, status: "Not Marked" },
    { id: "s10", name: "Student 10", course: "Frontend Developer", day: 5, status: "Not Marked" },
  ],
};

// Report records (for Reports tab)
const reportRecords = [
  { student: "Student 1", course: "Full Stack Developer", batch: "Morning", date: "2024-10-15", day: 45, checkIn: "09:15", checkOut: "12:30", distance: "45m", status: "Present" },
  { student: "Student 2", course: "Full Stack Developer", batch: "Morning", date: "2024-10-15", day: 45, checkIn: "09:45", checkOut: "12:20", distance: "32m", status: "Late" },
  { student: "Student 3", course: "Data Science", batch: "Morning", date: "2024-10-15", day: 12, checkIn: "—", checkOut: "—", distance: "—", status: "Absent" },
  { student: "Student 6", course: "Cloud & DevOps", batch: "Evening", date: "2024-10-15", day: 30, checkIn: "14:00", checkOut: "18:00", distance: "28m", status: "Present" },
  { student: "Student 7", course: "Data Science", batch: "Evening", date: "2024-10-15", day: 78, checkIn: "14:10", checkOut: "17:45", distance: "55m", status: "Present" },
];

export default function AttendancePage() {
  const [selectedBatch, setSelectedBatch] = useState("Morning");
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  const currentBatch = batchConfig.find((b) => b.name === selectedBatch)!;
  const students = batchStudents[selectedBatch] || [];
  const filteredReports = reportRecords.filter((r) => r.batch === selectedBatch);

  const getStatus = (id: string) => attendance[id] || "Not Marked";
  const markStudent = (id: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [id]: prev[id] === status ? "Not Marked" : status }));
  };

  const markedCount = students.filter((s) => getStatus(s.id) !== "Not Marked").length;
  const presentCount = students.filter((s) => getStatus(s.id) === "Present").length;
  const absentCount = students.filter((s) => getStatus(s.id) === "Absent").length;

  const markAllPresent = () => {
    const all: Record<string, string> = { ...attendance };
    students.forEach((s) => { all[s.id] = "Present"; });
    setAttendance(all);
  };

  const markAllAbsent = () => {
    const all: Record<string, string> = { ...attendance };
    students.forEach((s) => { all[s.id] = "Absent"; });
    setAttendance(all);
  };

  const resetAll = () => {
    const all: Record<string, string> = { ...attendance };
    students.forEach((s) => { delete all[s.id]; });
    setAttendance(all);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Attendance</h1>
          <Badge variant="secondary">GEO-FENCED</Badge>
        </div>
      </div>

      {/* Batch Tabs */}
      <div className="flex flex-wrap gap-2">
        {batchConfig.map((batch) => (
          <button
            key={batch.name}
            onClick={() => setSelectedBatch(batch.name)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              selectedBatch === batch.name
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span>{batch.name}</span>
            <span className="block text-[10px] opacity-70 font-normal">{batch.time}</span>
          </button>
        ))}
      </div>

      {/* Main Tabs: Take Attendance / Reports */}
      <Tabs defaultValue="take">
        <TabsList>
          <TabsTrigger value="take" className="text-xs">Take Attendance</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
        </TabsList>

        {/* ═══ TAB 1: TAKE ATTENDANCE ═══ */}
        <TabsContent value="take" className="mt-4 space-y-4">
          {/* Batch Info */}
          <Card>
            <CardContent className="pt-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">{selectedBatch} Batch — {currentBatch.time}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{students.length} students &bull; {markedCount} marked &bull; {students.length - markedCount} pending</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={markAllPresent}>All Present</Button>
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={markAllAbsent}>All Absent</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7" onClick={resetAll}>Reset</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-t-4 border-t-emerald-500"><CardContent className="pt-3 pb-3 text-center"><div className="text-xl font-bold text-emerald-600">{presentCount}</div><div className="text-[10px] text-muted-foreground">Present</div></CardContent></Card>
            <Card className="border-t-4 border-t-red-500"><CardContent className="pt-3 pb-3 text-center"><div className="text-xl font-bold text-red-600">{absentCount}</div><div className="text-[10px] text-muted-foreground">Absent</div></CardContent></Card>
            <Card className="border-t-4 border-t-muted"><CardContent className="pt-3 pb-3 text-center"><div className="text-xl font-bold">{students.length - markedCount}</div><div className="text-[10px] text-muted-foreground">Not Marked</div></CardContent></Card>
          </div>

          {/* Student List — Mark Attendance */}
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto"><Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Mark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s, i) => {
                    const status = getStatus(s.id);
                    return (
                      <TableRow key={s.id} className={status === "Present" ? "bg-emerald-500/5" : status === "Absent" ? "bg-red-500/5" : ""}>
                        <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="font-semibold">{s.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{s.course}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px] font-mono">Day {s.day}</Badge></TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusColors[status]}`}>{status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => markStudent(s.id, "Present")}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                status === "Present"
                                  ? "bg-emerald-500 text-white"
                                  : "border hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500"
                              }`}
                              title="Present"
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => markStudent(s.id, "Absent")}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                status === "Absent"
                                  ? "bg-red-500 text-white"
                                  : "border hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                              }`}
                              title="Absent"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => markStudent(s.id, "Late")}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                status === "Late"
                                  ? "bg-yellow-500 text-white"
                                  : "border hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-500"
                              }`}
                              title="Late"
                            >
                              <AlertTriangle className="h-5 w-5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table></div>
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{markedCount}/{students.length} students marked</p>
            <Button disabled={markedCount === 0} className="px-8">
              Save Attendance ({markedCount}/{students.length})
            </Button>
          </div>
        </TabsContent>

        {/* ═══ TAB 2: REPORTS ═══ */}
        <TabsContent value="reports" className="mt-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-t-4 border-t-emerald-500"><CardContent className="pt-4 flex items-center gap-3"><UserCheck className="h-5 w-5 text-emerald-500" /><div><div className="text-2xl font-bold">{filteredReports.filter((r) => r.status === "Present").length}</div><div className="text-[10px] text-muted-foreground">Present</div></div></CardContent></Card>
            <Card className="border-t-4 border-t-red-500"><CardContent className="pt-4 flex items-center gap-3"><UserX className="h-5 w-5 text-red-500" /><div><div className="text-2xl font-bold">{filteredReports.filter((r) => r.status === "Absent").length}</div><div className="text-[10px] text-muted-foreground">Absent</div></div></CardContent></Card>
            <Card className="border-t-4 border-t-yellow-500"><CardContent className="pt-4 flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-yellow-500" /><div><div className="text-2xl font-bold">{filteredReports.filter((r) => r.status === "Late" || r.status === "Half-day").length}</div><div className="text-[10px] text-muted-foreground">Late/Half</div></div></CardContent></Card>
            <Card className="border-t-4 border-t-blue-500"><CardContent className="pt-4"><div className="text-2xl font-bold">{filteredReports.length > 0 ? Math.round((filteredReports.filter((r) => r.status === "Present").length / filteredReports.length) * 100) : 0}%</div><div className="text-[10px] text-muted-foreground">Rate</div></CardContent></Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 items-center">
                <Input type="date" defaultValue="2024-10-15" className="w-[160px]" />
                <Select><SelectTrigger className="w-[160px]"><SelectValue placeholder="All Branches" /></SelectTrigger><SelectContent><SelectItem value="all">All Branches</SelectItem></SelectContent></Select>
                <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="present">Present</SelectItem><SelectItem value="absent">Absent</SelectItem><SelectItem value="late">Late</SelectItem></SelectContent></Select>
                <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" /></div>
              </div>
            </CardContent>
          </Card>

          {/* Report Table */}
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto"><Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead><TableHead>Course</TableHead><TableHead>Day</TableHead>
                    <TableHead>Check-In</TableHead><TableHead>Check-Out</TableHead><TableHead>Distance</TableHead><TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No records</TableCell></TableRow>
                  ) : filteredReports.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{r.student}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{r.course}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] font-mono">Day {r.day}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />{r.checkIn}</TableCell>
                      <TableCell className="text-xs text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />{r.checkOut}</TableCell>
                      <TableCell className="text-xs text-muted-foreground"><MapPin className="h-3 w-3 inline mr-1" />{r.distance}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${statusColors[r.status]}`}>{r.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
