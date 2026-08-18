"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export function AddStaffDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Name" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Phone</Label><Input placeholder="Phone" /></div>
            <div className="space-y-2"><Label>Branch</Label><Select><SelectTrigger><SelectValue placeholder="Select branch..." /></SelectTrigger><SelectContent><SelectItem value="b1">Branch 1</SelectItem></SelectContent></Select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select role..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher / Instructor</SelectItem>
                  <SelectItem value="counsellor">Counsellor</SelectItem>
                  <SelectItem value="branch_admin">Branch Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="view_only">View Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="Set password" /></div>
          </div>
          <div className="space-y-2">
            <Label>Assigned Courses (for Teachers)</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select courses..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="c1">Course 1</SelectItem>
                <SelectItem value="c2">Course 2</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">Teachers can be assigned to multiple courses to track student progress</p>
          </div>
          <div className="space-y-2"><Label>Status</Label>
            <RadioGroup defaultValue="active" className="flex gap-4">
              <div className="flex items-center gap-2"><RadioGroupItem value="active" id="sta" /><Label htmlFor="sta" className="text-sm font-normal">Active</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="inactive" id="sti" /><Label htmlFor="sti" className="text-sm font-normal">Inactive</Label></div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={() => onOpenChange(false)}>Save Staff</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Keep old export for backward compat
export { AddStaffDialog as AddCounsellorDialog };
