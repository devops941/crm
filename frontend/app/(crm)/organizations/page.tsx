"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getOrganizations, createOrganization } from "@/lib/api";
import type { Organization } from "@/lib/types";
import { DataTable } from "@/components/crm/data-table";
import { FilterBar } from "@/components/crm/filter-bar";
import { StatusBadge } from "@/components/crm/status-badge";
import { OrganizationForm } from "@/components/crm/organization-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const FILTERS = [
  {
    id: "type",
    label: "Type",
    options: [
      { value: "company", label: "Company" },
      { value: "institution", label: "Institution" },
      { value: "vendor", label: "Vendor" },
      { value: "partner", label: "Partner" },
    ],
  },
  {
    id: "industry",
    label: "Industry",
    options: [
      { value: "technology", label: "Technology" },
      { value: "education", label: "Education" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "finance", label: "Finance" },
      { value: "healthcare", label: "Healthcare" },
    ],
  },
  {
    id: "relationship_status",
    label: "Relationship",
    options: [
      { value: "no_relationship", label: "No Relationship" },
      { value: "prospect", label: "Prospect" },
      { value: "contacted", label: "Contacted" },
      { value: "active_opportunity", label: "Active Opportunity" },
      { value: "active_relationship", label: "Active Relationship" },
      { value: "mou", label: "MoU" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];

type OrgRow = Organization & Record<string, unknown>;

const COLUMNS = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    render: (row: OrgRow) => (
      <span className="font-semibold text-foreground">{row.name}</span>
    ),
  },
  {
    key: "category",
    label: "Type",
    render: (row: OrgRow) => (
      <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
        {row.category as string}
      </span>
    ),
  },
  {
    key: "relationship_status",
    label: "Relationship",
    render: (row: OrgRow) => {
      const status = row.relationship_status as string | undefined;
      if (!status) return <span className="text-muted-foreground text-xs">—</span>;
      return <StatusBadge status={status} size="sm" />;
    },
  },
  {
    key: "open_pipeline",
    label: "Open Pipeline",
    render: (_row: OrgRow) => (
      <span className="text-sm text-muted-foreground font-mono">—</span>
    ),
  },
  {
    key: "owner_id",
    label: "Owner",
    render: (row: OrgRow) => (
      <span className="text-sm text-muted-foreground font-mono text-[11px]">
        {(row.owner_id as string).slice(0, 8)}…
      </span>
    ),
  },
];

export default function OrganizationsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Organization[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrganizations({
        q: search || undefined,
        category: filters.type || undefined,
        page,
      });
      setRows(res.data);
      setTotalPages(res.meta.total_pages);
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page, filters.type]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Companies, institutions, vendors and partners
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
          <Plus className="size-4" /> New Organization
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

      <DataTable<OrgRow>
        columns={COLUMNS}
        rows={sorted as OrgRow[]}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/organizations/${row._id}`)}
        loading={loading}
        emptyMessage="No organizations found. Try adjusting your search or filters."
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSortChange}
      />

      <OrganizationForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={async (data) => {
          await createOrganization(data as any);
          setCreateOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
