"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { getLeads } from "@/lib/api";
import type { Lead, LeadStage } from "@/lib/types";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  ChevronRightIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
} from "lucide-react";

// ── Education admissions funnel stages ────────────────────────────────────────
// These map to LeadStage values for the Education vertical
interface FunnelStage {
  id: LeadStage | string;  // custom label for Education vertical
  label: string;
  description: string;
  color: string;
  barColor: string;
}

const FUNNEL_STAGES: FunnelStage[] = [
  {
    id: "new",
    label: "New Enquiry",
    description: "First contact — student expressed interest",
    color: "text-blue-600 dark:text-blue-400",
    barColor: "bg-blue-500",
  },
  {
    id: "contacted",
    label: "Counselled",
    description: "Education counsellor has spoken with student",
    color: "text-cyan-600 dark:text-cyan-400",
    barColor: "bg-cyan-500",
  },
  {
    id: "qualified",
    label: "Course Selected",
    description: "Student has selected a course",
    color: "text-violet-600 dark:text-violet-400",
    barColor: "bg-violet-500",
  },
  {
    id: "follow_up",
    label: "Follow-up",
    description: "Awaiting student decision — follow-up scheduled",
    color: "text-amber-600 dark:text-amber-400",
    barColor: "bg-amber-500",
  },
  {
    id: "seat_attended",
    label: "Seat Attended",
    description: "Student attended demo / orientation",
    color: "text-orange-600 dark:text-orange-400",
    barColor: "bg-orange-500",
  },
  {
    id: "registration",
    label: "Registration",
    description: "Registration form completed and fee partial",
    color: "text-green-600 dark:text-green-400",
    barColor: "bg-green-500",
  },
  {
    id: "converted",
    label: "Enrolled",
    description: "Full fee paid and enrollment confirmed",
    color: "text-emerald-600 dark:text-emerald-400",
    barColor: "bg-emerald-600",
  },
];

// ── New Enquiry form ──────────────────────────────────────────────────────────
interface EnquiryForm {
  name: string;
  phone: string;
  email: string;
  source: string;
  course_interest: string;
}

const EMPTY_FORM: EnquiryForm = {
  name: "",
  phone: "",
  email: "",
  source: "walk_in",
  course_interest: "",
};

function NewEnquiryDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (form: EnquiryForm) => void;
}) {
  const [form, setForm] = useState<EnquiryForm>(EMPTY_FORM);

  function handleSave() {
    onSave(form);
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  const isValid = form.name.trim().length > 0 && form.phone.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Enquiry</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="enq-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="enq-name"
              placeholder="Student's full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="enq-phone">
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="enq-phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="enq-email">Email</Label>
            <Input
              id="enq-email"
              type="email"
              placeholder="student@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="enq-source">Source</Label>
            <Select
              value={form.source}
              onValueChange={(v) => setForm((f) => ({ ...f, source: v ?? "walk_in" }))}
            >
              <SelectTrigger id="enq-source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="walk_in">Walk In</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="website_form">Website Form</SelectItem>
                <SelectItem value="campaign">Campaign</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="enq-course">Course Interest</Label>
            <Input
              id="enq-course"
              placeholder="e.g. Python, Data Analytics, Tally…"
              value={form.course_interest}
              onChange={(e) =>
                setForm((f) => ({ ...f, course_interest: e.target.value }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Add Enquiry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Lead row ──────────────────────────────────────────────────────────────────
function LeadRow({ lead }: { lead: Lead }) {
  function fmtDate(d: string | null | undefined): string {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors px-4 cursor-pointer">
      {/* Avatar placeholder */}
      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-semibold">
        {(lead.person_name ?? "?")[0]?.toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{lead.person_name ?? "—"}</p>
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          {lead.person_phone && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <PhoneIcon className="size-3" />
              {lead.person_phone}
            </span>
          )}
          {lead.product && (
            <span className="text-xs text-muted-foreground truncate">
              {lead.product}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {lead.last_activity_at && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="size-3" />
            {fmtDate(lead.last_activity_at)}
          </span>
        )}
        <StatusBadge status={lead.stage} size="sm" />
        <ChevronRightIcon className="size-4 text-muted-foreground" />
      </div>
    </div>
  );
}

// ── Funnel stage card ─────────────────────────────────────────────────────────
function FunnelCard({
  stage,
  count,
  total,
  onClick,
  isActive,
}: {
  stage: FunnelStage;
  count: number;
  total: number;
  onClick: () => void;
  isActive: boolean;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-3 text-left transition-all hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        isActive
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-tight">{stage.label}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
            {stage.description}
          </p>
        </div>
        <span className={cn("text-2xl font-bold leading-none shrink-0", stage.color)}>
          {count}
        </span>
      </div>

      {/* Mini bar */}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", stage.barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">{pct}% of total</p>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdmissionsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all leads — we'll filter by vertical=Education on client
      // The mock API doesn't have vertical param on getLeads, so fetch all
      const res = await getLeads({ page: 1 });
      // Filter to education vertical
      const eduLeads = res.data.filter(
        (l) => l.vertical?.toLowerCase() === "education"
      );
      setLeads(eduLeads);
    } catch {
      setError("Failed to load admissions data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Build stage counts
  const stageCounts: Record<string, number> = {};
  for (const lead of leads) {
    stageCounts[lead.stage] = (stageCounts[lead.stage] ?? 0) + 1;
  }
  const totalLeads = leads.length;

  // Displayed leads: filter by active stage or show all
  const displayedLeads =
    activeStage && activeStage !== "all"
      ? leads.filter((l) => l.stage === activeStage)
      : leads;

  // Sort: newest last_activity first
  const sortedLeads = [...displayedLeads].sort((a, b) => {
    const ta = a.last_activity_at ? new Date(a.last_activity_at).getTime() : 0;
    const tb = b.last_activity_at ? new Date(b.last_activity_at).getTime() : 0;
    return tb - ta;
  });

  function handleEnquirySave(form: EnquiryForm) {
    console.info("New enquiry submitted:", form);
    // When backend is wired: POST /leads with vertical=Education
    loadLeads();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admissions Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Education vertical — enquiry to enrollment funnel
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gap-2 shrink-0"
        >
          <PlusIcon className="size-4" />
          New Enquiry
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <p className="text-muted-foreground text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={loadLeads}>
            Retry
          </Button>
        </div>
      )}

      {/* Funnel stepper */}
      {!error && (
        <>
          {/* Arrow stepper row */}
          <div className="flex items-center overflow-x-auto pb-1">
            {FUNNEL_STAGES.map((stage, idx) => (
              <React.Fragment key={stage.id}>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center shrink-0 px-3 py-2 rounded-lg border text-center min-w-[80px] transition-colors cursor-pointer",
                    activeStage === stage.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/30"
                  )}
                  onClick={() =>
                    setActiveStage((prev) =>
                      prev === stage.id ? null : stage.id
                    )
                  }
                >
                  {loading ? (
                    <Skeleton className="h-6 w-8 mx-auto" />
                  ) : (
                    <span className={cn("text-xl font-bold", stage.color)}>
                      {stageCounts[stage.id] ?? 0}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                    {stage.label}
                  </span>
                </div>
                {idx < FUNNEL_STAGES.length - 1 && (
                  <ChevronRightIcon className="size-4 text-muted-foreground shrink-0 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Detailed funnel cards */}
          {!loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {FUNNEL_STAGES.map((stage) => (
                <FunnelCard
                  key={stage.id}
                  stage={stage}
                  count={stageCounts[stage.id] ?? 0}
                  total={totalLeads}
                  isActive={activeStage === stage.id}
                  onClick={() =>
                    setActiveStage((prev) =>
                      prev === stage.id ? null : stage.id
                    )
                  }
                />
              ))}
            </div>
          )}

          {/* Loading state for cards */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          )}

          {/* Table */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <UserIcon className="size-4 text-muted-foreground" />
                  {activeStage
                    ? `${FUNNEL_STAGES.find((s) => s.id === activeStage)?.label ?? activeStage} — ${displayedLeads.length} leads`
                    : `All Education Leads — ${totalLeads}`}
                </span>
                {activeStage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setActiveStage(null)}
                  >
                    Clear filter
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col divide-y divide-border">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <Skeleton className="size-8 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : sortedLeads.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  {activeStage
                    ? "No leads in this stage."
                    : "No education leads yet. Add a new enquiry to get started."}
                </div>
              ) : (
                sortedLeads.map((lead) => (
                  <LeadRow key={lead._id} lead={lead} />
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* New Enquiry Dialog */}
      <NewEnquiryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleEnquirySave}
      />
    </div>
  );
}
