"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { getNotifications } from "@/lib/api";
import type { Notification, NotificationType } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  BellIcon,
  UserPlusIcon,
  ClockIcon,
  AlertTriangleIcon,
  FileTextIcon,
  CreditCardIcon,
  TrendingUpIcon,
  BuildingIcon,
  CheckCheckIcon,
} from "lucide-react";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

const TYPE_ICON_MAP: Record<NotificationType, React.ElementType> = {
  lead_assigned: UserPlusIcon,
  lead_untouched: ClockIcon,
  task_due: ClockIcon,
  task_overdue: AlertTriangleIcon,
  opportunity_stage_changed: TrendingUpIcon,
  mou_expiring: FileTextIcon,
  payment_pending: CreditCardIcon,
  student_at_risk: AlertTriangleIcon,
  institution_inactive: BuildingIcon,
  proposal_pending: FileTextIcon,
};

const TYPE_COLOR_MAP: Record<NotificationType, string> = {
  lead_assigned: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  lead_untouched: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  task_due: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  task_overdue: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
  opportunity_stage_changed: "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
  mou_expiring: "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
  payment_pending: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
  student_at_risk: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
  institution_inactive: "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
  proposal_pending: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
};

function NotificationIcon({ type }: { type: NotificationType }) {
  const Icon = TYPE_ICON_MAP[type] ?? BellIcon;
  const colorClass = TYPE_COLOR_MAP[type] ?? "bg-muted text-muted-foreground";
  return (
    <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", colorClass)}>
      <Icon className="size-3.5" />
    </div>
  );
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const userId = user?._id ?? "";

  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    getNotifications(userId)
      .then((notifs) => setNotifications(notifs))
      .catch((err) => console.error("Failed to load notifications:", err))
      .finally(() => setLoading(false));
  }, [open, userId]);

  const unreadCount = notifications.filter(
    (n) => !n.read_at && !readIds.has(n._id)
  ).length;

  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n._id)));
  }

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="h-8 w-8 relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted">
        <BellIcon className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        className="w-[380px] p-0 shadow-xl"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs px-1.5 py-0.5 font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCheckIcon className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="size-8 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <BellIcon className="size-8 mx-auto mb-2 opacity-30" />
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {sortedNotifications.map((notif) => {
                const isUnread = !notif.read_at && !readIds.has(notif._id);
                return (
                  <li
                    key={notif._id}
                    onClick={() => markRead(notif._id)}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
                      isUnread
                        ? "bg-primary/3 hover:bg-muted/60"
                        : "hover:bg-muted/40"
                    )}
                  >
                    <NotificationIcon type={notif.type} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm leading-snug",
                            isUnread ? "font-semibold" : "font-medium"
                          )}
                        >
                          {notif.title}
                        </p>
                        {isUnread && (
                          <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {timeAgo(notif.created_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {sortedNotifications.length > 0 && (
          <div className="border-t border-border px-4 py-2.5">
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center">
              View all notifications
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
