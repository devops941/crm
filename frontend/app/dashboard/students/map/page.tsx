"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const domains = [
  { id: "coding", name: "Coding", icon: "💻", angle: 0, courses: [
    { id: "c1", name: "Full Stack Developer", score: 93, recommended: true, duration: "6 months", fee: "₹35,000" },
    { id: "c2", name: "Frontend Developer", score: 78, recommended: false, duration: "4 months", fee: "₹22,000" },
    { id: "c3", name: "Backend Developer", score: 62, recommended: false, duration: "5 months", fee: "₹28,000" },
  ]},
  { id: "ai", name: "AI & Data", icon: "🤖", angle: 60, courses: [
    { id: "c4", name: "Data Science", score: 88, recommended: true, duration: "6 months", fee: "₹40,000" },
    { id: "c5", name: "Machine Learning", score: 71, recommended: false, duration: "8 months", fee: "₹45,000" },
  ]},
  { id: "business", name: "Business", icon: "📊", angle: 120, courses: [
    { id: "c6", name: "Digital Marketing", score: 45, recommended: false, duration: "3 months", fee: "₹15,000" },
  ]},
  { id: "design", name: "Design", icon: "🎨", angle: 180, courses: [
    { id: "c7", name: "UI/UX Design", score: 82, recommended: false, duration: "4 months", fee: "₹25,000" },
    { id: "c8", name: "Graphic Design", score: 55, recommended: false, duration: "3 months", fee: "₹18,000" },
  ]},
  { id: "cloud", name: "Cloud", icon: "☁️", angle: 240, courses: [
    { id: "c9", name: "Cloud & DevOps", score: 90, recommended: true, duration: "6 months", fee: "₹38,000" },
  ]},
  { id: "marketing", name: "Marketing", icon: "📈", angle: 300, courses: [
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

export default function AdminCourseMapPage() {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<typeof domains[0]["courses"][0] | null>(null);

  const cx = 350, cy = 350;
  const orbitR1 = 180;
  const orbitR2 = 280;

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Admin</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/students">Students</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Celestial Course Map</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Celestial Course Map</h1>
          <Badge variant="secondary">INTERACTIVE</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-3">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> Recommended
            <span className="mx-1">|</span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Available
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(zoom + 0.15, 1.8))}><ZoomIn className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(zoom - 0.15, 0.5))}><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setZoom(1); setExpandedDomain(null); setSelectedCourse(null); }}><Maximize2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* SVG Map — Desktop */}
        <Card className="hidden md:block overflow-hidden">
          <CardContent className="p-0 flex items-center justify-center" style={{ minHeight: 700 }}>
            <div className="overflow-auto w-full flex items-center justify-center p-4">
              <svg width={700} height={700} viewBox="0 0 700 700" className="transition-transform duration-300" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
                {/* Background circles */}
                <circle cx={cx} cy={cy} r={orbitR1} fill="none" stroke="#94a3b8" strokeOpacity={0.2} strokeWidth={1} strokeDasharray="6 4" />
                <circle cx={cx} cy={cy} r={orbitR2} fill="none" stroke="#94a3b8" strokeOpacity={0.15} strokeWidth={1} strokeDasharray="6 4" />
                <circle cx={cx} cy={cy} r={80} fill="none" stroke="#94a3b8" strokeOpacity={0.1} strokeWidth={1} />

                {/* Domain nodes + courses */}
                {domains.map((domain) => {
                  const rad = (domain.angle * Math.PI) / 180;
                  const dx = cx + orbitR1 * Math.cos(rad);
                  const dy = cy + orbitR1 * Math.sin(rad);
                  const isExpanded = expandedDomain === domain.id;

                  return (
                    <g key={domain.id}>
                      {/* Line center → domain */}
                      <line x1={cx} y1={cy} x2={dx} y2={dy} stroke="#94a3b8" strokeOpacity={0.2} strokeWidth={1} />

                      {/* Domain circle */}
                      <g className="cursor-pointer" onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}>
                        <circle cx={dx} cy={dy} r={38} fill={isExpanded ? "#6366f1" : "#e2e8f0"} opacity={isExpanded ? 0.2 : 0.6} />
                        <circle cx={dx} cy={dy} r={34} fill="white" stroke={isExpanded ? "#6366f1" : "#cbd5e1"} strokeWidth={isExpanded ? 2.5 : 1.5} />
                        {/* Hover effect */}
                        <circle cx={dx} cy={dy} r={34} fill="transparent" className="hover:fill-[#f1f5f9] transition-colors" />
                        <text x={dx} y={dy - 4} textAnchor="middle" fontSize={22}>{domain.icon}</text>
                        <text x={dx} y={dy + 16} textAnchor="middle" fontSize={10} fill="#334155" fontWeight={600}>{domain.name}</text>
                        <text x={dx} y={dy + 28} textAnchor="middle" fontSize={8} fill="#94a3b8">{domain.courses.length} courses</text>
                      </g>

                      {/* Expanded courses on orbit 2 */}
                      {isExpanded && domain.courses.map((course, ci) => {
                        const spread = 0.35;
                        const courseAngle = rad + ((ci - (domain.courses.length - 1) / 2) * spread);
                        const courseX = cx + orbitR2 * Math.cos(courseAngle);
                        const courseY = cy + orbitR2 * Math.sin(courseAngle);
                        const isSelected = selectedCourse?.id === course.id;

                        return (
                          <g key={course.id} className="cursor-pointer" onClick={() => setSelectedCourse(course)}>
                            {/* Line domain → course */}
                            <line x1={dx} y1={dy} x2={courseX} y2={courseY} stroke={course.recommended ? "hsl(45,93%,47%)" : "#6366f1"} strokeOpacity={0.2} strokeWidth={1} strokeDasharray="4 3" />

                            {/* Course circle */}
                            <circle cx={courseX} cy={courseY} r={30} fill="white" stroke={course.recommended ? "hsl(45,93%,47%)" : isSelected ? "#6366f1" : "#e2e8f0"} strokeWidth={course.recommended ? 3 : isSelected ? 2.5 : 1.5} />

                            {/* Star for recommended */}
                            {course.recommended && <text x={courseX + 22} y={courseY - 22} fontSize={14}>⭐</text>}

                            {/* Course name */}
                            <text x={courseX} y={courseY - 6} textAnchor="middle" fontSize={8} fill="#334155" fontWeight={500}>
                              {course.name.length > 14 ? course.name.slice(0, 14) + "…" : course.name}
                            </text>

                            {/* Score */}
                            <text x={courseX} y={courseY + 8} textAnchor="middle" fontSize={12} fill={course.score >= 85 ? "hsl(142,71%,45%)" : course.score >= 60 ? "hsl(217,91%,60%)" : "currentColor"} fontWeight={700} opacity={0.9}>
                              {course.score}%
                            </text>

                            {/* Duration */}
                            <text x={courseX} y={courseY + 20} textAnchor="middle" fontSize={7} fill="#94a3b8">{course.duration}</text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* Center — Student */}
                <circle cx={cx} cy={cy} r={52} fill="#6366f1" opacity={0.1} />
                <circle cx={cx} cy={cy} r={46} fill="white" stroke="#6366f1" strokeWidth={3} />
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize={30}>👤</text>
                <text x={cx} y={cy + 18} textAnchor="middle" fontSize={10} fill="#334155" fontWeight={600}>Student</text>
                <text x={cx} y={cy + 30} textAnchor="middle" fontSize={8} fill="#94a3b8">Tap a domain</text>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Mobile list fallback */}
        <div className="md:hidden space-y-3">
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 mx-auto flex items-center justify-center text-2xl mb-2">👤</div>
            <h2 className="text-sm font-bold">Student Name</h2>
            <p className="text-xs text-muted-foreground">{domains.reduce((s, d) => s + d.courses.length, 0)} courses &bull; {domains.length} domains</p>
          </div>
          {domains.map((domain) => {
            const isOpen = expandedDomain === domain.id;
            const topScore = Math.max(...domain.courses.map((c) => c.score));
            const hasRec = domain.courses.some((c) => c.recommended);
            return (
              <div key={domain.id} className="rounded-xl border bg-card overflow-hidden">
                <button onClick={() => setExpandedDomain(isOpen ? null : domain.id)} className="w-full flex items-center gap-3 p-3.5 text-left active:bg-muted/30">
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
                      <div key={course.id} onClick={() => setSelectedCourse(course)} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${course.recommended ? "border-yellow-500/20 bg-yellow-500/5" : "bg-muted/20"}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">{course.recommended && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}<span className="text-sm font-medium">{course.name}</span></div>
                          <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5"><span>{course.duration}</span><span>&bull;</span><span>{course.fee}</span></div>
                          <ScoreBar score={course.score} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Panel — Course Detail */}
        <div className="space-y-4">
          {selectedCourse ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {selectedCourse.recommended && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  <CardTitle className="text-base">{selectedCourse.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${selectedCourse.score >= 85 ? "text-emerald-500" : selectedCourse.score >= 60 ? "text-blue-500" : "text-muted-foreground"}`}>
                    {selectedCourse.score}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Fit Score</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-xs text-muted-foreground block">Duration</span><span className="font-medium">{selectedCourse.duration}</span></div>
                  <div><span className="text-xs text-muted-foreground block">Fee</span><span className="font-medium">{selectedCourse.fee}</span></div>
                </div>

                {selectedCourse.recommended && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 text-center">
                    <p className="text-xs font-medium text-yellow-600 flex items-center justify-center gap-1"><Star className="h-3 w-3 fill-yellow-500" /> Recommended Course</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Score ≥ 85% — best match for this student</p>
                  </div>
                )}

                <Link href={`/dashboard/enrol/demo-student`}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Enrol in This Course</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-16">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="text-sm font-medium">Select a Course</p>
                <p className="text-xs text-muted-foreground mt-1">Click a domain on the map to expand courses, then click a course to see details</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Courses</span><span className="font-medium">{domains.reduce((s, d) => s + d.courses.length, 0)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Domains</span><span className="font-medium">{domains.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Recommended</span><span className="font-medium text-emerald-500">{domains.reduce((s, d) => s + d.courses.filter((c) => c.recommended).length, 0)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Highest Score</span><span className="font-medium">{Math.max(...domains.flatMap((d) => d.courses.map((c) => c.score)))}%</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
