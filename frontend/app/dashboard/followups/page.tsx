"use client";

import { AlertTriangle, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowupCard } from "@/components/dashboard/crm/followup-card";

const todayFollowups = [
  { student: "—", course: "—", date: "Today", time: "10:00 AM", mode: "Call" as const, status: "Pending" as const, counsellor: "—", notes: "Discuss fee structure and batch options" },
  { student: "—", course: "—", date: "Today", time: "02:30 PM", mode: "Visit" as const, status: "Pending" as const, counsellor: "—", notes: "Student visiting center for demo class" },
  { student: "—", course: "—", date: "Today", time: "04:00 PM", mode: "Call" as const, status: "Completed" as const, counsellor: "—", notes: "Confirmed enrollment, will pay fee tomorrow" },
];

const overdueFollowups = [
  { student: "—", course: "—", date: "Yesterday", time: "11:00 AM", mode: "Call" as const, status: "Overdue" as const, counsellor: "—", notes: "Student was unavailable, reschedule needed" },
  { student: "—", course: "—", date: "2 days ago", time: "03:00 PM", mode: "Visit" as const, status: "Overdue" as const, counsellor: "—", notes: "No-show at center" },
];

const upcomingFollowups = [
  { student: "—", course: "—", date: "Tomorrow", time: "09:30 AM", mode: "Call" as const, status: "Pending" as const, counsellor: "—", notes: "First contact — new lead from website" },
  { student: "—", course: "—", date: "Tomorrow", time: "11:00 AM", mode: "Email" as const, status: "Pending" as const, counsellor: "—", notes: "Send updated course brochure" },
  { student: "—", course: "—", date: "In 3 days", time: "02:00 PM", mode: "Visit" as const, status: "Pending" as const, counsellor: "—", notes: "Demo class + campus tour" },
];

export default function FollowupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Follow-ups</h1>
          <Badge variant="secondary">SCHEDULE</Badge>
        </div>
        <div className="flex gap-2">
          <a href="/dashboard/crm"><Button variant="outline" size="sm">CRM Dashboard</Button></a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-t-4 border-t-yellow-500"><CardContent className="pt-4">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-500" /><div><div className="text-xl font-bold">{todayFollowups.length}</div><div className="text-xs text-muted-foreground">Today</div></div></div>
        </CardContent></Card>
        <Card className="border-t-4 border-t-red-500"><CardContent className="pt-4">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500" /><div><div className="text-xl font-bold">{overdueFollowups.length}</div><div className="text-xs text-muted-foreground">Overdue</div></div></div>
        </CardContent></Card>
        <Card className="border-t-4 border-t-blue-500"><CardContent className="pt-4">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500" /><div><div className="text-xl font-bold">{upcomingFollowups.length}</div><div className="text-xs text-muted-foreground">Upcoming</div></div></div>
        </CardContent></Card>
        <Card className="border-t-4 border-t-emerald-500"><CardContent className="pt-4">
          <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><div><div className="text-xl font-bold">1</div><div className="text-xs text-muted-foreground">Completed Today</div></div></div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="All Counsellors" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Counsellors</SelectItem></SelectContent>
        </Select>
        <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="Mode" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Modes</SelectItem><SelectItem value="call">Call</SelectItem><SelectItem value="visit">Visit</SelectItem><SelectItem value="email">Email</SelectItem></SelectContent>
        </Select>
        <Input type="date" className="w-[160px]" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overdue">
        <TabsList>
          <TabsTrigger value="overdue" className="text-xs">Overdue ({overdueFollowups.length})</TabsTrigger>
          <TabsTrigger value="today" className="text-xs">Today ({todayFollowups.length})</TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs">Upcoming ({upcomingFollowups.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overdue" className="mt-4 space-y-3">
          {overdueFollowups.length === 0 ? (
            <Card><CardContent className="pt-6 text-center text-sm text-muted-foreground py-8">No overdue follow-ups</CardContent></Card>
          ) : overdueFollowups.map((f, i) => <FollowupCard key={i} {...f} />)}
        </TabsContent>

        <TabsContent value="today" className="mt-4 space-y-3">
          {todayFollowups.map((f, i) => <FollowupCard key={i} {...f} />)}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcomingFollowups.map((f, i) => <FollowupCard key={i} {...f} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
