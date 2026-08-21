"use client";

import { useState } from "react";
import { BookOpen, ClipboardList, CheckCircle2, ExternalLink, User, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

const topics = [
  { id: "t1", name: "useState & useEffect Deep Dive", obj: "Understand side-effect management and state lifecycle in functional components", res: "https://react.dev/reference/react/useState", diff: "Easy" },
  { id: "t2", name: "useContext & Context API", obj: "Share state across the component tree without prop drilling", res: "https://react.dev/reference/react/useContext", diff: "Medium" },
  { id: "t3", name: "Custom Hooks", obj: "Extract and reuse stateful logic by building your own hooks", res: "", diff: "Hard" },
];
const assignment = "Build a theme-switcher using Context API + a custom useTheme() hook. The hook should expose the current theme and a toggle function. Persist the preference in localStorage via useEffect.";
const teacher = "Arjun Mehta";
const diffColors: Record<string, string> = { Easy: "bg-emerald-500/10 text-emerald-600", Medium: "bg-yellow-500/10 text-yellow-600", Hard: "bg-red-500/10 text-red-600" };

export default function TodayPage() {
  const [done, setDone] = useState<string[]>([]);
  const day = 81, total = 180;
  const toggle = (id: string) => setDone((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const pct = Math.round((done.length / topics.length) * 100);

  return (
    <div className="p-4 space-y-4">
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">Day {day}</Badge>
            <Badge className={`text-[10px] ${pct === 100 ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`}>{pct === 100 ? "Done" : "In Progress"}</Badge>
          </div>
          <span className="text-[10px] text-muted-foreground">{new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}</span>
        </div>
        <h2 className="text-base font-bold mt-1">Full Stack Web Development</h2>
        <div className="flex items-center gap-2 mt-2"><Progress value={Math.round((day / total) * 100)} className="h-1.5 flex-1" /><span className="text-[10px] text-muted-foreground">{day}/{total}</span></div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground"><User className="h-3 w-3" /> {teacher}</div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> Topics</h3><span className="text-xs text-muted-foreground">{done.length}/{topics.length}</span></div>
        <div className="space-y-2">
          {topics.map((t) => {
            const isDone = done.includes(t.id);
            return (
              <div key={t.id} onClick={() => toggle(t.id)} className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${isDone ? "bg-emerald-500/5 border-emerald-500/15" : "bg-card"}`}>
                <Checkbox checked={isDone} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>{t.name}</span><span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${diffColors[t.diff]}`}>{t.diff}</span></div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{t.obj}</p>
                  {t.res && <a href={t.res} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary flex items-center gap-0.5 mt-1" onClick={(e) => e.stopPropagation()}><ExternalLink className="h-3 w-3" /> Resource</a>}
                </div>
                {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
              </div>
            );
          })}
        </div>
        <Progress value={pct} className="h-1.5 mt-3" />
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2"><ClipboardList className="h-4 w-4" /> Assignment</h3>
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{assignment}</p>
        <Button variant="outline" size="sm" className="w-full mt-3 rounded-lg">Upload Submission</Button>
      </div>

      {pct === 100 && <a href="/student/checkout"><Button className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700">Check Out <ChevronRight className="h-4 w-4 ml-1" /></Button></a>}
    </div>
  );
}
