import * as React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

type ColorScheme = "green" | "amber" | "gray" | "red" | "blue";

const STATUS_COLOR_MAP: Record<string, ColorScheme> = {
  // Green — active / positive outcomes
  active: "green",
  active_relationship: "green",
  won: "green",
  enrolled: "green",
  won_delivered: "green",

  // Amber — in-progress / prospect
  prospect: "amber",
  contacted: "amber",
  proposed: "amber",
  negotiating: "amber",
  active_opportunity: "amber",
  open: "amber",
  in_progress: "amber",

  // Gray — neutral / no engagement
  no_relationship: "gray",
  none: "gray",
  inactive: "gray",
  expired: "gray",
  lost: "gray",
  ended: "gray",

  // Red — urgent / at risk
  expiring: "red",
  overdue: "red",
  at_risk: "red",
  overdue_payment: "red",

  // Blue — signed / formal agreement
  mou: "blue",
  signed: "blue",
  approved: "blue",
  renewed: "blue",
};

const COLOR_CLASSES: Record<ColorScheme, string> = {
  green: "border-green-500 text-green-700 dark:text-green-400",
  amber: "border-amber-500 text-amber-700 dark:text-amber-400",
  gray: "border-border text-muted-foreground",
  red: "border-red-500 text-red-700 dark:text-red-400",
  blue: "border-blue-500 text-blue-700 dark:text-blue-400",
};

function formatStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const normalised = status.toLowerCase().trim();
  const scheme = STATUS_COLOR_MAP[normalised] ?? "gray";
  const colorClass = COLOR_CLASSES[scheme];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
        size === "sm" ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-xs",
        colorClass,
        className
      )}
    >
      {formatStatusLabel(status)}
    </span>
  );
}
