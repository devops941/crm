"use client";

import { useState } from "react";
import { Star, CheckCircle2, Clock, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CheckoutPage() {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [difficulties, setDifficulties] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const checkInTime = "09:15 AM";
  const checkOutTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const duration = "8h 15m";
  const topics = [{ name: "Topic Name", done: true }, { name: "Topic Name", done: true }, { name: "Topic Name", done: false }];

  if (submitted) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4"><CheckCircle2 className="h-12 w-12 text-emerald-500" /></div>
        <h2 className="text-xl font-bold mb-1">Checked Out!</h2>
        <p className="text-sm text-muted-foreground">{checkOutTime} &bull; {duration}</p>
        <p className="text-xs text-muted-foreground mt-1 mb-6">Notes saved</p>
        <div className="flex gap-3 w-full"><a href="/student/progress" className="flex-1"><Button variant="outline" className="w-full rounded-xl">Progress</Button></a><a href="/student/attendance" className="flex-1"><Button className="w-full rounded-xl">Attendance</Button></a></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-center">
        <Badge variant="outline" className="font-mono text-xs">Day 45</Badge>
        <h2 className="text-base font-bold mt-2">Daily Check-Out</h2>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
          <span><Clock className="h-3.5 w-3.5 inline mr-0.5" />{checkInTime}</span>
          <span><Clock className="h-3.5 w-3.5 inline mr-0.5" />{checkOutTime}</span>
        </div>
        <p className="text-sm font-semibold mt-1">{duration}</p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Topics</h3>
        <div className="space-y-2">
          {topics.map((t, i) => (<div key={i} className="flex items-center gap-2.5">{t.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-muted-foreground/40" />}<span className={`text-sm ${t.done ? "" : "text-muted-foreground"}`}>{t.name}</span></div>))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">{topics.filter((t) => t.done).length}/{topics.length} completed</p>
      </div>

      <div className="rounded-xl border bg-card p-4 text-center">
        <h3 className="text-sm font-semibold mb-3">Rate Today *</h3>
        <div className="flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (<button key={s} onClick={() => setRating(s)} className="p-0.5 active:scale-90 transition-transform"><Star className={`h-9 w-9 ${s <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/20"}`} /></button>))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">{rating === 0 ? "Tap to rate" : `${rating}/5`}</p>
      </div>

      <div className="rounded-xl border bg-card p-4"><h3 className="text-sm font-semibold mb-2">What did you learn?</h3><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Key takeaways..." className="rounded-lg min-h-[80px]" /></div>
      <div className="rounded-xl border bg-card p-4"><h3 className="text-sm font-semibold mb-2">Doubts?</h3><Textarea value={difficulties} onChange={(e) => setDifficulties(e.target.value)} placeholder="Topics you found confusing..." className="rounded-lg min-h-[60px]" /></div>

      <div className="rounded-xl border bg-muted/30 p-4"><h3 className="text-xs font-semibold text-muted-foreground mb-1.5">Tomorrow (Day 46)</h3><p className="text-sm text-muted-foreground">&bull; Topic Name</p><p className="text-sm text-muted-foreground">&bull; Topic Name</p></div>

      <Button className="w-full h-14 text-base rounded-xl bg-emerald-600 hover:bg-emerald-700" onClick={() => setSubmitted(true)} disabled={rating === 0}><CheckCircle2 className="h-5 w-5 mr-2" /> Submit &amp; Check Out</Button>
    </div>
  );
}
