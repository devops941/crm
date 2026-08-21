"use client";

import * as React from "react";
import { useState } from "react";
import type { Activity, ActivityType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: Activity[];
  loading?: boolean;
  className?: string;
}

interface FilterChip {
  label: string;
  types: ActivityType[] | null; // null = all
}

const FILTER_CHIPS: FilterChip[] = [
  { label: "All", types: null },
  { label: "Calls", types: ["call", "whatsapp"] },
  { label: "Meetings", types: ["meeting"] },
  { label: "Visits", types: ["visit"] },
  { label: "Emails", types: ["email"] },
  { label: "Proposals", types: ["proposal"] },
];

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(ts: string): string {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function typeLabel(type: ActivityType): string {
  const labels: Partial<Record<ActivityType, string>> = {
    call: "Call",
    whatsapp: "WhatsApp",
    email: "Email",
    meeting: "Meeting",
    visit: "Visit",
    workshop: "Workshop",
    training: "Training",
    event: "Event",
    follow_up: "Follow-up",
    proposal: "Proposal",
    payment: "Payment",
    mou_activity: "MoU Activity",
    research: "Research",
    survey: "Survey",
    other: "Other",
  };
  return labels[type] ?? type;
}

const TYPE_DOT_COLOR: Partial<Record<ActivityType, string>> = {
  call: "bg-blue-500",
  whatsapp: "bg-green-500",
  email: "bg-violet-500",
  meeting: "bg-amber-500",
  visit: "bg-orange-500",
  proposal: "bg-primary",
  follow_up: "bg-cyan-500",
  other: "bg-muted-foreground",
};

export function ActivityTimeline({
  activities,
  loading = false,
  className,
}: ActivityTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const chip = FILTER_CHIPS.find((c) => c.label === activeFilter) ?? FILTER_CHIPS[0];
  const filtered = chip.types
    ? activities.filter((a) => chip.types!.includes(a.type))
    : activities;

  // Sort descending by timestamp
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1.5">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => setActiveFilter(chip.label)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              activeFilter === chip.label
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-24 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full max-w-xs" />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No activity yet — log the first touchpoint.
        </div>
      ) : (
        <ol className="relative flex flex-col gap-0">
          {sorted.map((activity, idx) => {
            const dotColor = TYPE_DOT_COLOR[activity.type] ?? "bg-muted-foreground";
            const isLast = idx === sorted.length - 1;
            return (
              <li key={activity._id} className="flex gap-4 pb-6 relative">
                {/* Left: timestamp column */}
                <div className="w-28 shrink-0 text-right">
                  <p className="font-mono text-[11px] text-muted-foreground leading-tight">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/70">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>

                {/* Vertical line + dot */}
                <div className="flex flex-col items-center">
                  <span className={cn("size-2.5 rounded-full mt-1 shrink-0 ring-2 ring-background", dotColor)} />
                  {!isLast && (
                    <span className="w-px flex-1 bg-border mt-1" />
                  )}
                </div>

                {/* Right: content */}
                <div className="flex-1 min-w-0 pb-0.5">
                  <p className="text-sm font-semibold leading-tight">
                    {typeLabel(activity.type)}
                    {activity.actor_name && (
                      <span className="font-normal text-muted-foreground">
                        {" "}by {activity.actor_name}
                      </span>
                    )}
                  </p>
                  {activity.outcome && (
                    <p className="text-sm text-foreground/80 mt-0.5">{activity.outcome}</p>
                  )}
                  {activity.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                      {activity.notes}
                    </p>
                  )}
                  {activity.next_action && (
                    <p className="text-xs text-primary mt-1">
                      Next: {activity.next_action}
                    </p>
                  )}
                  {activity.duration !== undefined && activity.duration !== null && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {activity.duration} min
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
