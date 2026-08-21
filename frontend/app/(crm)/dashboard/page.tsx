"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/crm/kpi-card";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  DollarSign, Target, BarChart3, FileSignature, AlertTriangle,
  CheckCircle2, Clock, ArrowRight,
} from "lucide-react";
import { getDashboardKPIs, getTasks } from "@/lib/api";
import type { DashboardKPIs, Task } from "@/lib/types";

function formatCurrency(v: number): string {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(0)} L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { user, canViewFinancials } = useAuth();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("quarter");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [kpiData, taskData] = await Promise.all([
      getDashboardKPIs(),
      getTasks({ assignee_id: user?._id, status: "open" }),
    ]);
    setKpis(kpiData);
    setMyTasks(taskData);
    setLoading(false);
  }, [user?._id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filters = [
    { id: "quarter", label: "This Quarter" },
    { id: "verticals", label: "All Verticals" },
    { id: "branches", label: "All Branches" },
    { id: "owner", label: "Owner: All" },
    { id: "region", label: "Region / District" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here is your overview for {user?.branch_name || "all branches"}.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Badge
            key={f.id}
            variant="outline"
            className={`px-3 py-1.5 text-xs cursor-pointer transition-colors ${
              activeFilter === f.id ? "border-primary text-primary font-semibold" : ""
            }`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </Badge>
        ))}
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : kpis ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {canViewFinancials && (
            <KpiCard
              label="Revenue (QTD)"
              value={formatCurrency(kpis.revenue_qtd)}
              icon={DollarSign}
              delta={{ value: `${kpis.revenue_delta_pct}% vs last qtr`, positive: true }}
              onClick={() => {}}
            />
          )}
          <KpiCard
            label="Open Pipeline"
            value={canViewFinancials ? formatCurrency(kpis.open_pipeline) : String(kpis.open_pipeline_count)}
            icon={Target}
            subtitle={`${kpis.open_pipeline_count} opportunities`}
            onClick={() => {}}
          />
          <KpiCard
            label="Win Rate"
            value={`${kpis.win_rate}%`}
            icon={BarChart3}
            subtitle="trailing 90 days"
          />
          {canViewFinancials && (
            <KpiCard
              label="Collections Due"
              value={formatCurrency(kpis.collections_due)}
              icon={AlertTriangle}
              delta={{ value: `${formatCurrency(kpis.collections_overdue)} overdue`, positive: false }}
            />
          )}
          <KpiCard
            label="Active MoUs"
            value={String(kpis.active_mous)}
            icon={FileSignature}
            subtitle={`${kpis.mous_expiring_30d} expiring <30d`}
            onClick={() => {}}
          />
        </div>
      ) : null}

      {/* Revenue by Vertical + Critical Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {canViewFinancials && kpis && (
          <Card className="lg:col-span-2">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Revenue by Vertical</h3>
                <Link href="/reports" className="text-xs text-primary hover:underline">View Reports</Link>
              </div>
              <div className="space-y-3">
                {kpis.revenue_by_vertical.map((v) => {
                  const maxAmt = Math.max(...kpis.revenue_by_vertical.map((x) => x.amount));
                  const pct = Math.round((v.amount / maxAmt) * 100);
                  return (
                    <div key={v.vertical} className="flex items-center gap-3 text-sm">
                      <span className="w-28 text-muted-foreground shrink-0">{v.vertical}</span>
                      <div className="flex-1 bg-muted rounded-sm h-2.5">
                        <div className="h-full bg-primary rounded-sm transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-medium w-16 text-right">{formatCurrency(v.amount)}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Tasks */}
        <Card className={canViewFinancials ? "" : "lg:col-span-3"}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">My Critical Tasks</h3>
              <Link href="/activities" className="text-xs text-primary hover:underline flex items-center gap-1">
                All tasks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : myTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No open tasks. Nice work!</p>
            ) : (
              <div className="space-y-3">
                {myTasks.slice(0, 5).map((t) => (
                  <div
                    key={t._id}
                    className={`border-l-[3px] pl-3 text-sm ${
                      t.priority === "high" ? "border-destructive" : t.priority === "normal" ? "border-amber-500" : "border-border"
                    }`}
                  >
                    <div className="font-medium">{t.title}</div>
                    <div className="text-muted-foreground text-xs flex items-center gap-2 mt-0.5">
                      <Clock className="h-3 w-3" />
                      Due: {new Date(t.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {t.related_entity_name && (
                        <span className="text-muted-foreground">· {t.related_entity_name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {kpis && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Recent Activity</h3>
              <Link href="/activities" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {kpis.recent_activity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No recent activity.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-mono text-muted-foreground uppercase">
                    <td className="py-1 pr-3">Time</td>
                    <td className="py-1 pr-3">Type</td>
                    <td className="py-1 pr-3">Details</td>
                    <td className="py-1">Owner</td>
                  </tr>
                </thead>
                <tbody>
                  {kpis.recent_activity.map((a) => (
                    <tr key={a._id} className="border-t border-border">
                      <td className="py-2.5 pr-3 text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {timeAgo(a.timestamp)}
                      </td>
                      <td className="py-2.5 pr-3">
                        <StatusBadge status={a.type} size="sm" />
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className="font-medium">{a.outcome || a.notes || "Activity logged"}</span>
                      </td>
                      <td className="py-2.5 text-muted-foreground">{a.actor_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
