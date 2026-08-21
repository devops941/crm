"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getPerson,
  getPersonRelationships,
  getPersonTimeline,
  getOpportunities,
  getEnrollments,
} from "@/lib/api";
import type { Person, Relationship, Activity, Opportunity, Enrollment } from "@/lib/types";
import { RecordHeader } from "@/components/crm/record-header";
import { RecordTabs } from "@/components/crm/record-tabs";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { RelationshipPanel } from "@/components/crm/relationship-panel";
import { StatusBadge } from "@/components/crm/status-badge";
import { DocumentUpload } from "@/components/crm/document-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PencilIcon, ActivityIcon } from "lucide-react";

const TABS = [
  { id: "relationships", label: "Relationships" },
  { id: "timeline", label: "Timeline" },
  { id: "opportunities", label: "Opportunities" },
  { id: "education", label: "Education History" },
  { id: "employment", label: "Employment" },
  { id: "documents", label: "Documents" },
  { id: "notes", label: "Notes" },
];

function PersonSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Skeleton className="size-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}


export default function PersonDetailPage() {
  const { personId } = useParams<{ personId: string }>();

  const [person, setPerson] = useState<Person | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [timeline, setTimeline] = useState<Activity[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("relationships");
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [activityNotes, setActivityNotes] = useState("");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<{ id: string; text: string; date: string }[]>([]);

  useEffect(() => {
    if (!personId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      getPerson(personId),
      getPersonRelationships(personId),
      getPersonTimeline(personId),
      getOpportunities(),
      getEnrollments(),
    ])
      .then(([p, rels, acts, oppsRes, enrRes]) => {
        if (cancelled) return;
        if (!p) {
          setError("Person not found.");
          return;
        }
        setPerson(p);
        setRelationships(rels);
        setTimeline(acts);
        // Filter client-side by contact_id
        setOpportunities(oppsRes.data.filter((o) => o.contact_id === personId));
        // Enrollments linked via student_id — use person_id as fallback key
        setEnrollments(enrRes.data.filter((e) => e.student_id === personId));
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load person:", err);
          setError("Failed to load person. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [personId]);

  if (loading) return <PersonSkeleton />;

  if (error || !person) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 p-6">
        <p className="text-muted-foreground">{error ?? "Person not found."}</p>
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const roleBadges = (person.roles ?? []).map((r) => ({
    label: r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    variant: "outline" as const,
  }));

  const subtitle = [person.primary_email, person.primary_phone]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-col gap-6 p-6">
      <RecordHeader
        title={person.full_name}
        subtitle={subtitle || undefined}
        badges={roleBadges}
        backHref="/people"
        actions={[
          {
            label: "Log Activity",
            icon: ActivityIcon,
            variant: "default",
            onClick: () => setActivityDialogOpen(true),
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
            t.id === "relationships"
              ? relationships.length
              : t.id === "timeline"
              ? timeline.length
              : undefined,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mt-2">
        {activeTab === "relationships" && (
          <RelationshipPanel
            relationships={relationships}
            onAdd={() => {}}
          />
        )}

        {activeTab === "timeline" && (
          <ActivityTimeline activities={timeline} />
        )}

        {activeTab === "opportunities" && (
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {opportunities.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No opportunities linked to this person.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Product</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Account</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Stage</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Value</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Probability</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {opportunities.map((opp) => (
                        <tr key={opp._id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{opp.product}</td>
                          <td className="px-4 py-3 text-muted-foreground">{opp.account_name ?? opp.account_id}</td>
                          <td className="px-4 py-3"><StatusBadge status={opp.stage} size="sm" /></td>
                          <td className="px-4 py-3 text-right font-semibold">
                            ₹{opp.value.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{opp.probability}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {activeTab === "education" && (
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">Education History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {enrollments.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No enrollment records found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Course</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Level</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Batch</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Start Date</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {enrollments.map((enr) => {
                        const progress = enr.total_days > 0 && enr.current_day
                          ? Math.min(100, Math.round((enr.current_day / enr.total_days) * 100))
                          : 0;
                        return (
                          <tr key={enr._id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium">{enr.course_name ?? enr.course_id}</td>
                            <td className="px-4 py-3 text-muted-foreground">{enr.level ?? "—"}</td>
                            <td className="px-4 py-3 text-muted-foreground">{enr.batch ?? "—"}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {new Date(enr.start_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </td>
                            <td className="px-4 py-3"><StatusBadge status={enr.status} size="sm" /></td>
                            <td className="px-4 py-3 text-right text-muted-foreground">{progress}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {activeTab === "employment" && (
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">Employment</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {(person.organizations ?? []).length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No employment records linked.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {(person.organizations ?? []).map((org, i) => (
                    <li key={i} className="px-4 py-3 text-sm">
                      {org}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
        {activeTab === "documents" && (
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">Documents</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              <DocumentUpload
                entityType="person"
                entityId={personId}
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
        {activeTab === "notes" && (
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-semibold">Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
              {/* Add note */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="note-input">Add a note</Label>
                <Textarea
                  id="note-input"
                  placeholder="Type your note here…"
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    disabled={!noteText.trim()}
                    onClick={() => {
                      if (!noteText.trim()) return;
                      setNotes((prev) => [
                        { id: Math.random().toString(36).slice(2), text: noteText.trim(), date: new Date().toISOString() },
                        ...prev,
                      ]);
                      setNoteText("");
                    }}
                  >
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Note list */}
              {notes.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No notes yet. Add one above.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {notes.map((note) => (
                    <li key={note.id} className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                      <p className="text-sm text-foreground whitespace-pre-wrap">{note.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.date).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Log Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Activity</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label>Notes</Label>
              <Textarea
                placeholder="Describe the interaction…"
                value={activityNotes}
                onChange={(e) => setActivityNotes(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setActivityDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Placeholder — wire to POST /activities when backend is ready
                  setActivityDialogOpen(false);
                  setActivityNotes("");
                }}
              >
                Save Activity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
