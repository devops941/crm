"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoursesFilter } from "@/components/dashboard/courses-filter";
import { CoursesTable } from "@/components/dashboard/courses-table";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Courses</h1>
          <Badge variant="secondary">CMS</Badge>
        </div>
        <Link href="/dashboard/courses/editor">
          <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Course</Button>
        </Link>
      </div>

      <CoursesFilter />
      <CoursesTable />

      
    </div>
  );
}
