"use client";

import { TrendingUp, Users, Phone, UserCheck, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversionFunnel } from "@/components/dashboard/crm/conversion-funnel";
import { SeatReservations } from "@/components/dashboard/crm/seat-reservation";

const crmStats = [
  { label: "Total Leads", value: "—", change: "+— this week", icon: Users, color: "border-t-blue-500" },
  { label: "Conversion Rate", value: "— %", change: "— enrolled / — total", icon: TrendingUp, color: "border-t-emerald-500" },
  { label: "Pending Follow-ups", value: "—", change: "— overdue", icon: Phone, color: "border-t-orange-500" },
  { label: "This Month Enrolled", value: "—", change: "— revenue", icon: UserCheck, color: "border-t-violet-500" },
];

const counsellorPerformance = [
  { name: "—", leads: "—", converted: "—", rate: "— %", avgTime: "— days", followups: "—" },
  { name: "—", leads: "—", converted: "—", rate: "— %", avgTime: "— days", followups: "—" },
  { name: "—", leads: "—", converted: "—", rate: "— %", avgTime: "— days", followups: "—" },
];

const leadSources = [
  { source: "Website", count: "—", pct: 40, color: "bg-blue-500" },
  { source: "Referral", count: "—", pct: 25, color: "bg-emerald-500" },
  { source: "Walk-in", count: "—", pct: 20, color: "bg-violet-500" },
  { source: "Social Media", count: "—", pct: 10, color: "bg-pink-500" },
  { source: "Ads", count: "—", pct: 5, color: "bg-orange-500" },
];

export default function CRMDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">CRM Dashboard</h1>
          <Badge variant="secondary">OVERVIEW</Badge>
        </div>
        <div className="flex gap-2">
          <a href="/dashboard/leads"><Button variant="outline" size="sm">All Leads</Button></a>
          <a href="/dashboard/followups"><Button variant="outline" size="sm">Follow-ups</Button></a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {crmStats.map((s) => (
          <Card key={s.label} className={`border-t-4 ${s.color}`}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
                <s.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="funnel">
        <TabsList>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="counsellors">Counsellor Performance</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
          <TabsTrigger value="reservations">Seat Reservations</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="mt-4">
          <ConversionFunnel />
        </TabsContent>

        <TabsContent value="counsellors" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Counsellor Performance</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-muted-foreground border-b">
                  <th className="text-left py-2">Counsellor</th><th className="text-left py-2">Total Leads</th>
                  <th className="text-left py-2">Converted</th><th className="text-left py-2">Rate</th>
                  <th className="text-left py-2">Avg Time</th><th className="text-left py-2">Follow-ups Done</th>
                </tr></thead>
                <tbody>
                  {counsellorPerformance.map((c, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2.5 font-medium">{c.name}</td>
                      <td className="py-2.5 text-muted-foreground">{c.leads}</td>
                      <td className="py-2.5 text-muted-foreground">{c.converted}</td>
                      <td className="py-2.5"><Badge variant="outline" className="text-[10px] text-emerald-500">{c.rate}</Badge></td>
                      <td className="py-2.5 text-muted-foreground">{c.avgTime}</td>
                      <td className="py-2.5 text-muted-foreground">{c.followups}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Lead Sources</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {leadSources.map((s) => (
                <div key={s.source} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-muted-foreground text-right">{s.source}</span>
                  <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                    <div className={`h-full rounded ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="w-12 text-xs text-muted-foreground">{s.count}</span>
                  <span className="w-10 text-xs font-medium">{s.pct}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations" className="mt-4">
          <SeatReservations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
