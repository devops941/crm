"use client";

import * as React from "react";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColumnDef<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  rows: T[];
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSortChange?: (key: string) => void;
  className?: string;
}

const SKELETON_ROWS = 6;

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  page,
  totalPages,
  onPageChange,
  onRowClick,
  loading = false,
  emptyMessage = "No records found.",
  sortKey,
  sortDir,
  onSortChange,
  className,
}: DataTableProps<T>) {
  function SortIcon({ colKey }: { colKey: string }) {
    if (colKey !== sortKey) return <ChevronsUpDownIcon className="size-3 text-muted-foreground/50" />;
    return sortDir === "asc"
      ? <ChevronUpIcon className="size-3 text-foreground" />
      : <ChevronDownIcon className="size-3 text-foreground" />;
  }

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.sortable ? (
                    <button
                      onClick={() => onSortChange?.(col.key)}
                      className="inline-flex items-center gap-1 font-medium text-foreground hover:text-foreground/80 transition-colors"
                    >
                      {col.label}
                      <SortIcon colKey={col.key} />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, ri) => (
                <TableRow key={ri} className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-4 w-full max-w-[160px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, ri) => (
                <TableRow
                  key={(row._id as string) ?? ri}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-3">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
