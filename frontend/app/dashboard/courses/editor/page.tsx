"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BasicInfoSection } from "@/components/dashboard/course-editor/basic-info";
import { LevelsSection } from "@/components/dashboard/course-editor/levels-section";
import { SyllabusSection } from "@/components/dashboard/course-editor/syllabus-section";
import { CertificationsSection } from "@/components/dashboard/course-editor/certifications-section";
import { CareerLinkageSection } from "@/components/dashboard/course-editor/career-linkage";
import { DailySyllabusEditor } from "@/components/dashboard/course-editor/daily-syllabus-editor";

export default function CourseEditorPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Admin</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/courses">Courses</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Editor</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Course Editor</h1>
          <Badge variant="secondary">EDITOR</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button variant="outline" size="sm">Save Draft</Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Publish</Button>
        </div>
      </div>

      <BasicInfoSection />
      <LevelsSection />
      <SyllabusSection />
      <CertificationsSection />
      <DailySyllabusEditor />
      <CareerLinkageSection />


    </div>
  );
}
