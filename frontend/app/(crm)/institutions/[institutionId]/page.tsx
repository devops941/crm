"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getInstitution360, getActivities, getEnrollments, getCourses } from "@/lib/api";
import type { Organization, Activity, MoU, Opportunity, Relationship, Enrollment, Course } from "@/lib/types";
import { RecordHeader } from "@/components/crm/record-header";
import { RecordTabs } from "@/components/crm/record-tabs";
import { StatusBadge } from "@/components/crm/status-badge";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { ContactCard } from "@/components/crm/contact-card";
import { AiInsightCard } from "@/components/crm/ai-insight-card";
import { ActivityComposer } from "@/components/crm/activity-composer";
import { DocumentUpload } from "@/components/crm/document-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PhoneIcon,
  MessageCircleIcon,
  MailIcon,
  FileTextIcon,
  PlusIcon,
  BuildingIcon,
  UsersIcon,
  CalendarIcon,
  TrendingUpIcon,
} from "lucide-react";

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TAB_IDS = [
  "overview",
  "timeline",
  "contacts",
  "mous",
  "opportunities",
  "programs",
  "students",
  "documents",
] as const;
type TabId = (typeof TAB_IDS)[number];

const TAB_LABELS: Record<TabId, string> = {
  overview: "Overview",
  timeline: "Timeline",
  contacts: "Contacts",
  mous: "MoUs",
  opportunities: "Opportunities",
  programs: "Programs",
  students: "Students / Alumni",
  documents: "Documents",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Skeleton className="size-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

// ── Relationship strength dots ────────────────────────────────────────────────
function StrengthDots({ strength }: { strength: "weak" | "moderate" | "strong" | undefined }) {
  const levels = { weak: 1, moderate: 2, strong: 3 };
  const filled = strength ? levels[strength] : 0;
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cn(
            "size-2.5 rounded-full",
            n <= filled ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

// ── MoU item ──────────────────────────────────────────────────────────────────
function MoUItem({ mou }: { mou: MoU }) {
  function fmtDate(d: string) {
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{mou._id.slice(-8)}</span>
          <StatusBadge status={mou.status} size="sm" />
        </div>
        <p className="text-sm font-medium mt-1 truncate">{mou.scope}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {fmtDate(mou.start_date)} → {fmtDate(mou.end_date)}
        </p>
        {mou.activities_covered && mou.activities_covered.length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Activities: {mou.activities_covered.join(", ")}
          </p>
        )}
      </div>
      {mou.commercial_value !== undefined && (
        <span className="text-sm font-semibold text-foreground shrink-0">
          ₹{mou.commercial_value.toLocaleString("en-IN")}
        </span>
      )}
    </div>
  );
}

// ── Opportunity item ──────────────────────────────────────────────────────────
function OppItem({ opp }: { opp: Opportunity }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{opp.product}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <StatusBadge status={opp.stage} size="sm" />
          <span className="text-xs text-muted-foreground capitalize">{opp.vertical}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold">
          ₹{opp.value.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-muted-foreground">{opp.probability}% probability</p>
      </div>
    </div>
  );
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function OverviewTab({
  org,
  relationships,
  opportunities,
  mous,
  onCreateActivity,
}: {
  org: Organization;
  relationships: Relationship[];
  opportunities: Opportunity[];
  mous: MoU[];
  onCreateActivity: () => void;
}) {
  const details = org.institution_details;
  const activeMous = mous.filter((m) => m.status === "active" || m.status === "signed");
  const openOpps = opportunities.filter(
    (o) => !["won", "lost"].includes(o.stage)
  );
  const pipelineValue = openOpps.reduce((s, o) => s + o.value, 0);
  const strongestRel = relationships.sort((a, b) => {
    const order = { strong: 0, moderate: 1, weak: 2 };
    return (order[a.strength ?? "weak"] ?? 2) - (order[b.strength ?? "weak"] ?? 2);
  })[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left column */}
      <div className="flex flex-col gap-4">
        {/* Institution profile */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BuildingIcon className="size-4 text-muted-foreground" />
              Institution Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            {details ? (
              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium capitalize">{details.institution_type.replace(/_/g, " ")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Management</dt>
                  <dd className="font-medium capitalize">{details.management_type}</dd>
                </div>
                {details.established_year && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Est. Year</dt>
                    <dd className="font-medium">{details.established_year}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">District</dt>
                  <dd className="font-medium">{details.district}</dd>
                </div>
                {details.taluk && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Taluk</dt>
                    <dd className="font-medium">{details.taluk}</dd>
                  </div>
                )}
                {details.address && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground shrink-0">Address</dt>
                    <dd className="font-medium text-right text-xs">{details.address}</dd>
                  </div>
                )}
                {details.student_count !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground flex items-center gap-1">
                      <UsersIcon className="size-3" /> Students
                    </dt>
                    <dd className="font-medium">{details.student_count.toLocaleString("en-IN")}</dd>
                  </div>
                )}
                {details.department_count !== undefined && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Departments</dt>
                    <dd className="font-medium">{details.department_count}</dd>
                  </div>
                )}
                {details.external_identifier && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Code (AISHE/UDISE)</dt>
                    <dd className="font-mono text-xs font-medium">{details.external_identifier}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">No institution details on record.</p>
            )}
          </CardContent>
        </Card>

        {/* Relationship summary */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUpIcon className="size-4 text-muted-foreground" />
              Relationship Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <dl className="flex flex-col gap-2 text-sm">
              {strongestRel && (
                <>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground">Strength</dt>
                    <dd><StrengthDots strength={strongestRel.strength} /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Relationship</dt>
                    <dd className="font-medium capitalize">{strongestRel.relationship_type.replace(/_/g, " ")}</dd>
                  </div>
                </>
              )}
              {org.last_activity_at && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground flex items-center gap-1">
                    <CalendarIcon className="size-3" /> Last Activity
                  </dt>
                  <dd className="font-medium">
                    {new Date(org.last_activity_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Open Opportunities</dt>
                <dd className="font-medium">{openOpps.length}</dd>
              </div>
              {pipelineValue > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Pipeline Value</dt>
                  <dd className="font-semibold text-primary">
                    ₹{pipelineValue.toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Active MoUs</dt>
                <dd className="font-medium">{activeMous.length}</dd>
              </div>
              {org.mou_status && org.mou_status !== "none" && (
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">MoU Status</dt>
                  <dd><StatusBadge status={org.mou_status} size="sm" /></dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4">
        <AiInsightCard
          title={
            org.relationship_status === "no_relationship"
              ? "This institution has no prior engagement — a strong candidate for first contact."
              : org.relationship_status === "prospect"
              ? "Prospect identified. Schedule a visit to advance to Contacted."
              : "Relationship is active. Consider proposing an MoU to formalise partnership."
          }
          reasons={[
            org.institution_details?.student_count
              ? `Large institution with ${org.institution_details.student_count.toLocaleString("en-IN")} students — high reach potential.`
              : "Institution size data not yet captured.",
            org.strategic_priority === "high"
              ? "Marked as high strategic priority."
              : `Strategic priority: ${org.strategic_priority ?? "not set"}.`,
            openOpps.length > 0
              ? `${openOpps.length} open opportunity in the pipeline.`
              : "No open opportunities yet — consider creating one.",
          ]}
          recommendedAction={
            org.relationship_status === "no_relationship"
              ? "Log an initial call or visit to begin engagement."
              : org.relationship_status === "prospect"
              ? "Schedule a campus visit. Bring program brochure and placement records."
              : "Prepare a draft MoU and send it for review."
          }
          onCreateActivity={onCreateActivity}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InstitutionDetailPage() {
  const { institutionId } = useParams<{ institutionId: string }>();

  const [org, setOrg] = useState<Organization | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mous, setMous] = useState<MoU[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    if (!institutionId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getInstitution360(institutionId),
      getEnrollments(),
      getCourses(),
    ])
      .then(([data, enrRes, courseRes]) => {
        if (cancelled) return;
        if (!data) {
          setError("Institution not found.");
          return;
        }
        setOrg(data.organization);
        setRelationships(data.relationships);
        setActivities(data.activities);
        setMous(data.mous);
        setOpportunities(data.opportunities);
        // All enrollments (institution linkage is indirect — show all for now)
        setEnrollments(enrRes.data);
        setCourses(courseRes.data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Failed to load institution. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [institutionId]);

  if (loading) return <PageSkeleton />;

  if (error || !org) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <p className="text-muted-foreground">{error ?? "Institution not found."}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const details = org.institution_details;
  const subtitle = [
    details?.institution_type
      ? details.institution_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : null,
    details?.district ? `${details.district} District` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const badges = [
    org.relationship_status
      ? { label: org.relationship_status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), variant: "outline" as const }
      : null,
    org.mou_status && org.mou_status !== "none"
      ? { label: `MoU: ${org.mou_status}`, variant: "outline" as const }
      : null,
    org.strategic_priority
      ? { label: `${org.strategic_priority} priority`, variant: "secondary" as const }
      : null,
  ].filter((b): b is NonNullable<typeof b> => b !== null);

  const tabs = TAB_IDS.map((id) => ({
    id,
    label: TAB_LABELS[id],
    count:
      id === "timeline"
        ? activities.length
        : id === "contacts"
        ? org.contacts.length
        : id === "mous"
        ? mous.length
        : id === "opportunities"
        ? opportunities.length
        : undefined,
  }));

  return (
    <div className="flex flex-col gap-6 p-6">
      <RecordHeader
        title={org.name}
        subtitle={subtitle || undefined}
        badges={badges}
        backHref="/institutions"
        actions={[
          { label: "Call", icon: PhoneIcon, variant: "outline", onClick: () => {} },
          { label: "WhatsApp", icon: MessageCircleIcon, variant: "outline", onClick: () => {} },
          { label: "Email", icon: MailIcon, variant: "outline", onClick: () => {} },
          { label: "Create MoU", icon: FileTextIcon, variant: "outline", onClick: () => {} },
          {
            label: "Create Activity",
            icon: PlusIcon,
            variant: "default",
            onClick: () => setComposerOpen(true),
          },
        ]}
      />

      <RecordTabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as TabId)} />

      <div className="mt-1">
        {activeTab === "overview" && (
          <OverviewTab
            org={org}
            relationships={relationships}
            opportunities={opportunities}
            mous={mous}
            onCreateActivity={() => setComposerOpen(true)}
          />
        )}

        {activeTab === "timeline" && (
          <ActivityTimeline activities={activities} />
        )}

        {activeTab === "contacts" && (
          org.contacts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                No contacts linked to this institution yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {org.contacts.map((c) => (
                <ContactCard
                  key={c.person_id}
                  personId={c.person_id}
                  name={`Contact ${c.person_id.slice(-4)}`}
                  role={c.role_label}
                />
              ))}
            </div>
          )
        )}

        {activeTab === "mous" && (
          mous.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                No MoUs found for this institution.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {mous.map((mou) => (
                  <div key={mou._id} className="px-4">
                    <MoUItem mou={mou} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        )}

        {activeTab === "opportunities" && (
          opportunities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                No opportunities yet.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {opportunities.map((opp) => (
                  <div key={opp._id} className="px-4">
                    <OppItem opp={opp} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        )}

        {activeTab === "programs" && (
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">
                Programs delivered at this institution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {courses.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No programs on record for this institution.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Program Name</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Category</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Levels</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {courses.map((course) => (
                        <tr key={course._id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{course.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{course.category_name ?? course.category_id}</td>
                          <td className="px-4 py-3 text-muted-foreground">{course.levels.length}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={course.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "students" && (() => {
          const activeStudents = enrollments.filter((e) => e.status === "active");
          const alumni = enrollments.filter((e) => e.status === "completed");
          return (
            <Card>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold">Students / Alumni</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4">
                {/* Summary counts */}
                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-foreground">{activeStudents.length}</span>
                    <span className="text-xs text-muted-foreground">Students Enrolled</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold text-foreground">{alumni.length}</span>
                    <span className="text-xs text-muted-foreground">Alumni</span>
                  </div>
                </div>

                {/* Enrollment list */}
                {enrollments.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No student records linked to this institution.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Student</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Course</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Start Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {enrollments.slice(0, 10).map((enr) => (
                          <tr key={enr._id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium font-mono text-xs">{enr.student_name ?? enr.student_id.slice(-8)}</td>
                            <td className="px-4 py-3 text-muted-foreground">{enr.course_name ?? enr.course_id}</td>
                            <td className="px-4 py-3"><StatusBadge status={enr.status} size="sm" /></td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {new Date(enr.start_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {enrollments.length > 10 && (
                      <p className="px-4 py-2 text-xs text-muted-foreground">
                        Showing 10 of {enrollments.length} records.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}

        {activeTab === "documents" && (
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">Documents</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              <DocumentUpload
                entityType="institution"
                entityId={institutionId}
                onUpload={(file) => {
                  console.log("Uploaded:", file.name);
                }}
              />
              <p className="text-center text-sm text-muted-foreground py-4">
                No documents uploaded yet. Use the Upload button to attach files.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <ActivityComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        relatedEntity={{ type: "institution", id: institutionId, name: org.name }}
        onSave={(data) => {
          console.info("Activity logged:", data);
          // Refresh activities from API when backend is wired
        }}
      />
    </div>
  );
}
