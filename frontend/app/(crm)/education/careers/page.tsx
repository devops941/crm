"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { getCareerPaths, getCourses } from "@/lib/api";
import type { CareerPath, Course } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUpIcon, BookOpenIcon } from "lucide-react";

function DemandBadge({ demand }: { demand: string }) {
  const colorMap: Record<string, string> = {
    "Very High": "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30",
    High: "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
    Medium: "border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
    Low: "border-border text-muted-foreground bg-muted/40",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorMap[demand] ?? colorMap.Low}`}
    >
      {demand}
    </span>
  );
}

function CareerPathCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3 w-full mt-1" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CareerPathsPage() {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCareerPaths(), getCourses()])
      .then(([paths, courseRes]) => {
        setCareerPaths(paths);
        setCourses(courseRes.data);
      })
      .catch((err) => console.error("Failed to load career paths:", err))
      .finally(() => setLoading(false));
  }, []);

  function getLinkedCourses(careerPath: CareerPath): Course[] {
    return courses.filter((c) => careerPath.course_ids?.includes(c._id));
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career Paths</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Guided learning journeys mapped to industry outcomes
        </p>
      </div>

      {/* Summary bar */}
      {!loading && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{careerPaths.length}</span> career paths
          <span className="text-border">·</span>
          <span className="font-medium text-foreground">
            {careerPaths.reduce((acc, cp) => acc + cp.roles.length, 0)}
          </span>{" "}
          total roles
        </div>
      )}

      {/* Card grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CareerPathCardSkeleton key={i} />)
          : careerPaths.length === 0
          ? (
            <div className="col-span-full py-16 text-center text-muted-foreground text-sm">
              No career paths defined yet.
            </div>
          )
          : careerPaths.map((cp) => {
              const linked = getLinkedCourses(cp);
              return (
                <Card key={cp._id}>
                  <CardHeader className="pb-3 border-b border-border">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold">{cp.name}</CardTitle>
                        {cp.description && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {cp.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Linked courses */}
                    {linked.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <BookOpenIcon className="size-3 text-muted-foreground shrink-0" />
                        {linked.map((c) => (
                          <span
                            key={c._id}
                            className="inline-flex items-center rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {linked.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        No courses linked
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="p-0">
                    {cp.roles.length === 0 ? (
                      <p className="px-4 py-4 text-xs text-muted-foreground">No roles defined.</p>
                    ) : (
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
                              <TableCell className="font-medium text-sm">
                                {role.title}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-xs">
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
                    )}
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
