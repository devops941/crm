"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { getEnrollments, getStudents } from "@/lib/api";
import type { Enrollment, StudentProfile } from "@/lib/types";
import type { Person } from "@/lib/types";
import { KpiCard } from "@/components/crm/kpi-card";
import { StatusBadge } from "@/components/crm/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Inline mini progress bars — plain divs, no Base UI Root needed
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCapIcon,
  BarChart3Icon,
  StarIcon,
  BookOpenIcon,
} from "lucide-react";

type StudentRow = StudentProfile & { person?: Person };

interface ProgressRow {
  studentId: string;
  name: string;
  course: string;
  currentDay: number;
  totalDays: number;
  completionPct: number;
  attendancePct: number;
  avgRating: number;
  status: string;
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={
            i < Math.round(value)
              ? "size-3 fill-amber-400 text-amber-400"
              : "size-3 text-border"
          }
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">{value.toFixed(1)}</span>
    </span>
  );
}

function ProgressSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

// Mock progress data — will be replaced by real API when available
function buildProgressRows(
  enrollments: Enrollment[],
  students: StudentRow[]
): ProgressRow[] {
  return enrollments.map((enroll) => {
    const student = students.find((s) => s._id === enroll.student_id);
    const currentDay = enroll.current_day ?? 0;
    const totalDays = enroll.total_days ?? 1;
    const completionPct = Math.min(100, Math.round((currentDay / totalDays) * 100));

    return {
      studentId: enroll.student_id,
      name: enroll.student_name ?? student?.person?.full_name ?? "Unknown",
      course: enroll.course_name ?? "—",
      currentDay,
      totalDays,
      completionPct,
      attendancePct: Math.floor(75 + Math.random() * 25), // mock
      avgRating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)), // mock
      status: enroll.status,
    };
  });
}

export default function LearningProgressPage() {
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEnrollments({ status: "active" }), getStudents()])
      .then(([enrollRes, studentRes]) => {
        const rows = buildProgressRows(enrollRes.data, studentRes.data as StudentRow[]);
        setProgressRows(rows);
      })
      .catch((err) => console.error("Failed to load progress data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ProgressSkeleton />;

  const activeCount = progressRows.filter((r) => r.status === "active").length;
  const avgCompletion =
    progressRows.length > 0
      ? Math.round(
          progressRows.reduce((sum, r) => sum + r.completionPct, 0) / progressRows.length
        )
      : 0;
  const avgRating =
    progressRows.length > 0
      ? parseFloat(
          (
            progressRows.reduce((sum, r) => sum + r.avgRating, 0) / progressRows.length
          ).toFixed(1)
        )
      : 0;

  // Mock "topics today" count
  const topicsToday = 14;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Completion rates, ratings, and learner outcomes
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Active Enrollments"
          value={activeCount}
          icon={GraduationCapIcon}
          subtitle="Currently in training"
        />
        <KpiCard
          label="Avg Completion Rate"
          value={`${avgCompletion}%`}
          icon={BarChart3Icon}
          delta={{ value: "+3% vs last month", positive: true }}
        />
        <KpiCard
          label="Avg Rating"
          value={`${avgRating} / 5`}
          icon={StarIcon}
          subtitle="Across all active sessions"
        />
        <KpiCard
          label="Topics Today"
          value={topicsToday}
          icon={BookOpenIcon}
          subtitle="Completed across all students"
        />
      </div>

      {/* Progress Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">
            Student Progress — {progressRows.length} records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {progressRows.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground">
              No active enrollments found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Course
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Day
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground min-w-[120px]">
                      Completion
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground min-w-[100px]">
                      Attendance
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Avg Rating
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {progressRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[160px] truncate">
                        {row.course}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {row.currentDay} / {row.totalDays}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${row.completionPct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {row.completionPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${row.attendancePct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {row.attendancePct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StarRating value={row.avgRating} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
