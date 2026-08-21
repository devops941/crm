"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMoU } from "@/lib/api";
import type { MoU, MoUStatus } from "@/lib/types";
import { RecordHeader } from "@/components/crm/record-header";
import { StatusBadge } from "@/components/crm/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RefreshCwIcon,
  UploadIcon,
  FileTextIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  CircleIcon,
} from "lucide-react";

// ── Lifecycle stepper ─────────────────────────────────────────────────────────
const LIFECYCLE: MoUStatus[] = [
  "proposed",
  "negotiating",
  "approved",
  "signed",
  "active",
  "expiring",
  "expired",
];

const LIFECYCLE_LABELS: Record<MoUStatus, string> = {
  proposed: "Proposed",
  negotiating: "Negotiating",
  approved: "Approved",
  signed: "Signed",
  active: "Active",
  expiring: "Expiring",
  expired: "Expired",
  renewed: "Renewed",
};

function LifecycleStepper({ current }: { current: MoUStatus }) {
  const currentIdx = LIFECYCLE.indexOf(current);
  const isRenewed = current === "renewed";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {LIFECYCLE.map((step, idx) => {
          const isPast = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isFuture = idx > currentIdx;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center shrink-0 min-w-[68px]">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center transition-colors",
                    isPast
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? step === "expiring"
                        ? "bg-amber-500 text-white ring-2 ring-amber-300"
                        : step === "expired"
                        ? "bg-red-500 text-white ring-2 ring-red-300"
                        : "bg-primary text-primary-foreground ring-2 ring-primary/30"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isPast ? (
                    <CheckCircle2Icon className="size-4" />
                  ) : isCurrent ? (
                    <CircleIcon className="size-4 fill-current" />
                  ) : (
                    <CircleIcon className="size-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 text-center leading-tight",
                    isCurrent ? "font-semibold text-foreground" : isFuture ? "text-muted-foreground" : "text-muted-foreground"
                  )}
                >
                  {LIFECYCLE_LABELS[step]}
                </span>
              </div>
              {idx < LIFECYCLE.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mt-[-1rem] min-w-[16px]",
                    idx < currentIdx ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {isRenewed && (
        <p className="text-xs text-primary font-medium mt-1">
          This MoU has been renewed.
        </p>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysUntilExpiry(endDate: string): number {
  return Math.round((new Date(endDate).getTime() - Date.now()) / 86_400_000);
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Skeleton className="size-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MoUDetailPage() {
  const { mouId } = useParams<{ mouId: string }>();
  const [mou, setMou] = useState<MoU | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mouId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getMoU(mouId)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("MoU not found.");
          return;
        }
        setMou(data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Failed to load MoU. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [mouId]);

  if (loading) return <PageSkeleton />;

  if (error || !mou) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <p className="text-muted-foreground">{error ?? "MoU not found."}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const entityName =
    mou.institution_name ?? mou.organization_name ?? "Unknown Entity";
  const title = `MoU — ${entityName}`;
  const daysLeft = daysUntilExpiry(mou.end_date);
  const isExpiring = mou.status === "expiring" || (daysLeft > 0 && daysLeft <= 60);

  return (
    <div className="flex flex-col gap-6 p-6">
      <RecordHeader
        title={title}
        subtitle={`Vertical: ${mou.vertical} · Signed: ${fmtDate(mou.start_date)}`}
        badges={[
          { label: LIFECYCLE_LABELS[mou.status], variant: "outline" },
          ...(mou.strategic_value
            ? [{ label: `${mou.strategic_value} strategic value`, variant: "secondary" as const }]
            : []),
        ]}
        backHref="/mous"
        actions={[
          {
            label: "Start Renewal",
            icon: RefreshCwIcon,
            variant: "outline",
            onClick: () => {},
          },
          {
            label: "Upload Document",
            icon: UploadIcon,
            variant: "outline",
            onClick: () => {},
          },
        ]}
      />

      {/* Lifecycle stepper */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">MoU Lifecycle</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <LifecycleStepper current={mou.status} />
        </CardContent>
      </Card>

      {/* Detail + Renewal grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MoU Details */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileTextIcon className="size-4 text-muted-foreground" />
              MoU Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground shrink-0">Scope</dt>
                <dd className="font-medium text-right">{mou.scope}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd><StatusBadge status={mou.status} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Signed / Start Date</dt>
                <dd className="font-medium">{fmtDate(mou.start_date)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Expiry Date</dt>
                <dd
                  className={cn(
                    "font-medium",
                    daysLeft < 0
                      ? "text-red-600 dark:text-red-400"
                      : daysLeft < 60
                      ? "text-amber-600 dark:text-amber-400"
                      : ""
                  )}
                >
                  {fmtDate(mou.end_date)}
                  {daysLeft >= 0 && daysLeft < 60 && (
                    <span className="ml-1 text-xs">({daysLeft}d left)</span>
                  )}
                  {daysLeft < 0 && (
                    <span className="ml-1 text-xs">(expired {Math.abs(daysLeft)}d ago)</span>
                  )}
                </dd>
              </div>
              {mou.commercial_value !== undefined && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Commercial Value</dt>
                  <dd className="font-semibold text-primary">
                    ₹{mou.commercial_value.toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
              {mou.strategic_value && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Strategic Value</dt>
                  <dd className="font-medium capitalize">{mou.strategic_value}</dd>
                </div>
              )}
              {mou.owner_name && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Owner</dt>
                  <dd className="font-medium">{mou.owner_name}</dd>
                </div>
              )}
              {mou.document_id && (
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Document</dt>
                  <dd>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs gap-1">
                      <FileTextIcon className="size-3" />
                      View
                    </Button>
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        {/* Renewal workflow */}
        <div className="flex flex-col gap-4">
          {isExpiring && (
            <Card className="border-amber-400/60 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader className="pb-3 border-b border-amber-200 dark:border-amber-700/40">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <AlertTriangleIcon className="size-4" />
                  Renewal Required
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {daysLeft > 0
                    ? `This MoU expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Draft renewal terms to avoid a lapse.`
                    : `This MoU expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago. Begin renewal to restore the formal partnership.`}
                </p>
                <Button
                  className="mt-3 gap-2"
                  size="sm"
                  onClick={() => {}}
                >
                  <RefreshCwIcon className="size-3.5" />
                  Start Renewal
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Activities covered */}
          {mou.activities_covered && mou.activities_covered.length > 0 && (
            <Card>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold">Activities Covered</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <ul className="flex flex-col gap-1.5">
                  {mou.activities_covered.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2Icon className="size-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* If no renewal needed and no activities, show a status card */}
          {!isExpiring && (!mou.activities_covered || mou.activities_covered.length === 0) && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                MoU is in good standing. No renewal action required.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
