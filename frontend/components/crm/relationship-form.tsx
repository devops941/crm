"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RelationshipEntityType, RelationshipType } from "@/lib/types";

interface RelatedEntity {
  type: string;
  id: string;
  name: string;
}

interface RelationshipFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromEntity?: RelatedEntity;
  onSave: (data: RelationshipFormData) => void;
}

export interface RelationshipFormData {
  to_entity_type: RelationshipEntityType | "";
  to_entity_name: string;
  relationship_type: RelationshipType | "";
  role: string;
  start_date: string;
  from_entity?: RelatedEntity;
}

const EMPTY: Omit<RelationshipFormData, "from_entity"> = {
  to_entity_type: "",
  to_entity_name: "",
  relationship_type: "",
  role: "",
  start_date: "",
};

const RELATIONSHIP_TYPE_OPTIONS: { value: RelationshipType; label: string }[] = [
  { value: "studied_at", label: "Studied At" },
  { value: "employed_by", label: "Employed By" },
  { value: "decision_maker_for", label: "Decision Maker For" },
  { value: "partner_of", label: "Partner Of" },
  { value: "referred", label: "Referred" },
  { value: "alumnus_of", label: "Alumnus Of" },
  { value: "trainer_at", label: "Trainer At" },
  { value: "vendor_of", label: "Vendor Of" },
  { value: "other", label: "Other" },
];

export function RelationshipForm({
  open,
  onOpenChange,
  fromEntity,
  onSave,
}: RelationshipFormProps) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  function set(field: keyof typeof EMPTY) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSave() {
    const data: RelationshipFormData = {
      ...form,
      from_entity: fromEntity,
    };
    onSave(data);
    setForm(EMPTY);
    onOpenChange(false);
  }

  function handleCancel() {
    setForm(EMPTY);
    onOpenChange(false);
  }

  const isValid =
    form.to_entity_type !== "" &&
    form.to_entity_name.trim().length > 0 &&
    form.relationship_type !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Relationship</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* From entity badge (read-only) */}
          {fromEntity && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">From:</span>
              <Badge variant="outline" className="text-xs">
                <span className="capitalize text-muted-foreground mr-1">
                  {fromEntity.type}
                </span>
                {fromEntity.name}
              </Badge>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rel-to-type">
              To Entity Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.to_entity_type}
              onValueChange={(val) =>
                setForm((f) => ({
                  ...f,
                  to_entity_type: val as RelationshipEntityType,
                }))
              }
            >
              <SelectTrigger id="rel-to-type">
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rel-to-name">
              To Entity Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rel-to-name"
              placeholder="Search or enter name…"
              value={form.to_entity_name}
              onChange={set("to_entity_name")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rel-type">
              Relationship Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.relationship_type}
              onValueChange={(val) =>
                setForm((f) => ({
                  ...f,
                  relationship_type: val as RelationshipType,
                }))
              }
            >
              <SelectTrigger id="rel-type">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rel-role">Role</Label>
              <Input
                id="rel-role"
                placeholder="e.g. Placement Officer"
                value={form.role}
                onChange={set("role")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rel-start">Start Date</Label>
              <Input
                id="rel-start"
                type="date"
                value={form.start_date}
                onChange={set("start_date")}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Add Relationship
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
