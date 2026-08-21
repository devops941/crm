"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMoUs, createMoU } from "@/lib/api";
import type { MoU, MoUStatus } from "@/lib/types";
import { DataTable } from "@/components/crm/data-table";
import { StatusBadge } from "@/components/crm/status-badge";
import { MoUForm } from "@/components/crm/mou-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

// ── Filter chips ──────────────────────────────────────────────────────────────
interface FilterChip {
  label: string;
  status: MoUStatus | "all";
}

const CHIPS: FilterChip[] = [
  { label: "All", status: "all" },
  { label: "Active", status: "active" },
  { label: "Expiring Soon", status: "expiring" },
  { label: "Expired", status: "expired" },
  { label: "Proposed", status: "proposed" },
  { label: "Signed", status: "signed" },
];

// ── Column definitions ────────────────────────────────────────────────────────
type MoURow = MoU & Record<string, unknown>;

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Infinity;
  return Math.round((d.getTime() - Date.now()) / 86_400_000);
}

const COLUMNS = [
  {
    key: "_id",
    label: "MoU ID",
    render: (row: MoURow) => (
      <span className="font-mono text-xs text-muted-foreground">
        {(row._id as string).slice(-10).toUpperCase()}
      </span>
    ),
  },
  {
    key: "org_name",
    label: "Institution / Org",
    sortable: true,
    render: (row: MoURow) => (
      <span className="font-semibold text-foreground">
        {(row.institution_name as string | undefined) ??
          (row.organization_name as string | undefined) ??
          "—"}
      </span>
    ),
  },
  {
    key: "vertical",
    label: "Vertical",
    render: (row: MoURow) => (
      <span className="text-sm text-muted-foreground capitalize">
        {row.vertical as string}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row: MoURow) => <StatusBadge status={row.status as string} size="sm" />,
  },
  {
    key: "end_date",
    label: "Expiry",
    sortable: true,
    render: (row: MoURow) => {
      const days = daysUntil(row.end_date as string);
      return (
        <span
          className={cn(
            "text-sm",
            days < 0
              ? "text-red-600 dark:text-red-400 font-medium"
              : days < 30
              ? "text-amber-600 dark:text-amber-400 font-medium"
              : "text-muted-foreground"
          )}
        >
          {fmtDate(row.end_date as string)}
          {days >= 0 && days < 60 && (
            <span className="block text-[10px] font-medium">
              {days === 0 ? "Expires today" : `${days}d left`}
            </span>
          )}
          {days < 0 && (
            <span className="block text-[10px]">
              {Math.abs(days)}d ago
            </span>
          )}
        </span>
      );
    },
  },
  {
    key: "owner_name",
    label: "Owner",
    render: (row: MoURow) => (
      <span className="text-sm text-muted-foreground">
        {(row.owner_name as string | undefined) ?? "—"}
      </span>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MoUsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<MoU[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeChip, setActiveChip] = useState<FilterChip["status"]>("all");
  const [sortKey, setSortKey] = useState("end_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMoUs({
        status: activeChip === "all" ? undefined : activeChip,
        page,
      });
      setRows(res.data);
      setTotalPages(res.meta.total_pages);
    } catch {
      setError("Failed to load MoUs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeChip, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [activeChip]);

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
    const cmp = String(av ?? "").localeCompare(String(bv ?? ""));
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MoUs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Memoranda of Understanding — formal partnerships tracked as first-class records
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
          <Plus className="size-4" /> New MoU
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <button
            key={chip.status}
            onClick={() => setActiveChip(chip.status)}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeChip === chip.status
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <p className="text-muted-foreground text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchData}>
            Retry
          </Button>
        </div>
      ) : (
        <DataTable<MoURow>
          columns={COLUMNS}
          rows={sorted as MoURow[]}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={(row) => router.push(`/mous/${row._id}`)}
          loading={loading}
          emptyMessage="No MoUs found for this filter."
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSortChange}
        />
      )}

      <MoUForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={async (data) => {
          await createMoU(data as any);
          setCreateOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
