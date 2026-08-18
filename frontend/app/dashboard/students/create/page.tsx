"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ProgressStepper } from "@/components/student/discovery/progress-stepper";
import { PersonalInfoStep } from "@/components/student/discovery/personal-info";
import { EducationStep } from "@/components/student/discovery/education-step";
import { InterestsStep } from "@/components/student/discovery/interests-step";
import { GoalsStep } from "@/components/student/discovery/goals-step";

const steps = ["Personal Info", "Education", "Interests", "Goals"];

export default function CreateStudentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // TODO: POST /api/students → create student → show recommendations
      router.push("/dashboard/students/map");
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Admin</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/students">Students</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Create Student</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Create Student</h1>
          <Badge variant="secondary">REGISTER</Badge>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
      </div>

      <ProgressStepper steps={steps} currentStep={currentStep} />

      <div>
        {currentStep === 0 && <PersonalInfoStep />}
        {currentStep === 1 && <EducationStep />}
        {currentStep === 2 && <InterestsStep />}
        {currentStep === 3 && <GoalsStep />}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prev} disabled={currentStep === 0} className="h-12 px-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <Button onClick={next} className="h-12 px-8">
          {currentStep === steps.length - 1 ? "Create Student" : "Next"}
          {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
