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
import { Button } from "@/components/ui/button";

interface EnrollmentFormData {
  student_name: string;
  course_name: string;
  level: string;
  batch: string;
  branch: string;
  start_date: string;
  fee: string;
}

const EMPTY: EnrollmentFormData = {
  student_name: "", course_name: "", level: "Learner", batch: "Morning",
  branch: "Madurai HQ", start_date: "", fee: "",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: EnrollmentFormData) => void;
}

export function EnrollmentForm({ open, onOpenChange, onSave }: Props) {
  const [form, setForm] = useState<EnrollmentFormData>(EMPTY);

  useEffect(() => { if (open) setForm(EMPTY); }, [open]);

  function set(field: keyof EnrollmentFormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const isValid = form.student_name.trim().length > 0 && form.course_name.trim().length > 0 && form.start_date.length > 0;

  function handleSave() {
    onSave(form);
    setForm(EMPTY);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Enrollment</DialogTitle>
          <DialogDescription>Enroll a student in a course</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="e-student">Student Name *</Label>
            <Input id="e-student" placeholder="Search student..." value={form.student_name} onChange={set("student_name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="e-course">Course *</Label>
            <Input id="e-course" placeholder="Search course..." value={form.course_name} onChange={set("course_name")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={form.level} onValueChange={(v) => v && setForm((f) => ({ ...f, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Learner">Learner</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Batch</Label>
              <Select value={form.batch} onValueChange={(v) => v && setForm((f) => ({ ...f, batch: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Weekend">Weekend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={form.branch} onValueChange={(v) => v && setForm((f) => ({ ...f, branch: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Madurai HQ">Madurai HQ</SelectItem>
                  <SelectItem value="Chennai Branch">Chennai</SelectItem>
                  <SelectItem value="Bangalore Branch">Bangalore</SelectItem>
                  <SelectItem value="Coimbatore Branch">Coimbatore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-start">Start Date *</Label>
              <Input id="e-start" type="date" value={form.start_date} onChange={set("start_date")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="e-fee">Fee (₹)</Label>
            <Input id="e-fee" type="number" placeholder="35000" value={form.fee} onChange={set("fee")} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!isValid}>Create Enrollment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
