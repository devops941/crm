"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabDef {
  id: string;
  label: string;
  count?: number;
  badge?: string;
}

interface RecordTabsProps {
  tabs: TabDef[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function RecordTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: RecordTabsProps) {
  return (
    <div
      className={cn(
        "flex overflow-x-auto border-b border-border gap-0 scrollbar-none",
        className
      )}
      role="tablist"
      aria-orientation="horizontal"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-t-sm",
              isActive
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full text-xs px-1.5 py-0.5 min-w-[1.25rem] font-normal",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs px-1.5 py-0.5">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
