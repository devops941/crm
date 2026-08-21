"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDef {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters?: FilterDef[];
  values?: Record<string, string>;
  onChange?: (id: string, value: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  className?: string;
}

export function FilterBar({
  filters = [],
  values = {},
  onChange,
  searchPlaceholder = "Search…",
  searchValue = "",
  onSearchChange,
  className,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Search input */}
      {onSearchChange !== undefined && (
        <div className="relative min-w-[180px] flex-1 max-w-xs">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      )}

      {/* Facet selects */}
      {filters.map((filter) => (
        <div key={filter.id} className="inline-flex">
          <Select
            value={values[filter.id] ?? ""}
            onValueChange={(val) => onChange?.(filter.id, !val || val === "__all__" ? "" : val)}
          >
            <SelectTrigger size="sm" className="min-w-[130px] w-auto h-8 text-sm">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All {filter.label}</SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
