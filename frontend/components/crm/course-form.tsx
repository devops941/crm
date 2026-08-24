"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CourseFormData {
  name: string;
  category: string;
  description: string;
  prerequisites: string;
  level_name: string;
  duration_days: string;
  fee: string;
  batch_size_max: string;
  mode: string;
  status: string;
}

const EMPTY: CourseFormData = {
  name: "", category: "", description: "", prerequisites: "",
  level_name: "Learner", duration_days: "", fee: "", batch_size_max: "20",
  mode: "Classroom + Online", status: "draft",
};

const CATEGORIES = [
  "Coding & Development", "AI & Data Science", "Business & Management",
  "Design & Creative", "Cloud & DevOps", "Cybersecurity",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CourseFormData) => void;
}

export function CourseForm({ open, onOpenChange, onSave }: Props) {
  const [form, setForm] = useState<CourseFormData>(EMPTY);

  useEffect(() => { if (open) setForm(EMPTY); }, [open]);

  function set(field: keyof CourseFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const isValid = form.name.trim().length > 0 && form.category.length > 0 && form.duration_days.length > 0 && form.fee.length > 0;

  function handleSave() {
    onSave(form);
    setForm(EMPTY);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>Add a new course to the catalog</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="c-name">Course Name *</Label>
            <Input id="c-name" placeholder="e.g. Full Stack Web Development" value={form.name} onChange={set("name")} />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={form.category || undefined} onValueChange={(v) => v && setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="c-desc">Description</Label>
            <Textarea id="c-desc" placeholder="Course description..." value={form.description} onChange={set("description")} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="c-prereq">Prerequisites</Label>
            <Input id="c-prereq" placeholder="e.g. Basic programming knowledge" value={form.prerequisites} onChange={set("prerequisites")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={form.level_name} onValueChange={(v) => v && setForm((f) => ({ ...f, level_name: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Learner">Learner</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-dur">Duration (days) *</Label>
              <Input id="c-dur" type="number" placeholder="180" value={form.duration_days} onChange={set("duration_days")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="c-fee">Fee (₹) *</Label>
              <Input id="c-fee" type="number" placeholder="35000" value={form.fee} onChange={set("fee")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-batch">Max Batch Size</Label>
              <Input id="c-batch" type="number" placeholder="20" value={form.batch_size_max} onChange={set("batch_size_max")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Delivery Mode</Label>
              <Select value={form.mode} onValueChange={(v) => v && setForm((f) => ({ ...f, mode: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Classroom">Classroom</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Classroom + Online">Classroom + Online</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => v && setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!isValid}>Create Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
