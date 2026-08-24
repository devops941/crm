"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { getStudents, logAttendance } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  SaveIcon,
  CalendarIcon,
} from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | null;

interface StudentAttendance {
  studentId: string;
  name: string;
  email?: string;
  status: AttendanceStatus;
}

function AttendanceDot({ status }: { status: AttendanceStatus }) {
  if (!status) return <span className="size-2 rounded-full bg-border inline-block" />;
  const colorMap: Record<string, string> = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-amber-500",
  };
  return <span className={cn("size-2 rounded-full inline-block", colorMap[status])} />;
}

function TakeAttendanceTab() {
  const [batch, setBatch] = useState<string>("morning");
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    getStudents({ page: 1 })
      .then((res) => {
        setStudents(
          res.data.map((s) => ({
            studentId: s._id,
            name: s.person?.full_name ?? "Unknown",
            email: s.person?.primary_email ?? undefined,
            status: null,
          }))
        );
      })
      .catch((err) => console.error("Failed to load students:", err))
      .finally(() => setLoading(false));
  }, []);

  function markStatus(studentId: string, status: AttendanceStatus) {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, status: s.status === status ? null : status }
          : s
      )
    );
    setSaved(false);
  }

  function markAll(status: AttendanceStatus) {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
    setSaved(false);
  }

  const counts = {
    present: students.filter((s) => s.status === "present").length,
    absent: students.filter((s) => s.status === "absent").length,
    late: students.filter((s) => s.status === "late").length,
    unmarked: students.filter((s) => s.status === null).length,
  };

  async function handleSave() {
    setSaving(true);
    // Log each marked student's attendance via API
    const marked = students.filter((s) => s.status !== null);
    for (const s of marked) {
      await logAttendance({
        enrollment_id: s.studentId,
        student_id: s.studentId,
        branch_id: "br1",
        date: new Date().toISOString().split("T")[0],
        day_number: 0,
        status: s.status as "present" | "absent" | "late",
      });
    }
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Controls */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Batch:</span>
            <Select value={batch} onValueChange={(v) => v && setBatch(v)}>
              <SelectTrigger className="h-8 w-36 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => markAll("present")}
            >
              Mark All Present
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => markAll("absent")}
            >
              Mark All Absent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live counters */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Present", count: counts.present, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" },
          { label: "Absent", count: counts.absent, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" },
          { label: "Late", count: counts.late, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
          { label: "Unmarked", count: counts.unmarked, color: "text-muted-foreground", bg: "" },
        ].map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex flex-col items-center rounded-xl border p-3 text-center",
              item.bg || "border-border"
            )}
          >
            <span className={cn("text-2xl font-bold", item.color)}>{item.count}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Student list */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <UsersIcon className="size-4" />
              Students — {batch.charAt(0).toUpperCase() + batch.slice(1)} Batch
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {students.length} students
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 flex-1 max-w-xs" />
                  <div className="flex gap-1.5 ml-auto">
                    <Skeleton className="h-7 w-20 rounded-lg" />
                    <Skeleton className="h-7 w-20 rounded-lg" />
                    <Skeleton className="h-7 w-16 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {students.map((s) => (
                <li
                  key={s.studentId}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  {/* Status dot */}
                  <AttendanceDot status={s.status} />

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    {s.email && (
                      <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    )}
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => markStatus(s.studentId, "present")}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-colors",
                        s.status === "present"
                          ? "bg-green-100 dark:bg-green-950 border-green-500 text-green-700 dark:text-green-400"
                          : "border-border text-muted-foreground hover:border-green-500 hover:text-green-600"
                      )}
                    >
                      <CheckCircle2Icon className="size-3" />
                      Present
                    </button>
                    <button
                      onClick={() => markStatus(s.studentId, "absent")}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-colors",
                        s.status === "absent"
                          ? "bg-red-100 dark:bg-red-950 border-red-500 text-red-700 dark:text-red-400"
                          : "border-border text-muted-foreground hover:border-red-500 hover:text-red-600"
                      )}
                    >
                      <XCircleIcon className="size-3" />
                      Absent
                    </button>
                    <button
                      onClick={() => markStatus(s.studentId, "late")}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-colors",
                        s.status === "late"
                          ? "bg-amber-100 dark:bg-amber-950 border-amber-500 text-amber-700 dark:text-amber-400"
                          : "border-border text-muted-foreground hover:border-amber-500 hover:text-amber-600"
                      )}
                    >
                      <ClockIcon className="size-3" />
                      Late
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex items-center justify-between">
        {saved && (
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckCircle2Icon className="size-4" />
            Attendance saved successfully
          </p>
        )}
        <Button
          className="ml-auto gap-2"
          onClick={handleSave}
          disabled={saving || counts.unmarked === students.length}
        >
          <SaveIcon className="size-4" />
          {saving ? "Saving…" : "Save Attendance"}
        </Button>
      </div>
    </div>
  );
}

function ReportsTab() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Mock report data
  const reportRows = [
    { name: "Aditya Sharma", date: "2026-08-20", status: "present", batch: "Morning", day: 34 },
    { name: "Priya Nair", date: "2026-08-20", status: "present", batch: "Morning", day: 28 },
    { name: "Ravi Kumar", date: "2026-08-20", status: "late", batch: "Evening", day: 15 },
    { name: "Sneha Patel", date: "2026-08-20", status: "absent", batch: "Morning", day: 22 },
    { name: "Vikram Singh", date: "2026-08-20", status: "present", batch: "Evening", day: 41 },
    { name: "Meena Reddy", date: "2026-08-19", status: "present", batch: "Morning", day: 27 },
    { name: "Aditya Sharma", date: "2026-08-19", status: "present", batch: "Morning", day: 33 },
    { name: "Priya Nair", date: "2026-08-19", status: "late", batch: "Morning", day: 27 },
  ];

  const statusDotMap: Record<string, string> = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-amber-500",
    half_day: "bg-blue-500",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Date filter */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 text-sm w-36"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 text-sm w-36"
            />
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            Apply
          </Button>
        </CardContent>
      </Card>

      {/* Report table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Student</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Batch</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Day</th>
                <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium">{row.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {new Date(row.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground capitalize">{row.batch}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Day {row.day}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-2 rounded-full shrink-0",
                          statusDotMap[row.status] ?? "bg-border"
                        )}
                      />
                      <span className="capitalize text-xs">{row.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<"take" | "reports">("take");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Session-level attendance tracking per student and course
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-border gap-0">
        {[
          { id: "take", label: "Take Attendance" },
          { id: "reports", label: "Reports" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "take" | "reports")}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "take" && <TakeAttendanceTab />}
      {activeTab === "reports" && <ReportsTab />}
    </div>
  );
}
