"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Award, TrendingUp, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const modules = [
  { name: "Module 1", topics: ["Topic A", "Topic B", "Topic C", "Topic D"], project: "Project: Hands-on Assignment" },
  { name: "Module 2", topics: ["Topic E", "Topic F", "Topic G"], project: "Project: Mini Application" },
  { name: "Module 3", topics: ["Topic H", "Topic I", "Topic J"], project: "Project: Case Study" },
  { name: "Module 4", topics: ["Topic K", "Topic L"], project: "Project: Capstone Project" },
];

const certifications = ["Institute Certificate", "Industry Certification (Partner)", "Skill Assessment Badge"];

const careerProgression = [
  { level: "Basic", current: false },
  { level: "Intermediate", current: true },
  { level: "Advanced", current: false },
  { level: "Specialist", current: false },
];

export default function CourseExplorerPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/education/courses`}>
              <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">Course Name</h1>
                <Badge>Learner Level</Badge>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">93% Fit Score</Badge>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>Duration: — months</span>
                <span>Mode: Classroom + Online</span>
                <span>Prerequisites: —</span>
                <span>Batch: Morning / Evening</span>
                <span>Fee: ₹—</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><GitCompare className="h-4 w-4 mr-1" /> Compare</Button>
              <Link href={`/student/courses/${params.courseId}/intelligence`}>
                <Button size="sm">View Intelligence &rarr;</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Syllabus */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Syllabus</CardTitle></CardHeader>
              <CardContent>
                <Accordion defaultValue={[0]} className="space-y-2">
                  {modules.map((mod, i) => (
                    <AccordionItem key={i} value={`mod-${i}`} className="border rounded-lg">
                      <AccordionTrigger className="px-4 text-sm font-semibold">{mod.name}</AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <ul className="space-y-1.5 mb-3">
                          {mod.topics.map((t) => (
                            <li key={t} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />{t}
                            </li>
                          ))}
                        </ul>
                        <div className="bg-muted/50 rounded-lg p-3 text-sm font-medium">{mod.project}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Certifications */}
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Award className="h-4 w-4" /> Certifications</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {certifications.map((c) => (
                    <li key={c} className="text-sm flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>{c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Course Comparison Mini */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Course Comparison</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead className="text-xs">Course</TableHead><TableHead className="text-xs">Dur.</TableHead><TableHead className="text-xs">Demand</TableHead></TableRow></TableHeader>
                  <TableBody>
                    <TableRow><TableCell className="text-xs font-medium">Course A</TableCell><TableCell className="text-xs">6M</TableCell><TableCell><Badge variant="outline" className="text-[9px] text-emerald-500">High</Badge></TableCell></TableRow>
                    <TableRow><TableCell className="text-xs font-medium">Course B</TableCell><TableCell className="text-xs">4M</TableCell><TableCell><Badge variant="outline" className="text-[9px] text-cyan-500">High</Badge></TableCell></TableRow>
                    <TableRow><TableCell className="text-xs font-medium">Course C</TableCell><TableCell className="text-xs">3M</TableCell><TableCell><Badge variant="outline" className="text-[9px] text-yellow-500">Med</Badge></TableCell></TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Career Progression */}
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Career Progression</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  {careerProgression.map((cp, i) => (
                    <div key={cp.level} className="flex items-center gap-1">
                      <div className={`px-3 py-1.5 rounded text-xs font-medium ${cp.current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {cp.level}
                        {cp.current && <span className="block text-[9px] opacity-80">YOU ARE HERE</span>}
                      </div>
                      {i < careerProgression.length - 1 && <span className="text-muted-foreground">→</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
