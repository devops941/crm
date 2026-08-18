"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const tabList = ["Overview", "Syllabus", "Objectives", "Scope", "Industry", "Careers", "Projects", "Certification", "Placement", "Fees"];

const fitFactors = [
  { label: "Interest Match", score: 28, max: 30, color: "bg-blue-500" },
  { label: "Qualification", score: 18, max: 20, color: "bg-emerald-500" },
  { label: "Career Goal", score: 20, max: 20, color: "bg-violet-500" },
  { label: "Duration", score: 15, max: 15, color: "bg-cyan-500" },
  { label: "Difficulty", score: 7, max: 10, color: "bg-yellow-500" },
  { label: "Industry", score: 5, max: 5, color: "bg-orange-500" },
];

const careerRoles = [
  { role: "—", salary: "₹4-8 LPA", demand: "Very High" },
  { role: "—", salary: "₹3-6 LPA", demand: "High" },
  { role: "—", salary: "₹5-10 LPA", demand: "Very High" },
  { role: "—", salary: "₹4-7 LPA", demand: "High" },
  { role: "—", salary: "₹4-8 LPA", demand: "High" },
];

const demandColors: Record<string, string> = {
  "Very High": "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
  High: "text-cyan-500 border-cyan-500/20 bg-cyan-500/10",
  Medium: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
};

const courseList = ["Course A", "Course B", "Course C", "Course D"];

const totalScore = fitFactors.reduce((s, f) => s + f.score, 0);

export default function IntelligencePage() {
  const params = useParams();
  const [selectedCourse, setSelectedCourse] = useState(0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/student/courses/${params.courseId}`}>
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">Course Intelligence Panel</h1>
            <p className="text-xs text-muted-foreground">Detailed course analysis with fit-score breakdown</p>
          </div>
          <Badge variant="secondary" className="ml-2">SPLIT PANEL</Badge>
        </div>
      </div>

      {/* Split Panel */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Left Panel - Mini Map + Course List */}
        <div className="w-72 border-r bg-card p-4 hidden lg:block">
          <div className="border rounded-lg p-6 mb-4 text-center bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Celestial Map — Compact View</p>
            <p className="text-sm font-medium">Selected: Course Name</p>
          </div>
          <div className="space-y-1">
            {courseList.map((c, i) => (
              <button
                key={c}
                onClick={() => setSelectedCourse(i)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  i === selectedCourse ? "bg-primary/10 text-primary font-semibold border border-primary/20" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Tabs */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="Overview">
            <TabsList className="flex-wrap h-auto gap-1 mb-6">
              {tabList.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="text-xs">{tab}</TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="Overview" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-6">
                    Comprehensive program covering front-end and back-end technologies, databases, and deployment.
                    Designed for job-seekers and career-changers targeting development roles.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Duration</p><p className="text-sm font-semibold">— months</p></div>
                    <div><p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Mode</p><p className="text-sm font-semibold">Classroom + Online</p></div>
                    <div><p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Batch Size</p><p className="text-sm font-semibold">20 max</p></div>
                    <div><p className="text-[10px] uppercase text-muted-foreground font-bold mb-1">Batch Type</p><p className="text-sm font-semibold">Rolling</p></div>
                  </div>
                </CardContent>
              </Card>

              {/* Fit Score Breakdown */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Fit Score Breakdown</CardTitle>
                    <span className="text-2xl font-bold text-emerald-500">{totalScore}%</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fitFactors.map((f) => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="w-28 text-xs text-muted-foreground text-right">{f.label}</span>
                      <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                        <div className={`h-full rounded ${f.color}`} style={{ width: `${(f.score / f.max) * 100}%` }} />
                      </div>
                      <span className="w-16 text-xs text-muted-foreground">{f.score}/{f.max}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Careers Tab */}
            <TabsContent value="Careers">
              <Card>
                <CardHeader><CardTitle className="text-sm">Career Roles After Completion</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Salary Range</TableHead><TableHead>Demand</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {careerRoles.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{r.role}</TableCell>
                          <TableCell className="text-muted-foreground">{r.salary}</TableCell>
                          <TableCell><Badge variant="outline" className={`text-[10px] ${demandColors[r.demand]}`}>{r.demand}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholder for other tabs */}
            {tabList.filter((t) => t !== "Overview" && t !== "Careers").map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-sm">{tab} content panel</p>
                      <p className="text-xs mt-1">Data loaded from course intelligence API</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Persistent Conversion Action Bar */}
      <div className="border-t bg-card sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold">Course Name</span>
            <span className="text-muted-foreground"> — Learner — Morning Batch — ₹—</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Book Counselling</Button>
            <Button variant="outline" size="sm" className="text-orange-500 border-orange-500/30 hover:bg-orange-500/10">Reserve Seat</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Enrol Now &rarr;</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
