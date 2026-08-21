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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MoUFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: MoUFormData) => void;
}

export interface MoUFormData {
  institution_name: string;
  scope: string;
  vertical: string;
  start_date: string;
  end_date: string;
  commercial_value: string;
  strategic_value: "high" | "medium" | "low" | "";
}

const EMPTY: MoUFormData = {
  institution_name: "",
  scope: "",
  vertical: "",
  start_date: "",
  end_date: "",
  commercial_value: "",
  strategic_value: "",
};

export function MoUForm({ open, onOpenChange, onSave }: MoUFormProps) {
  const [form, setForm] = useState<MoUFormData>(EMPTY);

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  function set(field: keyof MoUFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSave() {
    onSave(form);
    setForm(EMPTY);
    onOpenChange(false);
  }

  function handleCancel() {
    setForm(EMPTY);
    onOpenChange(false);
  }

  const isValid =
    form.institution_name.trim().length > 0 &&
    form.scope.trim().length > 0 &&
    form.vertical.trim().length > 0 &&
    form.start_date.length > 0 &&
    form.end_date.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create MoU</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mou-institution">
              Institution / Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mou-institution"
              placeholder="e.g. PSG College of Technology"
              value={form.institution_name}
              onChange={set("institution_name")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mou-scope">
              Scope <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="mou-scope"
              placeholder="Describe the scope of the MoU…"
              rows={3}
              value={form.scope}
              onChange={set("scope")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mou-vertical">
              Vertical <span className="text-destructive">*</span>
            </Label>
            <Input
              id="mou-vertical"
              placeholder="e.g. Campus Recruitment, Training"
              value={form.vertical}
              onChange={set("vertical")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mou-start">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mou-start"
                type="date"
                value={form.start_date}
                onChange={set("start_date")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mou-end">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mou-end"
                type="date"
                value={form.end_date}
                onChange={set("end_date")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mou-value">Commercial Value (₹)</Label>
              <Input
                id="mou-value"
                type="number"
                min={0}
                placeholder="e.g. 250000"
                value={form.commercial_value}
                onChange={set("commercial_value")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mou-strategic">Strategic Value</Label>
              <Select
                value={form.strategic_value}
                onValueChange={(val) =>
                  setForm((f) => ({
                    ...f,
                    strategic_value: val as "high" | "medium" | "low",
                  }))
                }
              >
                <SelectTrigger id="mou-strategic">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Create MoU
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
