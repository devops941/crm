"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import type { Lead, LeadSource } from "@/lib/types";

// ── Create mode types ────────────────────────────────────────────

interface CreateLeadData {
  person_name: string;
  phone: string;
  email: string;
  source: LeadSource | "";
  vertical: string;
  product: string;
  score: string;
}

const EMPTY_CREATE: CreateLeadData = {
  person_name: "",
  phone: "",
  email: "",
  source: "",
  vertical: "",
  product: "",
  score: "",
};

// ── Convert mode types ───────────────────────────────────────────

interface ConvertLeadData {
  account_name: string;
  product: string;
  value: string;
  expected_close_date: string;
}

const EMPTY_CONVERT: ConvertLeadData = {
  account_name: "",
  product: "",
  value: "",
  expected_close_date: "",
};

// ── Shared props ─────────────────────────────────────────────────

type LeadFormProps =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSave: (data: Partial<CreateLeadData>) => void;
      lead?: undefined;
      onConvert?: undefined;
    }
  | {
      mode: "convert";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      lead: Lead;
      onConvert: (data: ConvertLeadData) => void;
      onSave?: undefined;
    };

const LEAD_SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: "website_form", label: "Website Form" },
  { value: "referral", label: "Referral" },
  { value: "campaign", label: "Campaign" },
  { value: "walk_in", label: "Walk-in" },
  { value: "event", label: "Event" },
  { value: "cold_outreach", label: "Cold Outreach" },
  { value: "other", label: "Other" },
];

export function LeadForm(props: LeadFormProps) {
  const { mode, open, onOpenChange } = props;

  // Create mode state
  const [createForm, setCreateForm] = useState<CreateLeadData>(EMPTY_CREATE);

  // Convert mode state
  const [convertForm, setConvertForm] = useState<ConvertLeadData>(EMPTY_CONVERT);

  useEffect(() => {
    if (open) {
      setCreateForm(EMPTY_CREATE);
      setConvertForm(EMPTY_CONVERT);
    }
  }, [open]);

  function setCreate(field: keyof CreateLeadData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setCreateForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function setConvert(field: keyof ConvertLeadData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setConvertForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleCancel() {
    setCreateForm(EMPTY_CREATE);
    setConvertForm(EMPTY_CONVERT);
    onOpenChange(false);
  }

  // ── Create mode ──────────────────────────────────────────────

  if (mode === "create") {
    const isValid =
      createForm.person_name.trim().length > 0 &&
      createForm.phone.trim().length > 0;

    function handleSave() {
      if (props.onSave) props.onSave(createForm);
      setCreateForm(EMPTY_CREATE);
      onOpenChange(false);
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Lead</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-name">
                Person Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lead-name"
                placeholder="e.g. Ravi Kumar"
                value={createForm.person_name}
                onChange={setCreate("person_name")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lead-phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lead-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={createForm.phone}
                  onChange={setCreate("phone")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lead-email">Email</Label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="ravi@example.com"
                  value={createForm.email}
                  onChange={setCreate("email")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-source">Source</Label>
              <Select
                value={createForm.source}
                onValueChange={(val) =>
                  val && setCreateForm((f) => ({ ...f, source: val as LeadSource }))
                }
              >
                <SelectTrigger id="lead-source">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lead-vertical">Vertical</Label>
                <Input
                  id="lead-vertical"
                  placeholder="e.g. B2B SaaS, Education"
                  value={createForm.vertical}
                  onChange={setCreate("vertical")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lead-product">Product</Label>
                <Input
                  id="lead-product"
                  placeholder="e.g. Kaizen LMS"
                  value={createForm.product}
                  onChange={setCreate("product")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lead-score">Score (0–100)</Label>
              <Input
                id="lead-score"
                type="number"
                min={0}
                max={100}
                placeholder="e.g. 70"
                value={createForm.score}
                onChange={setCreate("score")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              Create Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Convert mode ─────────────────────────────────────────────

  const lead = props.lead;
  const isConvertValid = convertForm.account_name.trim().length > 0;

  function handleConvert() {
    if (props.onConvert) props.onConvert(convertForm);
    setConvertForm(EMPTY_CONVERT);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Convert to Opportunity</DialogTitle>
          <DialogDescription>
            Converting lead for <strong>{lead.person_name ?? "Unknown"}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Read-only lead summary */}
          <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Lead Info (read-only)
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge variant="outline" className="text-xs">{lead.vertical}</Badge>
              <Badge variant="outline" className="text-xs">{lead.product}</Badge>
              <Badge variant="outline" className="text-xs capitalize">{lead.source.replace(/_/g, " ")}</Badge>
              <Badge variant="outline" className="text-xs">Score: {lead.score}/100</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="conv-account">
              Account (Organization Name) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="conv-account"
              placeholder="e.g. Sri Venkateswara College"
              value={convertForm.account_name}
              onChange={setConvert("account_name")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="conv-product">Product</Label>
            <Input
              id="conv-product"
              placeholder="e.g. Campus Recruitment Program"
              value={convertForm.product}
              onChange={setConvert("product")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="conv-value">Value (₹)</Label>
              <Input
                id="conv-value"
                type="number"
                placeholder="e.g. 500000"
                value={convertForm.value}
                onChange={setConvert("value")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="conv-close">Expected Close Date</Label>
              <Input
                id="conv-close"
                type="date"
                value={convertForm.expected_close_date}
                onChange={setConvert("expected_close_date")}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConvert} disabled={!isConvertValid}>
            Convert to Opportunity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
