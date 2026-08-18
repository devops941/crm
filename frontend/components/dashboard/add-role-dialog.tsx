"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddRoleDialogProps { open: boolean; onOpenChange: (open: boolean) => void; }

export function AddRoleDialog({ open, onOpenChange }: AddRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Career Role</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2"><Label>Role Title</Label><Input placeholder="e.g. Backend Engineer" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Min Salary (LPA)</Label><Input type="number" placeholder="4" /></div>
            <div className="space-y-2"><Label>Max Salary (LPA)</Label><Input type="number" placeholder="10" /></div>
          </div>
          <div className="space-y-2"><Label>Demand Level</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="very-high">Very High</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter><Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={() => onOpenChange(false)}>Save Role</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
