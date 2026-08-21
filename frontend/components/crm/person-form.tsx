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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Person } from "@/lib/types";

interface PersonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person?: Person;
  onSave: (data: Partial<Person>) => void;
}

interface PersonFormData {
  full_name: string;
  primary_phone: string;
  primary_email: string;
  city: string;
  district: string;
  state: string;
  linkedin: string;
  whatsapp: string;
  tags: string;
}

const EMPTY: PersonFormData = {
  full_name: "",
  primary_phone: "",
  primary_email: "",
  city: "",
  district: "",
  state: "",
  linkedin: "",
  whatsapp: "",
  tags: "",
};

export function PersonForm({ open, onOpenChange, person, onSave }: PersonFormProps) {
  const [form, setForm] = useState<PersonFormData>(EMPTY);

  useEffect(() => {
    if (open) {
      if (person) {
        setForm({
          full_name: person.full_name ?? "",
          primary_phone: person.primary_phone ?? "",
          primary_email: person.primary_email ?? "",
          city: person.current_location?.city ?? "",
          district: person.current_location?.district ?? "",
          state: person.current_location?.state ?? "",
          linkedin: person.social_identifiers?.linkedin ?? "",
          whatsapp: person.social_identifiers?.whatsapp ?? "",
          tags: (person.tags ?? []).join(", "),
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, person]);

  function set(field: keyof PersonFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSave() {
    const data: Partial<Person> = {
      full_name: form.full_name.trim(),
      primary_phone: form.primary_phone.trim() || null,
      primary_email: form.primary_email.trim() || null,
      current_location: {
        city: form.city.trim() || undefined,
        district: form.district.trim() || undefined,
        state: form.state.trim() || undefined,
      },
      social_identifiers: {
        linkedin: form.linkedin.trim() || undefined,
        whatsapp: form.whatsapp.trim() || undefined,
      },
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(data);
    onOpenChange(false);
  }

  function handleCancel() {
    setForm(EMPTY);
    onOpenChange(false);
  }

  const isValid =
    form.full_name.trim().length > 0 &&
    form.primary_phone.trim().length > 0 &&
    form.primary_email.trim().length > 0;

  const isEditing = Boolean(person);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Person" : "Create Person"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="person-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="person-name"
              placeholder="e.g. Priya Sharma"
              value={form.full_name}
              onChange={set("full_name")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="person-phone">
                Primary Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="person-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.primary_phone}
                onChange={set("primary_phone")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="person-email">
                Primary Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="person-email"
                type="email"
                placeholder="priya@example.com"
                value={form.primary_email}
                onChange={set("primary_email")}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="person-city">City</Label>
              <Input
                id="person-city"
                placeholder="Coimbatore"
                value={form.city}
                onChange={set("city")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="person-district">District</Label>
              <Input
                id="person-district"
                placeholder="Coimbatore"
                value={form.district}
                onChange={set("district")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="person-state">State</Label>
              <Input
                id="person-state"
                placeholder="Tamil Nadu"
                value={form.state}
                onChange={set("state")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="person-linkedin">LinkedIn</Label>
              <Input
                id="person-linkedin"
                placeholder="linkedin.com/in/priya"
                value={form.linkedin}
                onChange={set("linkedin")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="person-whatsapp">WhatsApp</Label>
              <Input
                id="person-whatsapp"
                placeholder="+91 98765 43210"
                value={form.whatsapp}
                onChange={set("whatsapp")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="person-tags">Tags</Label>
            <Input
              id="person-tags"
              placeholder="decision-maker, vip (comma-separated)"
              value={form.tags}
              onChange={set("tags")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {isEditing ? "Save Person" : "Create Person"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
