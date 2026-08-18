"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddBranchDialogProps { open: boolean; onOpenChange: (open: boolean) => void; }

export function AddBranchDialog({ open, onOpenChange }: AddBranchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Branch</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2"><Label>Branch Name *</Label><Input placeholder="Branch name" /></div>
          <div className="space-y-2"><Label>Address</Label><Textarea placeholder="Full address..." /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>City *</Label><Input placeholder="City" /></div>
            <div className="space-y-2"><Label>State *</Label><Input placeholder="State" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Phone</Label><Input type="tel" placeholder="+91 ..." /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="branch@company.com" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Latitude *</Label><Input type="number" step="any" placeholder="13.0827" /></div>
            <div className="space-y-2"><Label>Longitude *</Label><Input type="number" step="any" placeholder="80.2707" /></div>
            <div className="space-y-2"><Label>Radius (m) *</Label><Input type="number" placeholder="100" /></div>
          </div>
          <p className="text-[10px] text-muted-foreground">GPS coordinates for geofenced check-in. Students must be within the radius to check in.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Opening Time</Label><Input type="time" defaultValue="09:00" /></div>
            <div className="space-y-2"><Label>Closing Time</Label><Input type="time" defaultValue="18:00" /></div>
          </div>
          <div className="space-y-2"><Label>Max Capacity (seats)</Label><Input type="number" placeholder="e.g. 100" /></div>

          <div className="space-y-2"><Label>Branch Admin</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select admin..." /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2"><Label>Status</Label>
            <RadioGroup defaultValue="active" className="flex gap-4">
              <div className="flex items-center gap-2"><RadioGroupItem value="active" id="ba" /><Label htmlFor="ba" className="text-sm font-normal">Active</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="inactive" id="bi" /><Label htmlFor="bi" className="text-sm font-normal">Inactive</Label></div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={() => onOpenChange(false)}>Save Branch</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
