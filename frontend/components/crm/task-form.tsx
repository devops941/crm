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
import { Badge } from "@/components/ui/badge";
import type { TaskPriority } from "@/lib/types";

interface RelatedEntity {
  type: string;
  id: string;
  name: string;
}

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedEntity?: RelatedEntity;
  onSave: (data: TaskFormData) => void;
}

export interface TaskFormData {
  title: string;
  description: string;
  assignee: string;
  due_date: string;
  priority: TaskPriority;
  related_entity?: RelatedEntity;
}

const EMPTY: Omit<TaskFormData, "related_entity"> = {
  title: "",
  description: "",
  assignee: "",
  due_date: "",
  priority: "normal",
};

export function TaskForm({ open, onOpenChange, relatedEntity, onSave }: TaskFormProps) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  function set(field: keyof typeof EMPTY) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSave() {
    const data: TaskFormData = {
      ...form,
      related_entity: relatedEntity,
    };
    onSave(data);
    setForm(EMPTY);
    onOpenChange(false);
  }

  function handleCancel() {
    setForm(EMPTY);
    onOpenChange(false);
  }

  const isValid = form.title.trim().length > 0 && form.due_date.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Related entity badge */}
          {relatedEntity && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Related to:</span>
              <Badge variant="outline" className="text-xs">
                <span className="capitalize text-muted-foreground mr-1">
                  {relatedEntity.type}
                </span>
                {relatedEntity.name}
              </Badge>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="e.g. Send proposal to Dr. Ramesh"
              value={form.title}
              onChange={set("title")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              placeholder="Additional details…"
              rows={2}
              value={form.description}
              onChange={set("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Input
                id="task-assignee"
                placeholder="Name or email"
                value={form.assignee}
                onChange={set("assignee")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-due">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-due"
                type="date"
                value={form.due_date}
                onChange={set("due_date")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              value={form.priority}
              onValueChange={(val) =>
                setForm((f) => ({ ...f, priority: val as TaskPriority }))
              }
            >
              <SelectTrigger id="task-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
