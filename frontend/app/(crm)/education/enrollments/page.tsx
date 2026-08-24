"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { getEnrollments } from "@/lib/api";
import type { Enrollment } from "@/lib/types";
import { DataTable } from "@/components/crm/data-table";
import { FilterBar } from "@/components/crm/filter-bar";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EnrollmentForm } from "@/components/crm/enrollment-form";

type EnrollmentRow = Enrollment & Record<string, unknown>;

const FILTERS = [
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
  {
    id: "fee_status",
    label: "Fee Status",
    options: [
      { value: "paid", label: "Paid" },
      { value: "pending", label: "Pending" },
    ],
  },
];

const COLUMNS = [
  {
    key: "student_name",
    label: "Student Name",
    sortable: true,
    render: (row: EnrollmentRow) => (
      <span className="font-semibold text-foreground">
        {(row.student_name as string) ?? "—"}
      </span>
    ),
  },
  {
    key: "course_name",
    label: "Course",
    render: (row: EnrollmentRow) => (
      <span className="text-sm text-muted-foreground">
        {(row.course_name as string) ?? "—"}
      </span>
    ),
  },
  {
    key: "level",
    label: "Level",
    render: (row: EnrollmentRow) => (
      <span className="text-sm text-muted-foreground">
        {(row.level as string) ?? "—"}
      </span>
    ),
  },
  {
    key: "batch",
    label: "Batch",
    render: (row: EnrollmentRow) => (
      <span className="text-sm text-muted-foreground">
        {(row.batch as string) ?? "—"}
      </span>
    ),
  },
  {
    key: "branch_name",
    label: "Branch",
    render: (row: EnrollmentRow) => (
      <span className="text-sm text-muted-foreground">
        {(row.branch_name as string) ?? "—"}
      </span>
    ),
  },
  {
    key: "start_date",
    label: "Start Date",
    sortable: true,
    render: (row: EnrollmentRow) => {
      const d = new Date(row.start_date as string);
      return (
        <span className="text-sm text-muted-foreground">
          {isNaN(d.getTime())
            ? "—"
            : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      );
    },
  },
  {
    key: "progress",
    label: "Progress",
    render: (row: EnrollmentRow) => {
      const current = (row.current_day as number) ?? 0;
      const total = (row.total_days as number) ?? 1;
      const pct = Math.min(100, Math.round((current / total) * 100));
      return (
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {current}/{total}
          </span>
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row: EnrollmentRow) => (
      <StatusBadge status={row.status as string} size="sm" />
    ),
  },
  {
    key: "fee_paid",
    label: "Fee Status",
    render: (row: EnrollmentRow) => (
      <StatusBadge
        status={row.fee_paid ? "paid" : "pending"}
        size="sm"
      />
    ),
  },
];

export default function EnrollmentsPage() {
  const [rows, setRows] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [sortKey, setSortKey] = useState("start_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getEnrollments({
        status: filters.status || undefined,
        page,
      });
      let data = res.data as EnrollmentRow[];
      // Client-side fee filter
      if (filters.fee_status === "paid") data = data.filter((e) => e.fee_paid);
      if (filters.fee_status === "pending") data = data.filter((e) => !e.fee_paid);
      setRows(data);
      setTotalPages(res.meta.total_pages);
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [filters, search]);

  function handleSortChange(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = String(a[sortKey] ?? "");
    const bv = String(b[sortKey] ?? "");
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enrollments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Active and historical enrolments across courses and cohorts
          </p>
        </div>
        <Button className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" /> New Enrollment
        </Button>
      </div>

      <FilterBar
        filters={FILTERS}
        values={filters}
        onChange={(id, val) => setFilters((prev) => ({ ...prev, [id]: val }))}
        searchPlaceholder="Search by student name…"
        searchValue={search}
        onSearchChange={(v) => setSearch(v)}
      />

      <DataTable<EnrollmentRow>
        columns={COLUMNS}
        rows={sorted}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No enrollments found. Try adjusting your filters."
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSortChange}
      />

      <EnrollmentForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={(data) => {
          console.log("API CALL: createEnrollment", data);
          setCreateOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
