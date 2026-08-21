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
import type { Opportunity, OpportunityMacroStage } from "@/lib/types";

interface OpportunityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity?: Opportunity;
  onSave: (data: Partial<Opportunity>) => void;
}

interface OppFormData {
  account_name: string;
  contact_name: string;
  vertical: string;
  product: string;
  stage: OpportunityMacroStage | "";
  value: string;
  currency: string;
  probability: string;
  expected_close_date: string;
  source: string;
}

const EMPTY: OppFormData = {
  account_name: "",
  contact_name: "",
  vertical: "",
  product: "",
  stage: "",
  value: "",
  currency: "INR",
  probability: "",
  expected_close_date: "",
  source: "",
};

const STAGE_OPTIONS: { value: OpportunityMacroStage; label: string }[] = [
  { value: "discovered", label: "Discovered" },
  { value: "engaged", label: "Engaged" },
  { value: "qualified", label: "Qualified" },
  { value: "proposed", label: "Proposed" },
  { value: "negotiating", label: "Negotiating" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function OpportunityForm({
  open,
  onOpenChange,
  opportunity,
  onSave,
}: OpportunityFormProps) {
  const [form, setForm] = useState<OppFormData>(EMPTY);

  useEffect(() => {
    if (open) {
      if (opportunity) {
        setForm({
          account_name: opportunity.account_name ?? "",
          contact_name: opportunity.contact_name ?? "",
          vertical: opportunity.vertical ?? "",
          product: opportunity.product ?? "",
          stage: opportunity.stage ?? "",
          value: opportunity.value?.toString() ?? "",
          currency: opportunity.currency ?? "INR",
          probability: opportunity.probability?.toString() ?? "",
          expected_close_date: opportunity.expected_close_date ?? "",
          source: opportunity.source ?? "",
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, opportunity]);

  function set(field: keyof OppFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function setSelect(field: keyof OppFormData) {
    return (val: string | null) => { if (val) setForm((f) => ({ ...f, [field]: val })); };
  }

  function handleSave() {
    const data: Partial<Opportunity> = {
      account_name: form.account_name.trim(),
      contact_name: form.contact_name.trim(),
      vertical: form.vertical.trim(),
      product: form.product.trim(),
      stage: form.stage as OpportunityMacroStage,
      value: parseFloat(form.value) || 0,
      currency: form.currency,
      probability: parseFloat(form.probability) || 0,
      expected_close_date: form.expected_close_date || null,
      source: form.source.trim() || null,
    };
    onSave(data);
    onOpenChange(false);
  }

  function handleCancel() {
    setForm(EMPTY);
    onOpenChange(false);
  }

  const isValid =
    form.account_name.trim().length > 0 &&
    form.contact_name.trim().length > 0 &&
    form.vertical.trim().length > 0 &&
    form.product.trim().length > 0 &&
    form.value.trim().length > 0;

  const isEditing = Boolean(opportunity);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Opportunity" : "Create Opportunity"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opp-account">
                Account Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="opp-account"
                placeholder="e.g. Sri Venkateswara College"
                value={form.account_name}
                onChange={set("account_name")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opp-contact">
                Contact Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="opp-contact"
                placeholder="e.g. Dr. Ramesh"
                value={form.contact_name}
                onChange={set("contact_name")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opp-vertical">
                Vertical <span className="text-destructive">*</span>
              </Label>
              <Input
                id="opp-vertical"
                placeholder="e.g. Campus Recruitment"
                value={form.vertical}
                onChange={set("vertical")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opp-product">
                Product <span className="text-destructive">*</span>
              </Label>
              <Input
                id="opp-product"
                placeholder="e.g. Placement Drive"
                value={form.product}
                onChange={set("product")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="opp-stage">Stage</Label>
            <Select value={form.stage} onValueChange={setSelect("stage")}>
              <SelectTrigger id="opp-stage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="opp-value">
                Value <span className="text-destructive">*</span>
              </Label>
              <Input
                id="opp-value"
                type="number"
                min={0}
                placeholder="e.g. 500000"
                value={form.value}
                onChange={set("value")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opp-currency">Currency</Label>
              <Select value={form.currency} onValueChange={setSelect("currency")}>
                <SelectTrigger id="opp-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opp-prob">Probability (%)</Label>
              <Input
                id="opp-prob"
                type="number"
                min={0}
                max={100}
                placeholder="e.g. 60"
                value={form.probability}
                onChange={set("probability")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opp-close">Expected Close Date</Label>
              <Input
                id="opp-close"
                type="date"
                value={form.expected_close_date}
                onChange={set("expected_close_date")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="opp-source">Source</Label>
            <Input
              id="opp-source"
              placeholder="e.g. Referral, Campaign"
              value={form.source}
              onChange={set("source")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {isEditing ? "Save Opportunity" : "Create Opportunity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
