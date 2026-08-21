"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { getActivities, getTasks, markTaskComplete } from "@/lib/api";
import type { Activity, Task, TaskPriority } from "@/lib/types";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { ActivityComposer } from "@/components/crm/activity-composer";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  CheckIcon,
  CalendarIcon,
  UserIcon,
  LinkIcon,
} from "lucide-react";

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ["Activities", "My Tasks"] as const;
type Tab = (typeof TABS)[number];

// ── Priority badge ────────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const map: Record<TaskPriority, { label: string; className: string }> = {
    high: {
      label: "High",
      className:
        "border-red-400 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20",
    },
    normal: { label: "Normal", className: "border-border text-foreground" },
    low: { label: "Low", className: "border-border text-muted-foreground" },
  };
  const { label, className } = map[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}

// ── Relative due date helper ──────────────────────────────────────────────────
function relativeDue(dateStr: string): string {
  const due = new Date(dateStr);
  if (isNaN(due.getTime())) return dateStr;
  const diffDays = Math.round(
    (due.getTime() - Date.now()) / 86_400_000
  );
  if (diffDays === 0) return "Due today";
  if (diffDays === -1) return "Overdue 1 day";
  if (diffDays < 0) return `Overdue ${Math.abs(diffDays)} days`;
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays} days`;
}

function formatDueDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Skeletons ─────────────────────────────────────────────────────────────────
function TaskSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 rounded-xl border border-border p-4"
        >
          <Skeleton className="size-2.5 rounded-full mt-2 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-24 shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ── Task card ─────────────────────────────────────────────────────────────────
function TaskCard({
  task,
  onComplete,
}: {
  task: Task;
  onComplete: (id: string) => void;
}) {
  const isOverdue = task.status === "overdue";
  const isDone = task.status === "complete";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 transition-colors",
        isOverdue
          ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10"
          : isDone
          ? "border-border bg-muted/30 opacity-60"
          : "border-border bg-card"
      )}
    >
      {/* Priority dot */}
      <div
        className={cn(
          "size-2.5 rounded-full mt-2 shrink-0",
          task.priority === "high"
            ? "bg-red-500"
            : task.priority === "low"
            ? "bg-muted-foreground/40"
            : "bg-primary/60"
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-semibold leading-snug",
            isDone && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs",
              isOverdue
                ? "text-red-600 dark:text-red-400 font-medium"
                : "text-muted-foreground"
            )}
          >
            <CalendarIcon className="size-3" />
            {relativeDue(task.due_date)} · {formatDueDate(task.due_date)}
          </span>

          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} size="sm" />

          {task.related_entity_name && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <LinkIcon className="size-3" />
              {task.related_entity_name}
            </span>
          )}

          {task.assignee_name && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <UserIcon className="size-3" />
              {task.assignee_name}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Complete button */}
      {!isDone && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onComplete(task._id)}
          className="shrink-0 gap-1.5"
        >
          <CheckIcon className="size-3.5" />
          Complete
        </Button>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Activities");
  const [composerOpen, setComposerOpen] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    try {
      const res = await getActivities({ page: 1 });
      setActivities(res.data);
    } catch {
      setActivitiesError("Failed to load activities. Please try again.");
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  const loadTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError(null);
    try {
      const res = await getTasks();
      setTasks(res);
    } catch {
      setTasksError("Failed to load tasks. Please try again.");
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
    loadTasks();
  }, [loadActivities, loadTasks]);

  async function handleComplete(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, status: "complete" as const } : t
      )
    );
    await markTaskComplete(taskId);
  }

  const openCount = tasks.filter(
    (t) => t.status === "open" || t.status === "overdue"
  ).length;

  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { overdue: 0, open: 1, complete: 2 };
    return (order[a.status] ?? 1) - (order[b.status] ?? 1);
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Activities &amp; Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All logged interactions and tasks assigned to you
          </p>
        </div>
        <Button onClick={() => setComposerOpen(true)} className="gap-2 shrink-0">
          <PlusIcon className="size-4" />
          Log Activity
        </Button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none",
              activeTab === tab
                ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {tab === "My Tasks" && openCount > 0 && (
              <Badge
                variant="destructive"
                className="rounded-full px-1.5 py-0 text-[10px] min-w-[1.25rem]"
              >
                {openCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Activities tab */}
      {activeTab === "Activities" && (
        <>
          {activitiesError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-muted-foreground text-sm">{activitiesError}</p>
              <Button variant="outline" size="sm" onClick={loadActivities}>
                Retry
              </Button>
            </div>
          ) : (
            <ActivityTimeline
              activities={activities}
              loading={activitiesLoading}
            />
          )}
        </>
      )}

      {/* Tasks tab */}
      {activeTab === "My Tasks" && (
        <>
          {tasksError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-muted-foreground text-sm">{tasksError}</p>
              <Button variant="outline" size="sm" onClick={loadTasks}>
                Retry
              </Button>
            </div>
          ) : tasksLoading ? (
            <TaskSkeleton />
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground text-sm">
                No tasks assigned — great work!
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                {openCount} open &middot;{" "}
                {tasks.filter((t) => t.status === "complete").length} completed
              </p>
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Composer dialog */}
      <ActivityComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        onSave={(data) => {
          console.info("Activity logged:", data);
          loadActivities();
        }}
      />
    </div>
  );
}
