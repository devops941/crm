"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/crm/filter-bar";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheckIcon } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type AuditAction = "create" | "update" | "delete";

interface AuditEvent {
  _id: string;
  timestamp: string;
  actor: string;
  action: AuditAction;
  entity_type: string;
  entity_id: string;
  changes: string; // human-readable diff summary
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_EVENTS: AuditEvent[] = [
  {
    _id: "ae001",
    timestamp: "2026-08-21T10:32:00Z",
    actor: "admin@kaizen.com",
    action: "create",
    entity_type: "Lead",
    entity_id: "lead_88f3a2",
    changes: 'Created lead for "Arun Kumar" (source: referral, vertical: corporate)',
  },
  {
    _id: "ae002",
    timestamp: "2026-08-21T09:18:45Z",
    actor: "sales@kaizen.com",
    action: "update",
    entity_type: "Opportunity",
    entity_id: "opp_112bc0",
    changes: 'stage: "engaged" → "qualified"; probability: 45 → 65',
  },
  {
    _id: "ae003",
    timestamp: "2026-08-20T16:55:12Z",
    actor: "founder@kaizen.com",
    action: "delete",
    entity_type: "Person",
    entity_id: "person_9a8b7c",
    changes: 'Deleted duplicate record "Meera Nair" (merged_into: person_2d3e4f)',
  },
  {
    _id: "ae004",
    timestamp: "2026-08-20T14:22:30Z",
    actor: "admin@kaizen.com",
    action: "create",
    entity_type: "MoU",
    entity_id: "mou_45def1",
    changes: 'Created MoU with "Kamaraj College" (scope: placement drives, value: ₹2,50,000)',
  },
  {
    _id: "ae005",
    timestamp: "2026-08-20T11:05:00Z",
    actor: "counsellor@kaizen.com",
    action: "update",
    entity_type: "Enrollment",
    entity_id: "enr_78ab34",
    changes: 'status: "active" → "paused"; notes: "Student on medical leave"',
  },
  {
    _id: "ae006",
    timestamp: "2026-08-19T17:40:18Z",
    actor: "sales@kaizen.com",
    action: "create",
    entity_type: "Organization",
    entity_id: "org_b1c2d3",
    changes: 'Created institution "Sri Ramakrishna College of Arts & Science" (district: Coimbatore)',
  },
  {
    _id: "ae007",
    timestamp: "2026-08-19T13:12:55Z",
    actor: "finance@kaizen.com",
    action: "update",
    entity_type: "Payment",
    entity_id: "pay_99e00f",
    changes: 'status: "pending" → "received"; paid_at: 2026-08-19T13:12:55Z',
  },
  {
    _id: "ae008",
    timestamp: "2026-08-18T09:30:00Z",
    actor: "admin@kaizen.com",
    action: "update",
    entity_type: "Lead",
    entity_id: "lead_77f1b2",
    changes: 'stage: "new" → "contacted"; next_action: "Follow up call next Monday"',
  },
  {
    _id: "ae009",
    timestamp: "2026-08-17T15:45:22Z",
    actor: "founder@kaizen.com",
    action: "delete",
    entity_type: "Task",
    entity_id: "task_33c4d5",
    changes: 'Deleted completed task "Prepare Q3 pipeline report"',
  },
  {
    _id: "ae010",
    timestamp: "2026-08-17T10:00:00Z",
    actor: "telecaller@kaizen.com",
    action: "create",
    entity_type: "Activity",
    entity_id: "act_55e6f7",
    changes: 'Logged call with "Priya Suresh" (duration: 12 min, outcome: interested)',
  },
];

// ── Action badge ──────────────────────────────────────────────────────────────
const ACTION_STYLES: Record<AuditAction, string> = {
  create:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  update:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700",
  delete:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
};

function ActionBadge({ action }: { action: AuditAction }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        ACTION_STYLES[action]
      )}
    >
      {action}
    </span>
  );
}

// ── Filters ───────────────────────────────────────────────────────────────────
const ENTITY_TYPES = [
  "Lead",
  "Opportunity",
  "Person",
  "Organization",
  "MoU",
  "Enrollment",
  "Payment",
  "Task",
  "Activity",
];

const FILTER_DEFS = [
  {
    id: "action",
    label: "Action",
    options: [
      { value: "create", label: "Create" },
      { value: "update", label: "Update" },
      { value: "delete", label: "Delete" },
    ],
  },
  {
    id: "entity_type",
    label: "Entity Type",
    options: ENTITY_TYPES.map((t) => ({ value: t, label: t })),
  },
  {
    id: "date_range",
    label: "Date Range",
    options: [
      { value: "today", label: "Today" },
      { value: "last_7", label: "Last 7 days" },
      { value: "last_30", label: "Last 30 days" },
    ],
  },
];

function fmtTimestamp(ts: string) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(str: string, max = 80): string {
  return str.length <= max ? str : `${str.slice(0, max)}…`;
}

function isWithinRange(ts: string, range: string): boolean {
  const d = new Date(ts).getTime();
  const now = Date.now();
  const ONE_DAY = 86_400_000;
  if (range === "today") return now - d < ONE_DAY;
  if (range === "last_7") return now - d < 7 * ONE_DAY;
  if (range === "last_30") return now - d < 30 * ONE_DAY;
  return true;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AuditLogPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const displayed = useMemo(() => {
    let items = [...MOCK_EVENTS];
    if (filters.action) items = items.filter((e) => e.action === filters.action);
    if (filters.entity_type) items = items.filter((e) => e.entity_type === filters.entity_type);
    if (filters.date_range) items = items.filter((e) => isWithinRange(e.timestamp, filters.date_range));
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (e) =>
          e.actor.toLowerCase().includes(q) ||
          e.entity_type.toLowerCase().includes(q) ||
          e.entity_id.toLowerCase().includes(q) ||
          e.changes.toLowerCase().includes(q)
      );
    }
    return items;
  }, [filters, search]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="size-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All create, update, and delete events across the CRM
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={FILTER_DEFS}
        values={filters}
        onChange={(id, val) => setFilters((prev) => ({ ...prev, [id]: val }))}
        searchPlaceholder="Search actor, entity, or changes…"
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {displayed.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No audit events match your filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Actor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Entity Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">Entity ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {displayed.map((event) => (
                    <tr key={event._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {fmtTimestamp(event.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">
                        {event.actor}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <ActionBadge action={event.action} />
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground whitespace-nowrap">
                        {event.entity_type}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {event.entity_id}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs">
                        {truncate(event.changes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
