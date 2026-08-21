"use client";

import { MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Timer, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cfg: Record<string, { icon: typeof CheckCircle2; color: string; bg: string; dot: string }> = {
  Present: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5", dot: "bg-emerald-500" },
  Absent: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/5", dot: "bg-red-500" },
  Late: { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/5", dot: "bg-yellow-500" },
  "Half-day": { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/5", dot: "bg-orange-500" },
};

const records = [
  { day: 81, date: "Aug 21", in: "09:15 AM", out: "05:30 PM", dur: "8h 15m", dist: "45m", status: "Present", reason: "" },
  { day: 80, date: "Aug 20", in: "09:45 AM", out: "05:00 PM", dur: "7h 15m", dist: "32m", status: "Late", reason: "Traffic" },
  { day: 79, date: "Aug 19", in: "09:00 AM", out: "05:45 PM", dur: "8h 45m", dist: "28m", status: "Present", reason: "" },
  { day: 78, date: "Aug 18", in: "—", out: "—", dur: "—", dist: "—", status: "Absent", reason: "Sick leave" },
  { day: 77, date: "Aug 15", in: "09:10 AM", out: "12:30 PM", dur: "3h 20m", dist: "55m", status: "Half-day", reason: "Independence Day holiday — half session" },
  { day: 76, date: "Aug 14", in: "08:55 AM", out: "05:30 PM", dur: "8h 35m", dist: "20m", status: "Present", reason: "" },
];

const sum = { present: 65, absent: 5, late: 8, half: 3, total: 81 };

export default function StudentAttendancePage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-base font-bold">Attendance</h1><Button variant="outline" size="sm" className="rounded-lg text-xs h-8"><Download className="h-3.5 w-3.5 mr-1" /> PDF</Button></div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { v: sum.present, l: "Present", c: "text-emerald-600", b: "border-t-emerald-500" },
          { v: sum.absent, l: "Absent", c: "text-red-600", b: "border-t-red-500" },
          { v: sum.late + sum.half, l: "Late/Half", c: "text-yellow-600", b: "border-t-yellow-500" },
          { v: `${Math.round((sum.present / sum.total) * 100)}%`, l: "Rate", c: "", b: "border-t-primary" },
        ].map((s) => (<div key={s.l} className={`rounded-xl border bg-card p-2.5 text-center border-t-2 ${s.b}`}><div className={`text-lg font-bold ${s.c}`}>{s.v}</div><div className="text-[9px] text-muted-foreground">{s.l}</div></div>))}
      </div>

      <div className="space-y-2">
        {records.map((r) => {
          const c = cfg[r.status];
          return (
            <div key={r.day} className={`rounded-xl border p-3.5 ${c.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${c.dot}`} /><Badge variant="outline" className="font-mono text-[10px]">Day {r.day}</Badge><span className="text-[10px] text-muted-foreground">{r.date}</span></div>
                <Badge variant="outline" className={`text-[9px] ${c.color}`}>{r.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {r.in}–{r.out}</span>
                <span className="flex items-center gap-0.5"><Timer className="h-3 w-3" /> {r.dur}</span>
                <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {r.dist}</span>
              </div>
              {r.reason && <p className="text-[10px] text-muted-foreground mt-1.5 italic">Reason: {r.reason}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
