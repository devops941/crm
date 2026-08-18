"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const domains = [
  { id: "coding", name: "Coding", icon: "💻", courses: [
    { id: "c1", name: "Full Stack Developer", score: 93, recommended: true, duration: "6 months", fee: "₹35,000" },
    { id: "c2", name: "Frontend Developer", score: 78, recommended: false, duration: "4 months", fee: "₹22,000" },
    { id: "c3", name: "Backend Developer", score: 62, recommended: false, duration: "5 months", fee: "₹28,000" },
  ]},
  { id: "ai", name: "AI & Data", icon: "🤖", courses: [
    { id: "c4", name: "Data Science", score: 88, recommended: true, duration: "6 months", fee: "₹40,000" },
    { id: "c5", name: "Machine Learning", score: 71, recommended: false, duration: "8 months", fee: "₹45,000" },
  ]},
  { id: "business", name: "Business", icon: "📊", courses: [
    { id: "c6", name: "Digital Marketing", score: 45, recommended: false, duration: "3 months", fee: "₹15,000" },
  ]},
  { id: "design", name: "Design", icon: "🎨", courses: [
    { id: "c7", name: "UI/UX Design", score: 82, recommended: false, duration: "4 months", fee: "₹25,000" },
    { id: "c8", name: "Graphic Design", score: 55, recommended: false, duration: "3 months", fee: "₹18,000" },
  ]},
  { id: "cloud", name: "Cloud", icon: "☁️", courses: [
    { id: "c9", name: "Cloud & DevOps", score: 90, recommended: true, duration: "6 months", fee: "₹38,000" },
  ]},
  { id: "marketing", name: "Marketing", icon: "📈", courses: [
    { id: "c10", name: "Social Media Marketing", score: 40, recommended: false, duration: "2 months", fee: "₹10,000" },
  ]},
];

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <Progress value={score} className="h-1.5 flex-1" />
      <span className={`text-xs font-bold min-w-[32px] text-right ${score >= 85 ? "text-emerald-500" : score >= 60 ? "text-blue-500" : "text-muted-foreground"}`}>{score}%</span>
    </div>
  );
}

export default function CelestialMapPage() {
  const [expanded, setExpanded] = useState<string | null>("coding");
  const recommended = domains.flatMap((d) => d.courses.filter((c) => c.recommended));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/student/discovery"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div className="flex-1"><h1 className="text-sm font-bold">Course Map</h1><p className="text-[10px] text-muted-foreground">Tap a domain to explore</p></div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> Recommended</div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Student */}
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 mx-auto flex items-center justify-center text-2xl mb-2">👤</div>
          <h2 className="text-sm font-bold">Your Course Recommendations</h2>
          <p className="text-xs text-muted-foreground mt-1">{domains.reduce((s, d) => s + d.courses.length, 0)} courses &bull; {domains.length} domains</p>
        </div>

        {/* Top Picks */}
        {recommended.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Top Picks</h3>
            <div className="space-y-2">
              {recommended.map((c) => (
                <Link key={c.id} href={`/student/courses/${c.id}`}>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-yellow-500/20 bg-yellow-500/5 active:scale-[0.98] transition-transform">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0"><Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5"><span>{c.duration}</span><span>&bull;</span><span>{c.fee}</span></div>
                      <ScoreBar score={c.score} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Domains */}
        <div>
          <h3 className="text-sm font-semibold mb-2">All Domains</h3>
          <div className="space-y-2">
            {domains.map((domain) => {
              const isOpen = expanded === domain.id;
              const topScore = Math.max(...domain.courses.map((c) => c.score));
              const hasRec = domain.courses.some((c) => c.recommended);
              return (
                <div key={domain.id} className="rounded-xl border bg-card overflow-hidden">
                  <button onClick={() => setExpanded(isOpen ? null : domain.id)} className="w-full flex items-center gap-3 p-3.5 text-left active:bg-muted/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl flex-shrink-0">{domain.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="text-sm font-semibold">{domain.name}</span>{hasRec && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}</div>
                      <p className="text-[10px] text-muted-foreground">{domain.courses.length} courses &bull; Best: {topScore}%</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t px-3.5 pb-3 pt-2 space-y-2">
                      {domain.courses.map((course) => (
                        <Link key={course.id} href={`/student/courses/${course.id}`}>
                          <div className={`flex items-center gap-3 p-3 rounded-lg border active:scale-[0.98] transition-transform ${course.recommended ? "border-yellow-500/20 bg-yellow-500/5" : "bg-muted/20"}`}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">{course.recommended && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />}<span className="text-sm font-medium truncate">{course.name}</span></div>
                              <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5"><span>{course.duration}</span><span>&bull;</span><span>{course.fee}</span></div>
                              <ScoreBar score={course.score} />
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="rounded-xl border bg-muted/30 p-3 text-[10px] text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> ≥85%</span>
            <span className="flex items-center gap-1"><div className="w-3 h-1.5 rounded-full bg-blue-500" /> 40-84%</span>
            <span>&lt;40% Hidden</span>
          </div>
        </div>
      </div>
    </div>
  );
}
