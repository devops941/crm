"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  UserIcon,
  BuildingIcon,
  GraduationCapIcon,
  TrendingUpIcon,
  BriefcaseIcon,
  ActivityIcon,
  CheckSquareIcon,
  FileTextIcon,
  BookOpenIcon,
  ClipboardListIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type QuickCreateEntityType =
  | "person"
  | "organization"
  | "institution"
  | "lead"
  | "opportunity"
  | "activity"
  | "task"
  | "mou"
  | "student"
  | "enrollment";

interface EntityOption {
  type: QuickCreateEntityType;
  label: string;
  description: string;
  icon: React.ElementType;
}

const ENTITY_OPTIONS: EntityOption[] = [
  {
    type: "person",
    label: "Person",
    description: "Add a new contact or individual",
    icon: UserIcon,
  },
  {
    type: "organization",
    label: "Organization",
    description: "Add a company, college, or institution",
    icon: BuildingIcon,
  },
  {
    type: "institution",
    label: "Institution",
    description: "Add an academic institution directly",
    icon: GraduationCapIcon,
  },
  {
    type: "lead",
    label: "Lead",
    description: "Capture a new inbound or outbound lead",
    icon: TrendingUpIcon,
  },
  {
    type: "opportunity",
    label: "Opportunity",
    description: "Create a qualified deal or opportunity",
    icon: BriefcaseIcon,
  },
  {
    type: "activity",
    label: "Activity",
    description: "Log a call, meeting, or interaction",
    icon: ActivityIcon,
  },
  {
    type: "task",
    label: "Task",
    description: "Create a follow-up task or reminder",
    icon: CheckSquareIcon,
  },
  {
    type: "mou",
    label: "MoU",
    description: "Draft a Memorandum of Understanding",
    icon: FileTextIcon,
  },
  {
    type: "student",
    label: "Student",
    description: "Register a new student record",
    icon: BookOpenIcon,
  },
  {
    type: "enrollment",
    label: "Enrollment",
    description: "Enroll a student in a program",
    icon: ClipboardListIcon,
  },
];

interface QuickCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEntity: (type: QuickCreateEntityType) => void;
}

export function QuickCreate({ open, onOpenChange, onCreateEntity }: QuickCreateProps) {
  function handleSelect(type: QuickCreateEntityType) {
    onOpenChange(false);
    // Small delay so the Sheet can begin closing before the Dialog opens
    setTimeout(() => onCreateEntity(type), 150);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:max-w-sm p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <SheetTitle>Quick Create</SheetTitle>
          <SheetDescription>
            Choose an entity type to create
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col overflow-y-auto py-2">
          {ENTITY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.type}
                type="button"
                className={cn(
                  "flex items-center gap-3 px-5 py-3 text-left transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:bg-accent"
                )}
                onClick={() => handleSelect(opt.type)}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-tight">
                    {opt.label}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
                    {opt.description}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
