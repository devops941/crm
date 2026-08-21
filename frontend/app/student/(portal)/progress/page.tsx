"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const d = { course: "Full Stack Web Development", level: "Learner", day: 81, total: 180, rem: 99, topics: { d: 220, t: 540 }, assign: { d: 68, t: 81 }, att: { p: 72, t: 81 }, rating: 4.2, streak: 12, weak: ["CSS Flexbox & Grid Layout", "Async/Await & Promise Chaining"] };
const recent = [
  { day: 81, title: "React Hooks & Context API", topics: "2/3", rating: 4 },
  { day: 80, title: "Component Lifecycle & useEffect", topics: "4/4", rating: 5 },
  { day: 79, title: "React Router v6 & Nested Routes", topics: "3/4", rating: 3 },
  { day: 78, title: "State Management with useState", topics: "5/5", rating: 4 },
  { day: 77, title: "Introduction to React & JSX", topics: "3/3", rating: 4 },
];

function Stat({ val, label, pct, color }: { val: string; label: string; pct: number; color: string }) {
  return (<div className="rounded-xl border bg-card p-3.5"><div className="text-xl font-bold">{val}</div><div className="text-[10px] text-muted-foreground mt-0.5">{label}</div><div className="h-1 rounded-full mt-2 bg-muted overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} /></div></div>);
}

export default function StudentProgressPage() {
  const dayPct = Math.round((d.day / d.total) * 100), topP = Math.round((d.topics.d / d.topics.t) * 100), assP = Math.round((d.assign.d / d.assign.t) * 100), attP = Math.round((d.att.p / d.att.t) * 100);

  return (
    <div className="p-4 space-y-4">
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
        <div className="flex items-center justify-between mb-1"><h2 className="text-base font-bold">{d.course}</h2><Badge variant="outline" className="font-mono text-[10px]">Day {d.day}</Badge></div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><span>{d.level}</span><span>&bull;</span><Badge className="bg-emerald-500/10 text-emerald-600 text-[9px] px-1.5 py-0">Active</Badge><span>&bull;</span><span>{d.rem} days left</span></div>
        <div className="flex items-center gap-2 mt-3"><Progress value={dayPct} className="h-2 flex-1" /><span className="text-xs font-semibold">{dayPct}%</span></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat val={`${topP}%`} label={`Topics (${d.topics.d}/${d.topics.t})`} pct={topP} color="bg-emerald-500" />
        <Stat val={`${assP}%`} label={`Assignments (${d.assign.d}/${d.assign.t})`} pct={assP} color="bg-violet-500" />
        <Stat val={`${attP}%`} label={`Attendance (${d.att.p}/${d.att.t})`} pct={attP} color="bg-cyan-500" />
        <div className="rounded-xl border bg-card p-3.5"><div className="text-xl font-bold">{d.streak} days</div><div className="text-[10px] text-muted-foreground mt-0.5">Streak</div><div className="text-xs mt-2">{d.rating}/5 avg</div></div>
      </div>

      {d.weak.length > 0 && (<div className="rounded-xl border-l-4 border-l-yellow-500 border bg-card p-4"><h3 className="text-sm font-semibold mb-2">Needs Improvement</h3>{d.weak.map((t) => (<p key={t} className="text-sm text-muted-foreground">&bull; {t}</p>))}<p className="text-[10px] text-muted-foreground mt-2">Low completion or flagged difficult</p></div>)}

      <div>
        <h3 className="text-sm font-semibold mb-3">Recent Days</h3>
        <div className="space-y-2">
          {recent.map((r) => (
            <div key={r.day} className="flex items-center gap-3 p-3 rounded-xl border bg-card">
              <Badge variant="outline" className="font-mono text-[10px] w-12 justify-center flex-shrink-0">D{r.day}</Badge>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{r.title}</p><p className="text-[10px] text-muted-foreground">Topics: {r.topics}</p></div>
              <div className="flex gap-0.5 flex-shrink-0">{[1, 2, 3, 4, 5].map((s) => (<div key={s} className={`w-2 h-2 rounded-full ${s <= r.rating ? "bg-yellow-500" : "bg-muted"}`} />))}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
