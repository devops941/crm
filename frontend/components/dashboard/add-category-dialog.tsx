"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2"><Label>Category Name</Label><Input placeholder="e.g. Coding & Development" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Brief description..." /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Icon (Emoji)</Label><Input placeholder="💻" /></div>
            <div className="space-y-2"><Label>Display Order</Label><Input type="number" placeholder="1" /></div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup defaultValue="active" className="flex gap-4">
              <div className="flex items-center gap-2"><RadioGroupItem value="active" id="ca" /><Label htmlFor="ca" className="text-sm font-normal">Active</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="inactive" id="ci" /><Label htmlFor="ci" className="text-sm font-normal">Inactive</Label></div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onOpenChange(false)}>Save Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
