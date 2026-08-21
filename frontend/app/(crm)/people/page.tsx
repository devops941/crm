"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPeople, createPerson } from "@/lib/api";
import type { Person } from "@/lib/types";
import { DataTable } from "@/components/crm/data-table";
import { FilterBar } from "@/components/crm/filter-bar";
import { StatusBadge } from "@/components/crm/status-badge";
import { ExportButton } from "@/components/crm/export-button";
import { PersonForm } from "@/components/crm/person-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const FILTERS = [
  {
    id: "role",
    label: "Role",
    options: [
      { value: "alumni", label: "Alumni" },
      { value: "student", label: "Student" },
      { value: "corporate_contact", label: "Corporate Contact" },
      { value: "decision_maker", label: "Decision Maker" },
    ],
  },
  {
    id: "organization",
    label: "Organization",
    options: [
      { value: "TCS", label: "TCS" },
      { value: "Infosys", label: "Infosys" },
      { value: "Wipro", label: "Wipro" },
      { value: "Accenture", label: "Accenture" },
    ],
  },
  {
    id: "location",
    label: "Location",
    options: [
      { value: "Chennai", label: "Chennai" },
      { value: "Bangalore", label: "Bangalore" },
      { value: "Hyderabad", label: "Hyderabad" },
      { value: "Mumbai", label: "Mumbai" },
      { value: "Delhi", label: "Delhi" },
    ],
  },
];

type PersonRow = Person & Record<string, unknown>;

const COLUMNS = [
  {
    key: "full_name",
    label: "Name",
    sortable: true,
    render: (row: PersonRow) => (
      <span className="font-semibold text-foreground">{row.full_name}</span>
    ),
  },
  {
    key: "roles",
    label: "Roles",
    render: (row: PersonRow) => {
      const roles = (row.roles as string[] | undefined) ?? [];
      if (roles.length === 0)
        return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((r) => (
            <StatusBadge key={r} status={r} size="sm" />
          ))}
        </div>
      );
    },
  },
  {
    key: "organizations",
    label: "Org / Institution",
    render: (row: PersonRow) => {
      const orgs = (row.organizations as string[] | undefined) ?? [];
      return (
        <span className="text-sm text-muted-foreground">
          {orgs.length > 0 ? orgs[0] : "—"}
        </span>
      );
    },
  },
  {
    key: "dedupe_status",
    label: "Stage",
    render: (row: PersonRow) => (
      <StatusBadge status={row.dedupe_status as string} size="sm" />
    ),
  },
  {
    key: "owner_id",
    label: "Owner",
    render: (row: PersonRow) => (
      <span className="text-sm text-muted-foreground font-mono text-[11px]">
        {(row.owner_id as string).slice(0, 8)}…
      </span>
    ),
  },
  {
    key: "updated_at",
    label: "Last Activity",
    render: (row: PersonRow) => {
      const date = new Date(row.updated_at as string);
      return (
        <span className="text-sm text-muted-foreground">
          {isNaN(date.getTime())
            ? "—"
            : date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
        </span>
      );
    },
  },
];

export default function PeoplePage() {
  const router = useRouter();
  const [rows, setRows] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState("full_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPeople({ q: search || undefined, page });
      setRows(res.data);
      setTotalPages(res.meta.total_pages);
    } catch (err) {
      console.error("Failed to fetch people:", err);
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

  function handleSortChange(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
    const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">People</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Alumni, students, corporate contacts and decision makers
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> New Person
          </Button>
          <ExportButton
            data={sorted}
            filename="people"
            columns={[
              { key: "full_name", label: "Name" },
              { key: "primary_email", label: "Email" },
              { key: "primary_phone", label: "Phone" },
              { key: "dedupe_status", label: "Status" },
              { key: "owner_id", label: "Owner ID" },
              { key: "updated_at", label: "Last Updated" },
            ]}
          />
        </div>
      </div>

      <FilterBar
        filters={FILTERS}
        values={filters}
        onChange={(id, val) => setFilters((prev) => ({ ...prev, [id]: val }))}
        searchPlaceholder="Search by name or email…"
        searchValue={search}
        onSearchChange={(v) => setSearch(v)}
      />

      <DataTable<PersonRow>
        columns={COLUMNS}
        rows={sorted as PersonRow[]}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/people/${row._id}`)}
        loading={loading}
        emptyMessage="No people found. Try adjusting your search or filters."
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSortChange}
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
