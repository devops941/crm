"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getCourse, getCareerPaths } from "@/lib/api";
import type { Course, CareerPath } from "@/lib/types";
import { RecordHeader } from "@/components/crm/record-header";
import { RecordTabs } from "@/components/crm/record-tabs";
import { StatusBadge } from "@/components/crm/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUpIcon, UsersIcon, ClockIcon } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "syllabus", label: "Syllabus" },
  { id: "levels", label: "Levels" },
  { id: "certifications", label: "Certifications" },
  { id: "career", label: "Career Linkage" },
];

function CourseSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Skeleton className="size-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function DemandBadge({ demand }: { demand: string }) {
  const colorMap: Record<string, string> = {
    "Very High": "border-green-500 text-green-700 dark:text-green-400",
    High: "border-blue-500 text-blue-700 dark:text-blue-400",
    Medium: "border-amber-500 text-amber-700 dark:text-amber-400",
    Low: "border-border text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorMap[demand] ?? colorMap.Low}`}
    >
      {demand}
    </span>
  );
}

function OverviewTab({ course }: { course: Course }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">About this Course</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-4">
          {course.description ? (
            <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No description provided.</p>
          )}
          {course.prerequisites && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Prerequisites</p>
              <p className="text-sm text-muted-foreground">{course.prerequisites}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-foreground">Status</p>
            <StatusBadge status={course.status} size="sm" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SyllabusTab({ course }: { course: Course }) {
  const syllabus = course.daily_syllabus ?? [];

  if (syllabus.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground text-sm">
          No syllabus defined for this course yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-sm font-semibold">
          Daily Syllabus — {syllabus.length} days
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Accordion className="w-full">
          {syllabus.map((day) => (
            <AccordionItem key={day.day} value={`day-${day.day}`}>
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center size-6 rounded bg-primary/10 text-primary text-xs font-bold shrink-0">
                    {day.day}
                  </span>
                  {day.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="flex flex-col gap-3 pl-8">
                  {day.topics.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1.5">Topics</p>
                      <ul className="flex flex-col gap-1.5">
                        {day.topics.map((topic, ti) => (
                          <li key={ti} className="flex flex-col gap-0.5">
                            <span className="text-sm">{topic.name}</span>
                            {topic.objectives && (
                              <span className="text-xs text-muted-foreground">
                                {topic.objectives}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {day.assignment && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Assignment</p>
                      <p className="text-sm text-muted-foreground">{day.assignment}</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function LevelsTab({ course }: { course: Course }) {
  const levels = course.levels ?? [];

  if (levels.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground text-sm">
          No levels defined for this course.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-sm font-semibold">Course Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Level</TableHead>
              <TableHead>
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="size-3" /> Duration
                </span>
              </TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>
                <span className="inline-flex items-center gap-1">
                  <UsersIcon className="size-3" /> Max Batch
                </span>
              </TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Batch Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map((lvl, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{lvl.level_name}</TableCell>
                <TableCell>{lvl.duration_days} days</TableCell>
                <TableCell>₹{lvl.fee.toLocaleString("en-IN")}</TableCell>
                <TableCell>{lvl.batch_size_max}</TableCell>
                <TableCell className="capitalize">{lvl.mode}</TableCell>
                <TableCell className="capitalize">{lvl.batch_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CertificationsTab({ course }: { course: Course }) {
  const certs = course.certifications ?? [];

  if (certs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground text-sm">
          No certifications linked to this course.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="text-sm font-semibold">Certifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {certs.map((cert, i) => (
            <li key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary text-sm font-bold">
                  {cert.name.slice(0, 1).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{cert.name}</p>
                <p className="text-xs text-muted-foreground">{cert.provider}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CareerTab({
  course,
  careerPaths,
}: {
  course: Course;
  careerPaths: CareerPath[];
}) {
  const linked = careerPaths.filter((cp) =>
    course.career_path_ids?.includes(cp._id)
  );

  if (linked.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground text-sm">
          No career paths linked to this course.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {linked.map((cp) => (
        <Card key={cp._id}>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold">{cp.name}</CardTitle>
            {cp.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{cp.description}</p>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <span className="inline-flex items-center gap-1">
                      <TrendingUpIcon className="size-3" /> Salary Range
                    </span>
                  </TableHead>
                  <TableHead>Demand</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cp.roles.map((role, ri) => (
                  <TableRow key={ri}>
                    <TableCell className="font-medium">{role.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      ₹{role.salary_min.toLocaleString("en-IN")} –{" "}
                      ₹{role.salary_max.toLocaleString("en-IN")} / yr
                    </TableCell>
                    <TableCell>
                      <DemandBadge demand={role.demand} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setLoading(true);

    Promise.all([getCourse(courseId), getCareerPaths()])
      .then(([c, cps]) => {
        if (cancelled) return;
        if (!c) {
          setError("Course not found.");
          return;
        }
        setCourse(c);
        setCareerPaths(cps);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load course:", err);
          setError("Failed to load course. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [courseId]);

  if (loading) return <CourseSkeleton />;

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <p className="text-muted-foreground">{error ?? "Course not found."}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const syllabusCount = course.daily_syllabus?.length ?? 0;
  const certCount = course.certifications?.length ?? 0;
  const careerCount = (course.career_path_ids ?? []).filter((id) =>
    careerPaths.some((cp) => cp._id === id)
  ).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <RecordHeader
        title={course.name}
        subtitle={course.category_name ?? undefined}
        badges={[
          { label: course.status === "published" ? "Published" : "Draft", variant: "outline" },
        ]}
        backHref="/education/courses"
      />

      <RecordTabs
        tabs={TABS.map((t) => ({
          ...t,
          count:
            t.id === "syllabus"
              ? syllabusCount
              : t.id === "levels"
              ? course.levels?.length
              : t.id === "certifications"
              ? certCount
              : t.id === "career"
              ? careerCount
              : undefined,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-2">
        {activeTab === "overview" && <OverviewTab course={course} />}
        {activeTab === "syllabus" && <SyllabusTab course={course} />}
        {activeTab === "levels" && <LevelsTab course={course} />}
        {activeTab === "certifications" && <CertificationsTab course={course} />}
        {activeTab === "career" && (
          <CareerTab course={course} careerPaths={careerPaths} />
        )}
      </div>
    </div>
  );
}
