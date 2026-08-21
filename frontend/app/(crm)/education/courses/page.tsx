"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourses, getCourseCategories } from "@/lib/api";
import type { Course, CourseCategory } from "@/lib/types";
import { StatusBadge } from "@/components/crm/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SearchIcon, LayersIcon, ClockIcon, IndianRupeeIcon, Plus } from "lucide-react";

function CourseCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    Promise.all([getCourses(), getCourseCategories()])
      .then(([courseRes, cats]) => {
        setCourses(courseRes.data);
        setCategories(cats);
      })
      .catch((err) => console.error("Failed to load courses:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter((c) => {
    const matchesSearch =
      !search || c.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || c.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function formatFeeRange(course: Course) {
    if (!course.levels?.length) return null;
    const fees = course.levels.map((l) => l.fee).filter(Boolean);
    if (fees.length === 0) return null;
    const min = Math.min(...fees);
    const max = Math.max(...fees);
    if (min === max) return `₹${min.toLocaleString("en-IN")}`;
    return `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")}`;
  }

  function formatDuration(course: Course) {
    if (!course.levels?.length) return null;
    const days = course.levels.map((l) => l.duration_days).filter(Boolean);
    if (days.length === 0) return null;
    const min = Math.min(...days);
    const max = Math.max(...days);
    if (min === max) return `${min} days`;
    return `${min}–${max} days`;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Catalog</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All courses across verticals and delivery modes
          </p>
        </div>
        <Button className="gap-1.5" onClick={() => console.log("New Course — form coming soon")}>
          <Plus className="size-4" /> New Course
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Category Filter Chips */}
      {!loading && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                selectedCategory === cat._id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
              {cat.course_count !== undefined && (
                <span className="opacity-60">({cat.course_count})</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
          : filtered.length === 0
          ? (
            <div className="col-span-full py-16 text-center text-muted-foreground text-sm">
              No courses match your search or filter.
            </div>
          )
          : filtered.map((course) => {
              const feeRange = formatFeeRange(course);
              const duration = formatDuration(course);
              const catName =
                categories.find((c) => c._id === course.category_id)?.name ??
                course.category_name;

              return (
                <Card
                  key={course._id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/education/courses/${course._id}`)}
                >
                  <CardContent className="p-4 flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-snug flex-1">
                        {course.name}
                      </h3>
                      <StatusBadge status={course.status} size="sm" />
                    </div>

                    {/* Category badge */}
                    {catName && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 w-fit">
                        {catName}
                      </Badge>
                    )}

                    {/* Description */}
                    {course.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border">
                      {course.levels?.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <LayersIcon className="size-3" />
                          {course.levels.length} level{course.levels.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {duration && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ClockIcon className="size-3" />
                          {duration}
                        </span>
                      )}
                      {feeRange && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground ml-auto">
                          <IndianRupeeIcon className="size-3" />
                          {feeRange.replace("₹", "")}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
