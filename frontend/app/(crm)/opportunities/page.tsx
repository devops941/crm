"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getOpportunities, updateOpportunityStage, createOpportunity } from "@/lib/api";
import type { Opportunity, OpportunityMacroStage } from "@/lib/types";
import { DataTable } from "@/components/crm/data-table";
import { StatusBadge } from "@/components/crm/status-badge";
import { OpportunityForm } from "@/components/crm/opportunity-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LayoutGridIcon, TableIcon, IndianRupeeIcon, GripVertical, Plus } from "lucide-react";

type ViewMode = "kanban" | "table";

const KANBAN_STAGES: { stage: OpportunityMacroStage; label: string; color: string }[] = [
  { stage: "discovered", label: "Discovered", color: "bg-slate-500" },
  { stage: "qualified", label: "Qualified", color: "bg-blue-500" },
  { stage: "proposed", label: "Proposed", color: "bg-violet-500" },
  { stage: "negotiating", label: "Negotiating", color: "bg-amber-500" },
  { stage: "won", label: "Won", color: "bg-green-500" },
  { stage: "delivering", label: "Delivering", color: "bg-teal-500" },
  { stage: "renew_expand", label: "Renew / Expand", color: "bg-cyan-500" },
];

function formatINR(value: number): string {
  if (value >= 10_00_000) return `₹${(value / 10_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(0)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

function ProbabilityBar({ probability }: { probability: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            probability >= 70 ? "bg-green-500" : probability >= 40 ? "bg-amber-500" : "bg-muted-foreground"
          )}
          style={{ width: `${probability}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{probability}%</span>
    </div>
  );
}

// ── Draggable Opportunity Card ──
function DraggableCard({ opp, onClick, stageColor }: { opp: Opportunity; onClick: () => void; stageColor: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opp._id,
    data: { stage: opp.stage },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        onClick={onClick}
        className={cn(
          "w-full text-left rounded-lg bg-card border border-border/80 overflow-hidden cursor-pointer",
          "hover:shadow-md hover:border-border transition-all group",
          "focus-visible:ring-2 focus-visible:ring-ring/50 outline-none"
        )}
      >
        {/* Colored top accent */}
        <div className={cn("h-1", stageColor)} />

        <div className="p-3 space-y-2.5">
          {/* Header row: grip + name */}
          <div className="flex items-start gap-2">
            <span
              {...listeners}
              className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="size-4" />
            </span>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-[13px] font-semibold leading-snug text-foreground truncate">
                {opp.account_name ?? "Unknown Account"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{opp.product}</p>
            </div>
          </div>

          {/* Value + Contact */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-0.5 text-sm font-bold text-foreground">
              <IndianRupeeIcon className="size-3 shrink-0 text-muted-foreground" />
              {formatINR(opp.value).replace("₹", "")}
            </span>
            {opp.contact_name && (
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded truncate max-w-[100px]">
                {opp.contact_name}
              </span>
            )}
          </div>

          {/* Probability */}
          <ProbabilityBar probability={opp.probability} />
        </div>
      </div>
    </div>
  );
}

// ── Drag Overlay Card ──
function StaticCard({ opp, stageColor }: { opp: Opportunity; stageColor: string }) {
  return (
    <div className="w-[200px] rounded-lg bg-card border-2 border-primary/40 overflow-hidden shadow-xl rotate-2">
      <div className={cn("h-1.5", stageColor)} />
      <div className="p-3 space-y-2">
        <p className="text-[13px] font-semibold leading-snug line-clamp-2">{opp.account_name ?? "Unknown"}</p>
        <p className="text-[11px] text-muted-foreground">{opp.product}</p>
        <span className="inline-flex items-center gap-0.5 text-sm font-bold">
          <IndianRupeeIcon className="size-3" />{formatINR(opp.value).replace("₹", "")}
        </span>
      </div>
    </div>
  );
}

// ── Droppable Stage Column ──
function StageColumn({
  stage,
  label,
  color,
  cards,
  stageTotal,
  isOver,
  children,
}: {
  stage: string;
  label: string;
  color: string;
  cards: Opportunity[];
  stageTotal: number;
  isOver: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: `stage-${stage}` });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-w-0 flex flex-col rounded-xl transition-all",
        isOver ? "bg-primary/5 ring-2 ring-primary/30 shadow-sm" : "bg-muted/30"
      )}
    >
      {/* Column header */}
      <div className="px-3 py-2.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full shrink-0", color)} />
          <span className="text-xs font-semibold flex-1 text-foreground truncate">{label}</span>
          <span className="text-[11px] font-mono bg-background border border-border rounded-md px-1.5 py-0.5 text-muted-foreground">
            {cards.length}
          </span>
        </div>
        {cards.length > 0 && (
          <p className="text-[10px] font-mono text-muted-foreground mt-1 ml-[18px]">
            {formatINR(stageTotal)} total
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-2 min-h-[80px]">
        {children}
        {cards.length === 0 && (
          <div className={cn(
            "rounded-lg border-2 border-dashed py-8 text-center text-xs transition-colors",
            isOver ? "border-primary/40 text-primary bg-primary/5" : "border-border/60 text-muted-foreground"
          )}>
            {isOver ? "Drop here" : "No deals"}
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-3">
      {KANBAN_STAGES.map((s) => (
        <div key={s.stage} className="rounded-xl bg-muted/30 p-2">
          <Skeleton className="h-12 w-full rounded-lg mb-2" />
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg mb-2" />
          ))}
        </div>
      ))}
    </div>
  );
}

type OppRow = Opportunity & Record<string, unknown>;

const TABLE_COLUMNS = [
  { key: "account_name", label: "Account", sortable: true, render: (row: OppRow) => <span className="font-semibold">{(row.account_name as string) ?? "—"}</span> },
  { key: "product", label: "Product", render: (row: OppRow) => <span className="text-sm capitalize">{row.product as string}</span> },
  { key: "stage", label: "Stage", render: (row: OppRow) => <StatusBadge status={row.stage as string} size="sm" /> },
  { key: "value", label: "Value", sortable: true, render: (row: OppRow) => <span className="font-mono text-sm font-semibold">{formatINR(row.value as number)}</span> },
  { key: "probability", label: "Probability", render: (row: OppRow) => <div className="w-28"><ProbabilityBar probability={row.probability as number} /></div> },
  { key: "contact_name", label: "Contact", render: (row: OppRow) => <span className="text-sm text-muted-foreground">{(row.contact_name as string | undefined) ?? "—"}</span> },
  { key: "owner_name", label: "Owner", render: (row: OppRow) => <span className="text-sm text-muted-foreground">{(row.owner_name as string | undefined) ?? "—"}</span> },
];

export default function OpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [tablePage, setTablePage] = useState(1);
  const [sortKey, setSortKey] = useState("account_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [activeOpp, setActiveOpp] = useState<Opportunity | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOpportunities({ page: 1 });
      setOpportunities(res.data);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Drag handlers ──
  function handleDragStart(event: DragStartEvent) {
    const opp = opportunities.find((o) => o._id === event.active.id);
    if (opp) setActiveOpp(opp);
  }

  function handleDragOver(event: DragEndEvent) {
    const overId = event.over?.id;
    if (typeof overId === "string" && overId.startsWith("stage-")) {
      setOverStage(overId.replace("stage-", ""));
    } else {
      setOverStage(null);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveOpp(null);
    setOverStage(null);

    const { active, over } = event;
    if (!over) return;

    const overId = String(over.id);
    let newStage: string | null = null;

    if (overId.startsWith("stage-")) {
      newStage = overId.replace("stage-", "");
    }

    if (!newStage) return;

    const opp = opportunities.find((o) => o._id === active.id);
    if (!opp || opp.stage === newStage) return;

    // Optimistic update
    setOpportunities((prev) =>
      prev.map((o) => (o._id === active.id ? { ...o, stage: newStage as OpportunityMacroStage } : o))
    );

    // API call
    await updateOpportunityStage(String(active.id), newStage);
  }

  function handleSortChange(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const byStage = KANBAN_STAGES.reduce<Record<string, Opportunity[]>>((acc, s) => {
    acc[s.stage] = opportunities.filter((o) => o.stage === s.stage);
    return acc;
  }, {});

  const sortedForTable = [...opportunities].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortKey];
    const bv = (b as unknown as Record<string, unknown>)[sortKey];
    if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av ?? "").localeCompare(String(bv ?? "")) : String(bv ?? "").localeCompare(String(av ?? ""));
  });

  const PAGE_SIZE = 10;
  const totalTablePages = Math.ceil(sortedForTable.length / PAGE_SIZE);
  const tableRows = sortedForTable.slice((tablePage - 1) * PAGE_SIZE, tablePage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {opportunities.length} opportunities — drag cards between stages to update
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> New Opportunity
          </Button>
          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
            <Button variant={viewMode === "kanban" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("kanban")} className="gap-1.5">
              <LayoutGridIcon className="size-3.5" /> Kanban
            </Button>
            <Button variant={viewMode === "table" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("table")} className="gap-1.5">
              <TableIcon className="size-3.5" /> Table
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban View with DnD */}
      {viewMode === "kanban" ? (
        loading ? (
          <KanbanSkeleton />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-3">
              {KANBAN_STAGES.map((s) => {
                const cards = byStage[s.stage] ?? [];
                const stageTotal = cards.reduce((sum, o) => sum + o.value, 0);
                return (
                  <StageColumn
                    key={s.stage}
                    stage={s.stage}
                    label={s.label}
                    color={s.color}
                    cards={cards}
                    stageTotal={stageTotal}
                    isOver={overStage === s.stage}
                  >
                    {cards.map((opp) => (
                      <DraggableCard
                        key={opp._id}
                        opp={opp}
                        stageColor={s.color}
                        onClick={() => router.push(`/opportunities/${opp._id}`)}
                      />
                    ))}
                  </StageColumn>
                );
              })}
            </div>

            {/* Drag Overlay */}
            <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
              {activeOpp ? (
                <StaticCard
                  opp={activeOpp}
                  stageColor={KANBAN_STAGES.find((s) => s.stage === activeOpp.stage)?.color ?? "bg-slate-500"}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )
      ) : (
        <DataTable<OppRow>
          columns={TABLE_COLUMNS}
          rows={tableRows as OppRow[]}
          page={tablePage}
          totalPages={totalTablePages}
          onPageChange={setTablePage}
          onRowClick={(row) => router.push(`/opportunities/${row._id}`)}
          loading={loading}
          emptyMessage="No opportunities found."
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSortChange}
        />
      )}

      <OpportunityForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={async (data) => {
          await createOpportunity(data as any);
          setCreateOpen(false);
          fetchData();
        }}
      />
    </div>
  );
}
