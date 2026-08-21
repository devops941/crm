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
import type { Organization, OrgCategory, InstitutionType, ManagementType } from "@/lib/types";

interface OrganizationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization;
  onSave: (data: Partial<Organization>) => void;
}

interface OrgFormData {
  name: string;
  category: OrgCategory | "";
  industry: string;
  parent_org_id: string;
  // Institution-specific
  institution_type: InstitutionType | "";
  management_type: ManagementType | "";
  district: string;
  address: string;
  lat: string;
  lng: string;
  established_year: string;
  student_count: string;
  department_count: string;
}

const EMPTY: OrgFormData = {
  name: "",
  category: "",
  industry: "",
  parent_org_id: "",
  institution_type: "",
  management_type: "",
  district: "",
  address: "",
  lat: "",
  lng: "",
  established_year: "",
  student_count: "",
  department_count: "",
};

export function OrganizationForm({
  open,
  onOpenChange,
  organization,
  onSave,
}: OrganizationFormProps) {
  const [form, setForm] = useState<OrgFormData>(EMPTY);

  useEffect(() => {
    if (open) {
      if (organization) {
        const inst = organization.institution_details;
        setForm({
          name: organization.name ?? "",
          category: organization.category ?? "",
          industry: organization.industry ?? "",
          parent_org_id: organization.parent_org_id ?? "",
          institution_type: inst?.institution_type ?? "",
          management_type: inst?.management_type ?? "",
          district: inst?.district ?? "",
          address: inst?.address ?? "",
          lat: inst?.location?.lat?.toString() ?? "",
          lng: inst?.location?.lng?.toString() ?? "",
          established_year: inst?.established_year?.toString() ?? "",
          student_count: inst?.student_count?.toString() ?? "",
          department_count: inst?.department_count?.toString() ?? "",
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, organization]);

  function set(field: keyof OrgFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function setSelect(field: keyof OrgFormData) {
    return (val: string | null) => { if (val) setForm((f) => ({ ...f, [field]: val })); };
  }

  const isInstitution = form.category === "institution";

  function handleSave() {
    const data: Partial<Organization> = {
      name: form.name.trim(),
      category: form.category as OrgCategory,
      industry: form.industry.trim() || null,
      parent_org_id: form.parent_org_id.trim() || null,
    };

    if (isInstitution) {
      data.institution_details = {
        institution_type: form.institution_type as InstitutionType,
        management_type: form.management_type as ManagementType,
        district: form.district.trim(),
        address: form.address.trim() || undefined,
        location: {
          lat: parseFloat(form.lat) || 0,
          lng: parseFloat(form.lng) || 0,
        },
        established_year: form.established_year ? parseInt(form.established_year) : undefined,
        student_count: form.student_count ? parseInt(form.student_count) : undefined,
        department_count: form.department_count ? parseInt(form.department_count) : undefined,
      };
    }

    onSave(data);
    onOpenChange(false);
  }

  function handleCancel() {
    setForm(EMPTY);
    onOpenChange(false);
  }

  const isValid =
    form.name.trim().length > 0 &&
    form.category !== "" &&
    (!isInstitution || form.district.trim().length > 0);

  const isEditing = Boolean(organization);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Organization" : "Create Organization"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Core fields */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="org-name"
              placeholder="e.g. Kaizen Edutech Pvt Ltd"
              value={form.name}
              onChange={set("name")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="org-category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={form.category} onValueChange={setSelect("category")}>
                <SelectTrigger id="org-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="institution">Institution</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="org-industry">Industry</Label>
              <Input
                id="org-industry"
                placeholder="e.g. Education, Manufacturing"
                value={form.industry}
                onChange={set("industry")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="org-parent">Parent Organization</Label>
            <Input
              id="org-parent"
              placeholder="Parent org name or ID"
              value={form.parent_org_id}
              onChange={set("parent_org_id")}
            />
          </div>

          {/* Institution-specific fields */}
          {isInstitution && (
            <>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Institution Details
                </p>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-inst-type">Institution Type</Label>
                      <Select value={form.institution_type} onValueChange={setSelect("institution_type")}>
                        <SelectTrigger id="org-inst-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="school">School</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                          <SelectItem value="university">University</SelectItem>
                          <SelectItem value="training_institution">Training Institution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-mgmt-type">Management Type</Label>
                      <Select value={form.management_type} onValueChange={setSelect("management_type")}>
                        <SelectTrigger id="org-mgmt-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="aided">Aided</SelectItem>
                          <SelectItem value="autonomous">Autonomous</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="org-district">
                      District <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="org-district"
                      placeholder="e.g. Coimbatore"
                      value={form.district}
                      onChange={set("district")}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="org-address">Address</Label>
                    <Textarea
                      id="org-address"
                      placeholder="Full address…"
                      rows={2}
                      value={form.address}
                      onChange={set("address")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-lat">Latitude</Label>
                      <Input
                        id="org-lat"
                        type="number"
                        placeholder="11.0168"
                        value={form.lat}
                        onChange={set("lat")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-lng">Longitude</Label>
                      <Input
                        id="org-lng"
                        type="number"
                        placeholder="76.9558"
                        value={form.lng}
                        onChange={set("lng")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-est-year">Established Year</Label>
                      <Input
                        id="org-est-year"
                        type="number"
                        placeholder="1985"
                        value={form.established_year}
                        onChange={set("established_year")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-students">Student Count</Label>
                      <Input
                        id="org-students"
                        type="number"
                        placeholder="3000"
                        value={form.student_count}
                        onChange={set("student_count")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="org-depts">Department Count</Label>
                      <Input
                        id="org-depts"
                        type="number"
                        placeholder="12"
                        value={form.department_count}
                        onChange={set("department_count")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {isEditing ? "Save Organization" : "Create Organization"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
