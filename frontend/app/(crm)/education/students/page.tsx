"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getStudents, getCourses, createPerson } from "@/lib/api";
import type { StudentProfile, Course } from "@/lib/types";
import type { Person } from "@/lib/types";
import { DataTable } from "@/components/crm/data-table";
import { FilterBar } from "@/components/crm/filter-bar";
import { StatusBadge } from "@/components/crm/status-badge";
import { PersonForm } from "@/components/crm/person-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type StudentRow = StudentProfile & { person?: Person } & Record<string, unknown>;

const COLUMNS = [
  {
    key: "full_name",
    label: "Student Name",
    sortable: true,
    render: (row: StudentRow) => (
      <span className="font-semibold text-foreground">
        {row.person?.full_name ?? "—"}
      </span>
    ),
  },
  {
    key: "email",
    label: "Email",
    render: (row: StudentRow) => (
      <span className="text-sm text-muted-foreground">
        {row.person?.primary_email ?? "—"}
      </span>
    ),
  },
  {
    key: "phone",
    label: "Phone",
    render: (row: StudentRow) => (
      <span className="text-sm text-muted-foreground">
        {row.person?.primary_phone ?? "—"}
      </span>
    ),
  },
  {
    key: "qualification",
    label: "Qualification",
    render: (row: StudentRow) => (
      <span className="text-sm text-muted-foreground">
        {row.academic_details?.qualification ?? "—"}
      </span>
    ),
  },
  {
    key: "interests",
    label: "Interests",
    render: (row: StudentRow) => {
      const interests = row.academic_details?.interests ?? [];
      if (interests.length === 0)
        return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {interests.slice(0, 3).map((interest: string) => (
            <Badge key={interest} variant="secondary" className="text-[10px] px-1.5 py-0">
              {interest}
            </Badge>
          ))}
          {interests.length > 3 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              +{interests.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    key: "career_goal",
    label: "Career Goal",
    render: (row: StudentRow) => (
      <span className="text-sm text-muted-foreground">
        {row.academic_details?.career_goal ?? "—"}
      </span>
    ),
  },
];

export default function StudentsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [courseOptions, setCourseOptions] = useState<{ value: string; label: string }[]>([]);

  // Load filter options on mount
  useEffect(() => {
    getCourses().then((res) => {
      setCourseOptions(
        res.data.map((c: Course) => ({ value: c._id, label: c.name }))
      );
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStudents({ q: search || undefined, page });
      setRows(res.data as StudentRow[]);
      setTotalPages(res.meta.total_pages);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search, filters]);

  const FILTERS = [
    {
      id: "course",
      label: "Course",
      options: courseOptions,
    },
    {
      id: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
        { value: "completed", label: "Completed" },
        { value: "dropped", label: "Dropped" },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Student records across all programmes and cohorts
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
          <Plus className="size-4" /> New Student
        </Button>
      </div>

      <FilterBar
        filters={FILTERS}
        values={filters}
        onChange={(id, val) => setFilters((prev) => ({ ...prev, [id]: val }))}
        searchPlaceholder="Search by name…"
        searchValue={search}
        onSearchChange={(v) => setSearch(v)}
      />

      <DataTable<StudentRow>
        columns={COLUMNS}
        rows={rows}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/education/students/${row._id}`)}
        loading={loading}
        emptyMessage="No students found. Try adjusting your search or filters."
      />

      <PersonForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={async (data) => {
          await createPerson(data as any);
          setCreateOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
