"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { globalSearch } from "@/lib/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SearchIcon, LoaderCircleIcon } from "lucide-react";

interface SearchResult {
  entity_type: string;
  entity_id: string;
  title: string;
  subtitle?: string;
}

const ENTITY_ROUTE_MAP: Record<string, string> = {
  person: "/people",
  organization: "/organizations",
  institution: "/institutions",
  lead: "/leads",
  opportunity: "/opportunities",
  mou: "/mous",
  course: "/education/courses",
  student: "/education/students",
};

const ENTITY_BADGE_COLOR: Record<string, string> = {
  person: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700",
  organization: "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700",
  institution: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700",
  lead: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700",
  opportunity: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700",
  mou: "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 border-sky-300 dark:border-sky-700",
  course: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-700",
  student: "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700",
};

function entityLabel(type: string): string {
  const labels: Record<string, string> = {
    person: "Person",
    organization: "Org",
    institution: "Institution",
    lead: "Lead",
    opportunity: "Opportunity",
    mou: "MoU",
    course: "Course",
    student: "Student",
  };
  return labels[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

function entityRoute(type: string, id: string): string {
  const base = ENTITY_ROUTE_MAP[type] ?? "/";
  return `${base}/${id}`;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    globalSearch(debouncedQuery)
      .then((res) => {
        if (!cancelled) {
          setResults(res as SearchResult[]);
          setActiveIndex(-1);
        }
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Group results by entity_type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.entity_type]) acc[r.entity_type] = [];
    acc[r.entity_type].push(r);
    return acc;
  }, {});

  const flatResults = results;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      resultRefs.current[activeIndex]?.click();
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
    }
  }

  const showDropdown = open && query.length >= 2;

  return (
    // Outer wrapper is the Popover trigger zone
    <div className="relative w-full">
      {/* Input row */}
      <div className="relative">
        {loading ? (
          <LoaderCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin pointer-events-none" />
        ) : (
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        )}
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 2) setOpen(true);
            else setOpen(false);
          }}
          onFocus={() => {
            if (query.length >= 2) setOpen(true);
          }}
          onBlur={(e) => {
            // Delay close so clicks on results register
            setTimeout(() => setOpen(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search people, orgs, institutions, MoUs…"
          className="pl-9 h-9 text-sm bg-muted/50 border-transparent focus:border-border"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {/* Dropdown panel */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-lg bg-popover shadow-xl ring-1 ring-foreground/10 overflow-hidden">
          {loading ? (
            <div className="flex flex-col gap-2 p-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto py-1">
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {entityLabel(type)}s
                  </div>
                  {items.map((result) => {
                    const globalIdx = flatResults.indexOf(result);
                    const isActive = globalIdx === activeIndex;
                    const href = entityRoute(result.entity_type, result.entity_id);

                    return (
                      <Link
                        key={result.entity_id}
                        href={href}
                        ref={(el) => { resultRefs.current[globalIdx] = el; }}
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                        }}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 text-sm transition-colors outline-none",
                          isActive ? "bg-muted" : "hover:bg-muted/60"
                        )}
                      >
                        <span className="flex-1 min-w-0">
                          <span className="block font-medium truncate">{result.title}</span>
                          {result.subtitle && (
                            <span className="block text-xs text-muted-foreground truncate mt-0.5">
                              {result.subtitle}
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium shrink-0",
                            ENTITY_BADGE_COLOR[result.entity_type] ?? "bg-muted border-border text-muted-foreground"
                          )}
                        >
                          {entityLabel(result.entity_type)}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
