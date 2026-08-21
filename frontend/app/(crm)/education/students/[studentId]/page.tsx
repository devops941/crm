"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getStudent, getEnrollments } from "@/lib/api";
import type { StudentProfile, Enrollment } from "@/lib/types";
import type { Person } from "@/lib/types";
import { RecordHeader } from "@/components/crm/record-header";
import { RecordTabs } from "@/components/crm/record-tabs";
import { KpiCard } from "@/components/crm/kpi-card";
import { StatusBadge } from "@/components/crm/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  FlameIcon,
  StarIcon,
  BookOpenIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GraduationCapIcon,
  BriefcaseIcon,
} from "lucide-react";

type StudentWithPerson = StudentProfile & { person?: Person };

const TABS = [
  { id: "progress", label: "Progress" },
  { id: "personal", label: "Personal Info" },
  { id: "attendance", label: "Attendance" },
  { id: "payments", label: "Payments" },
  { id: "certifications", label: "Certifications" },
  { id: "placement", label: "Placement" },
];

function StudentSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Skeleton className="size-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="py-16 text-center text-muted-foreground text-sm">
        {label} — coming soon
      </CardContent>
    </Card>
  );
}

function ProgressTab({ student }: { student: StudentWithPerson }) {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Attendance Rate"
          value="92%"
          icon={CalendarIcon}
          delta={{ value: "+2% this week", positive: true }}
        />
        <KpiCard
          label="Learning Streak"
          value="14 days"
          icon={FlameIcon}
          delta={{ value: "Personal best!", positive: true }}
        />
        <KpiCard
          label="Avg Rating"
          value="4.3 / 5"
          icon={StarIcon}
          subtitle="Based on 34 sessions"
        />
        <KpiCard
          label="Topics Completed"
          value="34 / 48"
          icon={BookOpenIcon}
          subtitle="70.8% of curriculum"
        />
      </div>

      {/* Today's Activity */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">Today&apos;s Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Session completed — Day 34</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Topics: React Hooks, State Management · Assignment submitted
                </p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">9:30 AM</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Attendance marked — Present</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Check-in at 9:15 AM · Morning batch
                </p>
              </div>
              <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">9:15 AM</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Progress */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">Enrollment Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Full-Stack Web Development</span>
              <StatusBadge status="active" size="sm" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: "70.8%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">34 / 48 days</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Started{" "}
              {new Date(
                Date.now() - 34 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              {" "}· Estimated completion in 14 days
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonalInfoTab({ student }: { student: StudentWithPerson }) {
  const person = student.person;
  const academic = student.academic_details;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Contact Details */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3">
          {person?.primary_email && (
            <div className="flex items-center gap-2 text-sm">
              <MailIcon className="size-3.5 text-muted-foreground shrink-0" />
              <span>{person.primary_email}</span>
            </div>
          )}
          {person?.primary_phone && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="size-3.5 text-muted-foreground shrink-0" />
              <span>{person.primary_phone}</span>
            </div>
          )}
          {person?.current_location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPinIcon className="size-3.5 text-muted-foreground shrink-0" />
              <span>
                {[
                  person.current_location.city,
                  person.current_location.district,
                  person.current_location.state,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
          {!person?.primary_email && !person?.primary_phone && (
            <p className="text-sm text-muted-foreground">No contact details on record.</p>
          )}
        </CardContent>
      </Card>

      {/* Academic Background */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">Academic Background</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3">
          {academic.qualification && (
            <div className="flex items-start gap-2 text-sm">
              <GraduationCapIcon className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">{academic.qualification}</span>
                {academic.institution && (
                  <p className="text-xs text-muted-foreground mt-0.5">{academic.institution}</p>
                )}
              </div>
            </div>
          )}
          {academic.career_goal && (
            <div className="flex items-start gap-2 text-sm">
              <BriefcaseIcon className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Career Goal</p>
                <span>{academic.career_goal}</span>
              </div>
            </div>
          )}
          {academic.interests.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Interests</p>
              <div className="flex flex-wrap gap-1">
                {academic.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {academic.preferred_duration && (
            <p className="text-xs text-muted-foreground">
              Preferred duration: {academic.preferred_duration}
            </p>
          )}
          {academic.hours_per_week && (
            <p className="text-xs text-muted-foreground">
              Available: {academic.hours_per_week}h/week
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();

  const [student, setStudent] = useState<StudentWithPerson | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("progress");

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getStudent(studentId),
      getEnrollments({ student_id: studentId }),
    ])
      .then(([s, enrollRes]) => {
        if (cancelled) return;
        if (!s) {
          setError("Student not found.");
          return;
        }
        setStudent(s);
        setEnrollments(enrollRes.data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load student:", err);
          setError("Failed to load student. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [studentId]);

  if (loading) return <StudentSkeleton />;

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <p className="text-muted-foreground">{error ?? "Student not found."}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const academic = student.academic_details;
  const interestBadges = (academic.interests ?? []).map((i) => ({
    label: i,
    variant: "outline" as const,
  }));

  const subtitle = academic.qualification
    ? `${academic.qualification}${academic.institution ? ` · ${academic.institution}` : ""}`
    : undefined;

  return (
    <div className="flex flex-col gap-6 p-6">
      <RecordHeader
        title={student.person?.full_name ?? "Unknown Student"}
        subtitle={subtitle}
        badges={interestBadges}
        backHref="/education/students"
      />

      <RecordTabs
        tabs={TABS.map((t) => ({
          ...t,
          count: t.id === "attendance" ? enrollments.length : undefined,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-2">
        {activeTab === "progress" && <ProgressTab student={student} />}
        {activeTab === "personal" && <PersonalInfoTab student={student} />}
        {activeTab === "attendance" && <PlaceholderTab label="Attendance Records" />}
        {activeTab === "payments" && <PlaceholderTab label="Payment History" />}
        {activeTab === "certifications" && <PlaceholderTab label="Certifications" />}
        {activeTab === "placement" && <PlaceholderTab label="Placement Records" />}
      </div>
    </div>
  );
}
