"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getInstitutionMapMarkers } from "@/lib/api";
import type { InstitutionMapMarker, InstitutionType, RelationshipStatusComputed } from "@/lib/types";
import { StatusBadge } from "@/components/crm/status-badge";
import { ActivityComposer } from "@/components/crm/activity-composer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  SearchIcon,
  ZoomInIcon,
  ZoomOutIcon,
  XIcon,
  PhoneIcon,
  MessageCircleIcon,
  MailIcon,
  PlusIcon,
  ExternalLinkIcon,
} from "lucide-react";

// ── Marker rendering helpers ──────────────────────────────────────────────────
// Shape = institution type
function MarkerShape({ type }: { type: InstitutionType }) {
  switch (type) {
    case "school":
      return <span className="text-[10px] leading-none">●</span>;
    case "university":
      return <span className="text-[10px] leading-none">◆</span>;
    default:
      return <span className="text-[10px] leading-none">■</span>;
  }
}

// Ring color = relationship status
function relationshipRingClass(status: RelationshipStatusComputed): string {
  switch (status) {
    case "active_relationship":
    case "mou":
      return "ring-green-500";
    case "prospect":
    case "contacted":
      return "ring-amber-400";
    case "active_opportunity":
      return "ring-blue-400";
    case "inactive":
      return "ring-gray-400";
    default:
      return "ring-gray-300 dark:ring-gray-600";
  }
}

function markerFillClass(priority: "high" | "medium" | "low"): string {
  switch (priority) {
    case "high":
      return "text-red-600 dark:text-red-400";
    case "medium":
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-muted-foreground";
  }
}

// ── Right drawer ──────────────────────────────────────────────────────────────
function InstitutionDrawer({
  marker,
  onClose,
  onCreateActivity,
}: {
  marker: InstitutionMapMarker;
  onClose: () => void;
  onCreateActivity: () => void;
}) {
  function relativeActivity(dateStr: string | null | undefined): string {
    if (!dateStr) return "No recent activity";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    const diffDays = Math.round((Date.now() - d.getTime()) / 86_400_000);
    if (diffDays === 0) return "Active today";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.round(diffDays / 7)}w ago`;
    return `${Math.round(diffDays / 30)}mo ago`;
  }

  const typeLabel = marker.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col h-full border-l border-border bg-card overflow-y-auto">
      {/* Drawer header */}
      <div className="flex items-start justify-between gap-2 p-4 border-b border-border">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug truncate">{marker.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{typeLabel} · {marker.district}</p>
        </div>
        <button
          onClick={onClose}
          className="size-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-1.5 px-4 pt-3">
        <StatusBadge status={marker.relationship_status} size="sm" />
        {marker.mou_status !== "none" && (
          <StatusBadge status={marker.mou_status} size="sm" />
        )}
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium",
            marker.priority === "high"
              ? "border-red-400 text-red-600"
              : marker.priority === "medium"
              ? "border-amber-400 text-amber-600"
              : "border-border text-muted-foreground"
          )}
        >
          {marker.priority} priority
        </span>
      </div>

      {/* Detail rows */}
      <div className="flex flex-col gap-1.5 px-4 pt-3 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>District</span>
          <span className="text-foreground font-medium">{marker.district}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Activity</span>
          <span className="text-foreground font-medium">
            {relativeActivity(marker.last_activity_at)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>MoU Status</span>
          <span className="text-foreground font-medium capitalize">
            {marker.mou_status === "none" ? "No MoU" : marker.mou_status}
          </span>
        </div>
      </div>

      {/* Quick action chips */}
      <div className="flex gap-2 px-4 pt-4">
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
          <PhoneIcon className="size-3" /> Call
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-green-500 text-green-700 dark:text-green-400 px-3 py-1.5 text-xs font-medium hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
          <MessageCircleIcon className="size-3" /> WhatsApp
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
          <MailIcon className="size-3" /> Email
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 px-4 pt-3 pb-4 mt-auto">
        <Button size="sm" variant="outline" className="gap-2" onClick={onCreateActivity}>
          <PlusIcon className="size-3.5" />
          Create Activity
        </Button>
        <Link
          href={`/institutions/${marker.institution_id}`}
          className="inline-flex items-center justify-center gap-2 h-7 rounded-[min(var(--radius-md),12px)] bg-primary text-primary-foreground px-2.5 text-[0.8rem] font-medium hover:bg-primary/80 transition-colors"
        >
          <ExternalLinkIcon className="size-3.5" />
          Open Institution 360
        </Link>
      </div>
    </div>
  );
}

// ── Filter sidebar ────────────────────────────────────────────────────────────
interface MapFilters {
  types: Set<string>;
  managements: Set<string>;
  relationships: Set<string>;
  priority: Set<string>;
}

function FilterSidebar({
  filters,
  onChange,
}: {
  filters: MapFilters;
  onChange: (f: MapFilters) => void;
}) {
  function toggle(key: keyof MapFilters, value: string) {
    const next = new Set(filters[key]);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange({ ...filters, [key]: next });
  }

  function Checkbox({
    checked,
    label,
    onClick,
  }: {
    checked: boolean;
    label: string;
    onClick: () => void;
  }) {
    return (
      <label className="flex items-center gap-2 text-xs cursor-pointer select-none hover:text-foreground transition-colors">
        <input
          type="checkbox"
          checked={checked}
          onChange={onClick}
          className="rounded border-border"
        />
        {label}
      </label>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3 overflow-y-auto text-muted-foreground">
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Filters</p>

      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider">Type</p>
        {["school", "college", "university", "training_institution"].map((t) => (
          <Checkbox
            key={t}
            checked={filters.types.has(t)}
            label={t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            onClick={() => toggle("types", t)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider">Management</p>
        {["government", "private", "aided", "autonomous"].map((m) => (
          <Checkbox
            key={m}
            checked={filters.managements.has(m)}
            label={m.replace(/\b\w/g, (c) => c.toUpperCase())}
            onClick={() => toggle("managements", m)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider">Relationship</p>
        {["no_relationship", "prospect", "contacted", "active_relationship", "mou"].map((r) => (
          <Checkbox
            key={r}
            checked={filters.relationships.has(r)}
            label={r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            onClick={() => toggle("relationships", r)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider">Priority</p>
        {["high", "medium", "low"].map((p) => (
          <Checkbox
            key={p}
            checked={filters.priority.has(p)}
            label={p.replace(/\b\w/g, (c) => c.toUpperCase())}
            onClick={() => toggle("priority", p)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InstitutionMapPage() {
  const [markers, setMarkers] = useState<InstitutionMapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [district, setDistrict] = useState("Madurai");
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<InstitutionMapMarker | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [mapFilters, setMapFilters] = useState<MapFilters>({
    types: new Set(),
    managements: new Set(),
    relationships: new Set(),
    priority: new Set(),
  });

  const loadMarkers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInstitutionMapMarkers({ district: district || undefined });
      setMarkers(res);
    } catch {
      setError("Failed to load map data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [district]);

  useEffect(() => {
    loadMarkers();
  }, [loadMarkers]);

  // Apply client-side filters + search
  const filtered = markers.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (mapFilters.types.size > 0 && !mapFilters.types.has(m.type)) return false;
    if (mapFilters.relationships.size > 0 && !mapFilters.relationships.has(m.relationship_status)) return false;
    if (mapFilters.priority.size > 0 && !mapFilters.priority.has(m.priority)) return false;
    return true;
  });

  // Deterministic pseudo-positions from marker index for the wireframe grid
  function markerPosition(idx: number, total: number): { top: string; left: string } {
    // Arrange in a grid within 10–90% range
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    const maxRows = Math.ceil(total / cols);
    const top = `${12 + (row / Math.max(maxRows - 1, 1)) * 76}%`;
    const left = `${10 + (col / Math.max(cols - 1, 1)) * 80}%`;
    return { top, left };
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background shrink-0 flex-wrap">
        <Link
          href="/institutions"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
        >
          <ArrowLeftIcon className="size-3.5" />
          List View
        </Link>

        <div className="h-4 w-px bg-border" />

        {/* State */}
        <span className="text-xs text-muted-foreground font-medium">Tamil Nadu</span>

        {/* District select */}
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground"
        >
          {["Madurai", "Chennai", "Coimbatore", "Trichy", "Salem", "Tirunelveli"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search institution…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
            className="size-8 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
          >
            <ZoomInIcon className="size-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
            className="size-8 flex items-center justify-center rounded border border-border hover:bg-muted transition-colors"
          >
            <ZoomOutIcon className="size-4" />
          </button>
          <span className="text-xs text-muted-foreground ml-1 font-mono">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Main layout: filter sidebar | map | drawer */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left filter sidebar */}
        <div className="w-44 shrink-0 border-r border-border overflow-y-auto bg-background">
          <FilterSidebar filters={mapFilters} onChange={setMapFilters} />
        </div>

        {/* Map area */}
        <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-900">
          {/* Count badge */}
          <div className="absolute top-3 left-3 z-10 rounded-full bg-background/90 backdrop-blur border border-border px-3 py-1 text-xs font-medium shadow-sm">
            {loading ? "Loading…" : `${filtered.length} institution${filtered.length !== 1 ? "s" : ""} match your filters`}
          </div>

          {/* Error */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={loadMarkers}>Retry</Button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="grid grid-cols-6 gap-6 p-8 w-full max-w-2xl">
                {Array.from({ length: 18 }).map((_, i) => (
                  <Skeleton key={i} className="size-5 rounded-full" style={{ opacity: 0.3 + Math.random() * 0.7 }} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Loading map markers…</p>
            </div>
          )}

          {/* Grid wireframe "map" */}
          {!loading && !error && (
            <div
              className="absolute inset-0"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.2s ease" }}
            >
              {/* District boundary wireframe */}
              <div className="absolute inset-[8%] rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5" />
              <p className="absolute top-[5%] left-1/2 -translate-x-1/2 text-xs text-primary/40 font-medium tracking-wide">
                {district} District
              </p>

              {/* Markers */}
              {filtered.map((marker, idx) => {
                const pos = markerPosition(idx, filtered.length);
                const isSelected = selected?.institution_id === marker.institution_id;
                return (
                  <button
                    key={marker.institution_id}
                    onClick={() => setSelected(isSelected ? null : marker)}
                    style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translate(-50%,-50%)" }}
                    title={marker.name}
                    className={cn(
                      "flex items-center justify-center size-6 rounded-sm ring-2 transition-all cursor-pointer z-10",
                      "bg-background hover:scale-125",
                      isSelected ? "scale-150 ring-primary shadow-lg" : relationshipRingClass(marker.relationship_status),
                      markerFillClass(marker.priority)
                    )}
                  >
                    <MarkerShape type={marker.type} />
                  </button>
                );
              })}

              {filtered.length === 0 && !loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm bg-background/80 px-4 py-2 rounded-lg border border-border">
                    No institutions match your current filters
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-10 rounded-xl border border-border bg-background/90 backdrop-blur px-3 py-2 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Legend</p>
            <div className="flex flex-col gap-1 text-[10px]">
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1"><span className="text-xs text-foreground">●</span> School</span>
                <span className="flex items-center gap-1"><span className="text-xs text-foreground">■</span> College</span>
                <span className="flex items-center gap-1"><span className="text-xs text-foreground">◆</span> University</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-0.5 text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-2.5 rounded-full ring-2 ring-green-500 bg-background inline-block" /> Active</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded-full ring-2 ring-amber-400 bg-background inline-block" /> Prospect</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded-full ring-2 ring-blue-400 bg-background inline-block" /> Opportunity</span>
                <span className="flex items-center gap-1"><span className="size-2.5 rounded-full ring-2 ring-gray-300 bg-background inline-block" /> None</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right drawer — only shown when marker is selected */}
        {selected && (
          <div className="w-64 shrink-0">
            <InstitutionDrawer
              marker={selected}
              onClose={() => setSelected(null)}
              onCreateActivity={() => setComposerOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Activity composer */}
      <ActivityComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        relatedEntity={
          selected
            ? { type: "institution", id: selected.institution_id, name: selected.name }
            : undefined
        }
        onSave={(data) => {
          console.info("Activity logged:", data);
        }}
      />
    </div>
  );
}
