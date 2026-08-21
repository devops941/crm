"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getOrganization } from "@/lib/api";
import type { Organization } from "@/lib/types";
import { RecordHeader } from "@/components/crm/record-header";
import { RecordTabs } from "@/components/crm/record-tabs";
import { ContactCard } from "@/components/crm/contact-card";
import { StatusBadge } from "@/components/crm/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, BuildingIcon, UsersIcon, TrendingUpIcon } from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "contacts", label: "Contacts" },
  { id: "opportunities", label: "Opportunities" },
  { id: "contracts", label: "Contracts & Payments" },
  { id: "projects", label: "Projects" },
  { id: "mous", label: "MoUs" },
  { id: "timeline", label: "Timeline" },
];

function OrgSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Skeleton className="size-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center text-muted-foreground text-sm">
        {label} — coming soon
      </CardContent>
    </Card>
  );
}

function HierarchyCard({ org }: { org: Organization }) {
  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <BuildingIcon className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Hierarchy</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2">
        {org.parent_org_id ? (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Parent:</span>{" "}
            <span className="font-mono text-xs">{org.parent_org_id}</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Top-level organization — no parent.</p>
        )}
        <div className="text-sm">
          <span className="text-muted-foreground">Category:</span>{" "}
          <span className="capitalize font-medium">{org.category}</span>
        </div>
        {org.industry && (
          <div className="text-sm">
            <span className="text-muted-foreground">Industry:</span>{" "}
            <span className="font-medium">{org.industry}</span>
          </div>
        )}
        {org.strategic_priority && (
          <div className="text-sm">
            <span className="text-muted-foreground">Priority:</span>{" "}
            <span className="capitalize font-medium">{org.strategic_priority}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RelationshipHealthCard({ org }: { org: Organization }) {
  const status = org.relationship_status ?? "no_relationship";
  const mouStatus = org.mou_status ?? "none";
  const lastActivity = org.last_activity_at
    ? new Date(org.last_activity_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Relationship Health</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <StatusBadge status={status} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">MoU Status</span>
          <StatusBadge status={mouStatus} size="sm" />
        </div>
        {lastActivity && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Activity</span>
            <span className="text-sm font-medium">{lastActivity}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OrganizationDetailPage() {
  const { orgId } = useParams<{ orgId: string }>();

  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!orgId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getOrganization(orgId)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError("Organization not found.");
          return;
        }
        setOrg(data);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load organization:", err);
          setError("Failed to load organization. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orgId]);

  if (loading) return <OrgSkeleton />;

  if (error || !org) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <p className="text-muted-foreground">{error ?? "Organization not found."}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const categoryBadges = [
    {
      label: org.category.charAt(0).toUpperCase() + org.category.slice(1),
      variant: "outline" as const,
    },
    ...(org.mou_status && org.mou_status !== "none"
      ? [{ label: `MoU: ${org.mou_status}`, variant: "secondary" as const }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <RecordHeader
        title={org.name}
        subtitle={org.industry ?? undefined}
        badges={categoryBadges}
        backHref="/organizations"
        actions={[
          {
            label: "New Opportunity",
            icon: PlusIcon,
            variant: "default",
            onClick: () => {},
          },
          {
            label: "Edit",
            icon: PencilIcon,
            variant: "outline",
            onClick: () => {},
          },
        ]}
      />

      <RecordTabs
        tabs={TABS.map((t) => ({
          ...t,
          count:
            t.id === "contacts" ? org.contacts.length : undefined,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-2">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <HierarchyCard org={org} />

              {/* Contacts preview */}
              <Card>
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="size-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-semibold">
                      Key Contacts ({org.contacts.length})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col gap-2">
                  {org.contacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No contacts linked.</p>
                  ) : (
                    org.contacts.slice(0, 3).map((c) => (
                      <ContactCard
                        key={c.person_id}
                        name={c.role_label}
                        role={c.role_label}
                        personId={c.person_id}
                      />
                    ))
                  )}
                </CardContent>
              </Card>

              <RelationshipHealthCard org={org} />
            </div>

            {org.institution_details && (
              <Card>
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-sm font-semibold">Institution Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium capitalize">
                      {org.institution_details.institution_type.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Management</p>
                    <p className="text-sm font-medium capitalize">
                      {org.institution_details.management_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">District</p>
                    <p className="text-sm font-medium">{org.institution_details.district}</p>
                  </div>
                  {org.institution_details.student_count && (
                    <div>
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="text-sm font-medium">
                        {org.institution_details.student_count.toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {org.contacts.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center text-muted-foreground text-sm">
                  No contacts linked to this organization.
                </CardContent>
              </Card>
            ) : (
              org.contacts.map((c) => (
                <ContactCard
                  key={c.person_id}
                  name={c.role_label}
                  role={c.role_label}
                  personId={c.person_id}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "opportunities" && <PlaceholderTab label="Opportunities" />}
        {activeTab === "contracts" && <PlaceholderTab label="Contracts & Payments" />}
        {activeTab === "projects" && <PlaceholderTab label="Projects" />}
        {activeTab === "mous" && <PlaceholderTab label="MoUs" />}
        {activeTab === "timeline" && <PlaceholderTab label="Timeline" />}
      </div>
    </div>
  );
}
