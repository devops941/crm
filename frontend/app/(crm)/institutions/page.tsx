"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getInstitutions, createOrganization } from "@/lib/api";
import type { Organization } from "@/lib/types";
import { DataTable } from "@/components/crm/data-table";
import { FilterBar } from "@/components/crm/filter-bar";
import { StatusBadge } from "@/components/crm/status-badge";
import { ExportButton } from "@/components/crm/export-button";
import { OrganizationForm } from "@/components/crm/organization-form";
import { Button } from "@/components/ui/button";
import { MapIcon, Plus } from "lucide-react";

// ── Column definitions ────────────────────────────────────────────────────────
type OrgRow = Organization & Record<string, unknown>;

function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const diffDays = Math.round((Date.now() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  const months = Math.round(diffDays / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

const COLUMNS = [
  {
    key: "name",
    label: "Institution",
    sortable: true,
    render: (row: OrgRow) => (
      <span className="font-semibold text-foreground">{row.name as string}</span>
    ),
  },
  {
    key: "institution_type",
    label: "Type",
    render: (row: OrgRow) => {
      const details = row.institution_details as Organization["institution_details"];
      const t = details?.institution_type ?? "—";
      return (
        <span className="text-sm text-foreground capitalize">
          {t.replace(/_/g, " ")}
        </span>
      );
    },
  },
  {
    key: "district",
    label: "District",
    render: (row: OrgRow) => {
      const details = row.institution_details as Organization["institution_details"];
      return (
        <span className="text-sm text-muted-foreground">
          {details?.district ?? "—"}
        </span>
      );
    },
  },
  {
    key: "relationship_status",
    label: "Relationship",
    render: (row: OrgRow) => {
      const s = row.relationship_status as string | undefined;
      return s ? <StatusBadge status={s} size="sm" /> : <span className="text-muted-foreground text-xs">—</span>;
    },
  },
  {
    key: "mou_status",
    label: "MoU",
    render: (row: OrgRow) => {
      const s = row.mou_status as string | undefined;
      return s && s !== "none" ? (
        <StatusBadge status={s} size="sm" />
      ) : (
        <span className="text-muted-foreground text-xs">None</span>
      );
    },
  },
  {
    key: "last_activity_at",
    label: "Last Activity",
    render: (row: OrgRow) => (
      <span className="text-sm text-muted-foreground">
        {relativeTime(row.last_activity_at as string | null)}
      </span>
    ),
  },
  {
    key: "strategic_priority",
    label: "Priority",
    render: (row: OrgRow) => {
      const p = row.strategic_priority as string | undefined;
      if (!p) return <span className="text-muted-foreground text-xs">—</span>;
      const cls =
        p === "high"
          ? "text-red-600 dark:text-red-400 font-medium"
          : p === "medium"
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted-foreground";
      return (
        <span className={`text-xs capitalize ${cls}`}>
          {p}
        </span>
      );
    },
  },
];

// ── Filters ───────────────────────────────────────────────────────────────────
const FILTERS = [
  {
    id: "district",
    label: "District",
    options: [
      { value: "Madurai", label: "Madurai" },
      { value: "Chennai", label: "Chennai" },
      { value: "Coimbatore", label: "Coimbatore" },
      { value: "Trichy", label: "Trichy" },
      { value: "Salem", label: "Salem" },
      { value: "Tirunelveli", label: "Tirunelveli" },
    ],
  },
  {
    id: "institution_type",
    label: "Type",
    options: [
      { value: "school", label: "School" },
      { value: "college", label: "College" },
      { value: "university", label: "University" },
      { value: "training_institution", label: "Training Institution" },
    ],
  },
  {
    id: "management",
    label: "Management",
    options: [
      { value: "government", label: "Government" },
      { value: "private", label: "Private" },
      { value: "aided", label: "Aided" },
      { value: "autonomous", label: "Autonomous" },
    ],
  },
  {
    id: "relationship_status",
    label: "Relationship",
    options: [
      { value: "no_relationship", label: "No Relationship" },
      { value: "prospect", label: "Prospect" },
      { value: "contacted", label: "Contacted" },
      { value: "active_relationship", label: "Active" },
      { value: "mou", label: "MoU" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  {
    id: "mou_status",
    label: "MoU Status",
    options: [
      { value: "none", label: "None" },
      { value: "proposed", label: "Proposed" },
      { value: "active", label: "Active" },
      { value: "expiring", label: "Expiring" },
      { value: "expired", label: "Expired" },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InstitutionsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Organization[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({
    district: "Madurai",
  });
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInstitutions({
        district: filters.district || undefined,
        institution_type: filters.institution_type || undefined,
        relationship_status: filters.relationship_status || undefined,
        page,
      });
      setRows(res.data);
      setTotalPages(res.meta.total_pages);
    } catch {
      setError("Failed to load institutions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters.district, filters.institution_type, filters.relationship_status, page]);

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

  // Client-side sort + search filter
  const displayed = [...rows]
    .filter((r) => {
      if (!search) return true;
      return r.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortKey];
      const bv = (b as unknown as Record<string, unknown>)[sortKey];
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Institutions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            School, college, and university network across Tamil Nadu
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> New Institution
          </Button>
          <ExportButton
            data={displayed}
            filename="institutions"
            columns={[
              { key: "name", label: "Institution" },
              { key: "relationship_status", label: "Relationship" },
              { key: "mou_status", label: "MoU Status" },
              { key: "last_activity_at", label: "Last Activity" },
              { key: "strategic_priority", label: "Priority" },
            ]}
          />
          <Link
            href="/institutions/map"
            className="inline-flex items-center gap-2 h-7 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium hover:bg-muted hover:text-foreground transition-colors"
          >
            <MapIcon className="size-4" />
            Switch to Map View
          </Link>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={FILTERS}
        values={filters}
        onChange={(id, val) =>
          setFilters((prev) => ({ ...prev, [id]: val }))
        }
        searchPlaceholder="Search institutions…"
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Error state */}
      {error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="text-muted-foreground text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </div>
      ) : (
        <DataTable<OrgRow>
          columns={COLUMNS}
          rows={displayed as OrgRow[]}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={(row) => router.push(`/institutions/${row._id}`)}
          loading={loading}
          emptyMessage="No institutions found. Try adjusting your filters."
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSortChange}
        />
      )}

      <OrganizationForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={async (data) => {
          await createOrganization({ ...data as any, category: "institution" });
          setCreateOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
