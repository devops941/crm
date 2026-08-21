"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getOpportunity, getActivities } from "@/lib/api";
import type { Opportunity, Activity } from "@/lib/types";
import { RecordHeader } from "@/components/crm/record-header";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { StatusBadge } from "@/components/crm/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ActivityIcon,
  TrophyIcon,
  IndianRupeeIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  LinkIcon,
  FileTextIcon,
  TrendingUpIcon,
} from "lucide-react";

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function ProbabilityBar({ probability }: { probability: number }) {
  const color =
    probability >= 70 ? "bg-green-500" : probability >= 40 ? "bg-amber-500" : "bg-muted-foreground";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${probability}%` }}
        />
      </div>
      <span className="text-xs font-mono font-semibold text-muted-foreground">{probability}%</span>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (value == null) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("text-sm font-medium truncate", mono && "font-mono")}>{value}</p>
      </div>
    </div>
  );
}

function OppSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Skeleton className="size-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export default function OpportunityDetailPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!opportunityId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getOpportunity(opportunityId)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("Opportunity not found.");
          return;
        }
        setOpp(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load opportunity:", err);
          setError("Failed to load opportunity. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [opportunityId]);

  useEffect(() => {
    if (!opportunityId) return;
    let cancelled = false;
    setActivitiesLoading(true);

    getActivities({ entity_id: opportunityId })
      .then((res) => {
        if (!cancelled) setActivities(res.data);
      })
      .catch((err) => console.error("Failed to load activities:", err))
      .finally(() => {
        if (!cancelled) setActivitiesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [opportunityId]);

  if (loading) return <OppSkeleton />;

  if (error || !opp) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <p className="text-muted-foreground">{error ?? "Opportunity not found."}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const title = `${opp.account_name ?? "Account"} — ${opp.product}`;
  const subtitle = `${opp.stage.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} · ${opp.probability}% probability`;

  const closeDate = opp.expected_close_date
    ? new Date(opp.expected_close_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const isWon = opp.stage === "won" || opp.stage === "delivering";

  return (
    <div className="flex flex-col gap-6 p-6">
      <RecordHeader
        title={title}
        subtitle={subtitle}
        badges={[
          { label: opp.stage.replace(/_/g, " "), variant: "outline" },
          ...(opp.vertical ? [{ label: opp.vertical, variant: "secondary" as const }] : []),
        ]}
        backHref="/opportunities"
        actions={[
          {
            label: "Log Activity",
            icon: ActivityIcon,
            variant: "outline",
            onClick: () => {},
          },
          {
            label: isWon ? "Mark Delivered" : "Mark Won",
            icon: TrophyIcon,
            variant: "default",
            onClick: () => {},
          },
        ]}
      />

      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Deal Card */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <IndianRupeeIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Deal</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="py-2.5 border-b border-border">
              <p className="text-xs text-muted-foreground">Value</p>
              <p className="text-xl font-bold tracking-tight">{formatINR(opp.value)}</p>
            </div>
            <div className="py-2.5 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1.5">Probability</p>
              <ProbabilityBar probability={opp.probability} />
            </div>
            <InfoItem icon={CalendarIcon} label="Expected Close" value={closeDate} />
            <InfoItem icon={TrendingUpIcon} label="Source" value={opp.source} />
            {opp.outcome && (
              <div className="py-2.5">
                <p className="text-xs text-muted-foreground mb-1">Outcome</p>
                <StatusBadge status={opp.outcome} size="sm" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Card */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <LinkIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Related</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-1">
            <InfoItem
              icon={BuildingIcon}
              label={opp.account_type === "institution" ? "Institution" : "Organization"}
              value={opp.account_name}
            />
            <InfoItem icon={UserIcon} label="Contact" value={opp.contact_name} />
            <InfoItem icon={UserIcon} label="Owner" value={opp.owner_name} />
            <InfoItem icon={BuildingIcon} label="Vertical" value={opp.vertical} />
          </CardContent>
        </Card>

        {/* Delivery Chain Card */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <FileTextIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Delivery Chain</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-2">
            {/* Proposal */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">Proposal</span>
              {opp.proposal_doc_id ? (
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                  <FileTextIcon className="size-3" />
                  Attached
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
            {/* Contract */}
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">Contract</span>
              {opp.contract_doc_id ? (
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                  <FileTextIcon className="size-3" />
                  Attached
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
            {/* Project status */}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-muted-foreground">Project</span>
              {opp.stage === "delivering" || opp.stage === "won" ? (
                <StatusBadge status="in_progress" size="sm" />
              ) : (
                <span className="text-xs text-muted-foreground">Not started</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ActivityTimeline activities={activities} loading={activitiesLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
