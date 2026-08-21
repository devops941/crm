"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getLeads, createLead } from "@/lib/api";
import type { Lead, LeadStage } from "@/lib/types";
import { DataTable } from "@/components/crm/data-table";
import { FilterBar } from "@/components/crm/filter-bar";
import { StatusBadge } from "@/components/crm/status-badge";
import { ExportButton } from "@/components/crm/export-button";
import { LeadForm } from "@/components/crm/lead-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const PIPELINE_STAGES: { stage: LeadStage; label: string; color: string }[] = [
  { stage: "new", label: "New", color: "bg-blue-500" },
  { stage: "contacted", label: "Contacted", color: "bg-amber-500" },
  { stage: "qualified", label: "Qualified", color: "bg-violet-500" },
  { stage: "converted", label: "Converted", color: "bg-green-500" },
  { stage: "lost", label: "Lost", color: "bg-red-400" },
];

const FILTERS = [
  {
    id: "source",
    label: "Source",
    options: [
      { value: "website_form", label: "Website Form" },
      { value: "referral", label: "Referral" },
      { value: "campaign", label: "Campaign" },
      { value: "walk_in", label: "Walk In" },
      { value: "event", label: "Event" },
      { value: "cold_outreach", label: "Cold Outreach" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "vertical",
    label: "Vertical",
    options: [
      { value: "corporate", label: "Corporate" },
      { value: "institution", label: "Institution" },
      { value: "education", label: "Education" },
      { value: "workforce", label: "Workforce" },
    ],
  },
  {
    id: "stage",
    label: "Stage",
    options: PIPELINE_STAGES.map(({ stage, label }) => ({ value: stage, label })),
  },
];

function scoreClass(score: number): string {
  if (score >= 75) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700";
  if (score >= 50) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700";
}

type LeadRow = Lead & Record<string, unknown>;

const COLUMNS = [
  {
    key: "person_name",
    label: "Lead Name",
    sortable: true,
    render: (row: LeadRow) => (
      <span className="font-semibold text-foreground">
        {(row.person_name as string) || "—"}
      </span>
    ),
  },
  {
    key: "source",
    label: "Source",
    render: (row: LeadRow) => (
      <span className="text-sm text-muted-foreground capitalize">
        {(row.source as string).replace(/_/g, " ")}
      </span>
    ),
  },
  {
    key: "vertical",
    label: "Vertical",
    render: (row: LeadRow) => (
      <span className="text-sm text-foreground capitalize">{row.vertical as string}</span>
    ),
  },
  {
    key: "score",
    label: "Score",
    sortable: true,
    render: (row: LeadRow) => {
      const score = row.score as number;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold",
            scoreClass(score)
          )}
        >
          {score}
        </span>
      );
    },
  },
  {
    key: "stage",
    label: "Stage",
    render: (row: LeadRow) => <StatusBadge status={row.stage as string} size="sm" />,
  },
  {
    key: "owner_name",
    label: "Owner",
    render: (row: LeadRow) => (
      <span className="text-sm text-muted-foreground">
        {(row.owner_name as string | undefined) ?? "—"}
      </span>
    ),
  },
  {
    key: "next_action",
    label: "Next Action",
    render: (row: LeadRow) => (
      <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
        {(row.next_action as string | null | undefined) ?? "—"}
      </span>
    ),
  },
];

export default function LeadsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Lead[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState("person_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all for stage counts, then paginated for table
      const [allRes, pageRes] = await Promise.all([
        getLeads({ q: search || undefined }),
        getLeads({
          q: search || undefined,
          stage: filters.stage || undefined,
          source: filters.source || undefined,
          page,
        }),
      ]);

      // Compute stage counts from full result set
      const counts: Record<string, number> = {};
      for (const lead of allRes.data) {
        counts[lead.stage] = (counts[lead.stage] ?? 0) + 1;
      }
      setStageCounts(counts);

      setRows(pageRes.data);
      setTotalPages(pageRes.meta.total_pages);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }, [search, page, filters.stage, filters.source]);

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
    const av = (a as unknown as Record<string, unknown>)[sortKey];
    const bv = (b as unknown as Record<string, unknown>)[sortKey];
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "asc" ? av - bv : bv - av;
    }
    return sortDir === "asc"
      ? String(av ?? "").localeCompare(String(bv ?? ""))
      : String(bv ?? "").localeCompare(String(av ?? ""));
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Universal lead intake feeding a shared pipeline
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> New Lead
          </Button>
          <ExportButton
            data={sorted}
            filename="leads"
            columns={[
              { key: "person_name", label: "Lead Name" },
              { key: "source", label: "Source" },
              { key: "vertical", label: "Vertical" },
              { key: "product", label: "Product" },
              { key: "score", label: "Score" },
              { key: "stage", label: "Stage" },
              { key: "owner_name", label: "Owner" },
              { key: "next_action", label: "Next Action" },
            ]}
          />
        </div>
      </div>

      {/* Pipeline Stage Badges */}
      <div className="flex flex-wrap gap-2">
        {PIPELINE_STAGES.map(({ stage, label, color }) => (
          <button
            key={stage}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                stage: prev.stage === stage ? "" : stage,
              }))
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filters.stage === stage
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
          >
            <span className={cn("size-2 rounded-full", color)} />
            {label}
            <span className="font-mono font-bold">{stageCounts[stage] ?? 0}</span>
          </button>
        ))}
      </div>

      <FilterBar
        filters={FILTERS}
        values={filters}
        onChange={(id, val) => setFilters((prev) => ({ ...prev, [id]: val }))}
        searchPlaceholder="Search by name…"
        searchValue={search}
        onSearchChange={(v) => setSearch(v)}
      />

      <DataTable<LeadRow>
        columns={COLUMNS}
        rows={sorted as LeadRow[]}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/leads/${row._id}`)}
        loading={loading}
        emptyMessage="No leads found. Try adjusting your search or filters."
        sortKey={sortKey}
        sortDir={sortDir}
        onSortChange={handleSortChange}
      />

      <LeadForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSave={async (data) => {
          await createLead(data as any);
          setCreateOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
