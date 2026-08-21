"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getLead, convertLeadToOpportunity } from "@/lib/api";
import type { Lead, LeadStage } from "@/lib/types";
import { RecordHeader } from "@/components/crm/record-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/crm/status-badge";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ActivityIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  BuildingIcon,
  TagIcon,
  CalendarIcon,
  TrendingUpIcon,
} from "lucide-react";
import { LeadForm } from "@/components/crm/lead-form";
import { ActivityComposer } from "@/components/crm/activity-composer";

const PIPELINE_STAGES: { stage: LeadStage; label: string }[] = [
  { stage: "new", label: "New" },
  { stage: "contacted", label: "Contacted" },
  { stage: "qualified", label: "Qualified" },
  { stage: "converted", label: "Converted" },
  { stage: "lost", label: "Lost" },
];

function PipelineStepper({ currentStage }: { currentStage: LeadStage }) {
  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.stage === currentStage);
  const isLost = currentStage === "lost";

  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {PIPELINE_STAGES.filter((s) => s.stage !== "lost").map((s, idx) => {
        const stepIndex = PIPELINE_STAGES.findIndex((p) => p.stage === s.stage);
        const isActive = stepIndex === currentIndex;
        const isPast = !isLost && stepIndex < currentIndex;
        const isFuture = !isPast && !isActive;

        return (
          <React.Fragment key={s.stage}>
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                isActive && !isLost
                  ? "bg-primary text-primary-foreground"
                  : isPast
                  ? "bg-primary/20 text-primary"
                  : isFuture
                  ? "bg-muted text-muted-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isActive && !isLost ? "bg-primary-foreground" : isPast ? "bg-primary" : "bg-muted-foreground"
                )}
              />
              {s.label}
            </div>
            {idx < PIPELINE_STAGES.filter((s) => s.stage !== "lost").length - 1 && (
              <ArrowRightIcon className="size-3.5 text-muted-foreground/50 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
      {isLost && (
        <>
          <ArrowRightIcon className="size-3.5 text-muted-foreground/50 shrink-0" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <span className="size-1.5 rounded-full bg-red-500" />
            Lost
          </div>
        </>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const colorClass =
    score >= 75
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300"
      : score >= 50
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-sm font-bold",
        colorClass
      )}
    >
      <TrendingUpIcon className="size-3.5" />
      {score} / 100
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

function LeadSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Skeleton className="size-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  useEffect(() => {
    if (!leadId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getLead(leadId)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("Lead not found.");
          return;
        }
        setLead(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load lead:", err);
          setError("Failed to load lead. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  if (loading) return <LeadSkeleton />;

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <p className="text-muted-foreground">{error ?? "Lead not found."}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const subtitle = `${lead.vertical} · ${lead.product}`;

  return (
    <div className="flex flex-col gap-6 p-6">
      <RecordHeader
        title={lead.person_name ?? "Unknown Person"}
        subtitle={subtitle}
        badges={[
          { label: lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1), variant: "outline" },
        ]}
        backHref="/leads"
        actions={[
          {
            label: "Convert to Opportunity",
            variant: "default",
            onClick: () => setConvertOpen(true),
          },
          {
            label: "Log Activity",
            icon: ActivityIcon,
            variant: "outline",
            onClick: () => setActivityOpen(true),
          },
        ]}
      />

      {/* Pipeline stepper */}
      <Card>
        <CardContent className="py-3 px-4">
          <PipelineStepper currentStage={lead.stage} />
        </CardContent>
      </Card>

      {/* Detail cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lead Info */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Lead Info</CardTitle>
              <ScoreBadge score={lead.score} />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col">
            <InfoRow icon={TagIcon} label="Source" value={lead.source.replace(/_/g, " ")} />
            <InfoRow icon={TagIcon} label="Vertical" value={lead.vertical} />
            <InfoRow icon={TagIcon} label="Product" value={lead.product} />
            <InfoRow icon={CalendarIcon} label="Next Action" value={lead.next_action} />
            <div className="flex items-start gap-3 py-2.5">
              <TagIcon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge status={lead.status} size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Person Info */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold">Person Info</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col">
            <InfoRow icon={UserIcon} label="Name" value={lead.person_name} />
            <InfoRow icon={MailIcon} label="Email" value={lead.person_email} />
            <InfoRow icon={PhoneIcon} label="Phone" value={lead.person_phone} />
          </CardContent>
        </Card>

        {/* Organization Info */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold">Organization</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col">
            {lead.organization_name ? (
              <InfoRow
                icon={BuildingIcon}
                label="Organization"
                value={lead.organization_name}
              />
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                No organization linked.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Owner & Conversion */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold">Assignment</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col">
            <InfoRow icon={UserIcon} label="Owner" value={lead.owner_name} />
            {lead.converted_to_opportunity_id && (
              <InfoRow
                icon={ArrowRightIcon}
                label="Converted Opportunity"
                value={lead.converted_to_opportunity_id}
              />
            )}
            <InfoRow
              icon={CalendarIcon}
              label="Last Activity"
              value={
                lead.last_activity_at
                  ? new Date(lead.last_activity_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : null
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Activity composer */}
      <ActivityComposer
        open={activityOpen}
        onOpenChange={setActivityOpen}
        relatedEntity={{ type: "lead", id: lead._id, name: lead.person_name ?? "Lead" }}
        onSave={(data) => {
          console.log("Log activity:", data);
          // TODO: call POST /activities API
        }}
      />

      {/* Convert to Opportunity dialog */}
      <LeadForm
        mode="convert"
        open={convertOpen}
        onOpenChange={setConvertOpen}
        lead={lead}
        onConvert={async (data) => {
          await convertLeadToOpportunity(lead._id, data);
          setConvertOpen(false);
        }}
      />
    </div>
  );
}
