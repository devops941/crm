"use client";

import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface CrudActionsProps {
  data: Record<string, string | number | boolean | string[]>;
  label?: string;
  onDelete?: () => void;
  onSave?: (data: Record<string, string>) => void;
}

export function CrudActions({ data, label = "item", onDelete, onSave }: CrudActionsProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editData, setEditData] = useState<Record<string, string>>({});

  const openEdit = () => {
    const init: Record<string, string> = {};
    Object.entries(data).forEach(([k, v]) => {
      if (k !== "id") init[k] = Array.isArray(v) ? v.join(", ") : String(v);
    });
    setEditData(init);
    setEditOpen(true);
  };

  const displayEntries = Object.entries(data).filter(([k]) => k !== "id");

  const formatKey = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).replace(/_/g, " ");

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" title="View" onClick={() => setViewOpen(true)}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit" onClick={openEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Delete" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ═══ VIEW DIALOG ═══ */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> View {label}
              {data.id && <Badge variant="outline" className="text-[10px] font-mono ml-1">{String(data.id)}</Badge>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {displayEntries.map(([key, value]) => (
              <div key={key} className="flex items-start justify-between py-2 border-b last:border-0">
                <span className="text-sm text-muted-foreground">{formatKey(key)}</span>
                <span className="text-sm font-medium text-right max-w-[60%]">
                  {typeof value === "boolean" ? (
                    <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
                  ) : Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-1 justify-end">{value.map((v, i) => (<Badge key={i} variant="outline" className="text-[10px]">{v}</Badge>))}</div>
                  ) : (
                    String(value)
                  )}
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setViewOpen(false)}>Close</Button>
            <Button onClick={() => { setViewOpen(false); openEdit(); }}>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ EDIT DIALOG ═══ */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Edit {label}
              {data.id && <Badge variant="outline" className="text-[10px] font-mono ml-1">{String(data.id)}</Badge>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            {Object.entries(editData).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs">{formatKey(key)}</Label>
                <Input
                  value={value}
                  onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => { onSave?.(editData); setEditOpen(false); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ DELETE DIALOG ═══ */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-destructive" /> Delete {label}?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this {label}? This action cannot be undone.</p>
          {data.name && <p className="text-sm font-medium">&ldquo;{String(data.name)}&rdquo;</p>}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onDelete?.(); setDeleteOpen(false); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
