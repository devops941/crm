"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ActivityType } from "@/lib/types";

interface RelatedEntity {
  type: string;
  id: string;
  name: string;
}

interface ActivityComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedEntity?: RelatedEntity;
  onSave?: (data: ActivityFormData) => void;
}

export interface ActivityFormData {
  type: ActivityType;
  outcome: string;
  notes: string;
  next_action: string;
  duration: string;
  related_entity?: RelatedEntity;
}

const ACTIVITY_TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: "call", label: "Call" },
  { value: "meeting", label: "Meeting" },
  { value: "visit", label: "Visit" },
  { value: "email", label: "Email" },
  { value: "proposal", label: "Proposal" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "follow_up", label: "Follow-up" },
  { value: "other", label: "Other" },
];

const EMPTY_FORM: ActivityFormData = {
  type: "call",
  outcome: "",
  notes: "",
  next_action: "",
  duration: "",
};

export function ActivityComposer({
  open,
  onOpenChange,
  relatedEntity,
  onSave,
}: ActivityComposerProps) {
  const [form, setForm] = useState<ActivityFormData>(EMPTY_FORM);

  function handleSave() {
    const data: ActivityFormData = {
      ...form,
      related_entity: relatedEntity,
    };
    onSave?.(data);
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
    onOpenChange(false);
  }

  const isValid = form.type && form.outcome.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Related entity read-only badge */}
          {relatedEntity && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Related to:</span>
              <Badge variant="outline" className="text-xs">
                <span className="capitalize text-muted-foreground mr-1">{relatedEntity.type}</span>
                {relatedEntity.name}
              </Badge>
            </div>
          )}

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-type">Type</Label>
            <Select
              value={form.type}
              onValueChange={(val) => setForm((f) => ({ ...f, type: val as ActivityType }))}
            >
              <SelectTrigger id="activity-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Outcome */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-outcome">
              Outcome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="activity-outcome"
              placeholder="e.g. Left voicemail, Confirmed interest…"
              value={form.outcome}
              onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))}
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-notes">Notes</Label>
            <Textarea
              id="activity-notes"
              placeholder="Additional context, observations…"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {/* Next action */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-next">Next Action</Label>
            <Input
              id="activity-next"
              placeholder="e.g. Follow up in 3 days with proposal"
              value={form.next_action}
              onChange={(e) => setForm((f) => ({ ...f, next_action: e.target.value }))}
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="activity-duration">Duration (minutes)</Label>
            <Input
              id="activity-duration"
              type="number"
              min={0}
              placeholder="e.g. 30"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Log Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
