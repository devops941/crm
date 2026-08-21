"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Column {
  key: string;
  label: string;
}

interface ExportButtonProps {
  // Accept any object array; we index by string key internally
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  filename: string;
  columns: Column[];
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Wrap in quotes if contains comma, quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function ExportButton({ data, filename, columns }: ExportButtonProps) {
  function handleExport() {
    // Build header row
    const header = columns.map((c) => escapeCsvValue(c.label)).join(",");

    // Build data rows
    const rows = data.map((row) =>
      columns.map((c) => escapeCsvValue(row[c.key])).join(",")
    );

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <DownloadIcon className="size-4 mr-1.5" />
      Export CSV
    </Button>
  );
}
