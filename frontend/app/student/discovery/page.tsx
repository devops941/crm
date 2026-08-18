"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/student/discovery/progress-stepper";
import { PersonalInfoStep } from "@/components/student/discovery/personal-info";
import { EducationStep } from "@/components/student/discovery/education-step";
import { InterestsStep } from "@/components/student/discovery/interests-step";
import { GoalsStep } from "@/components/student/discovery/goals-step";

const steps = ["Personal Info", "Education", "Interests", "Goals"];

export default function DiscoveryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submit — TODO: POST /api/students + POST /api/recommendations/generate
      router.push("/student/map/demo-student");
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Course Discovery</h1>
            <p className="text-xs text-muted-foreground">Find the perfect course for you</p>
          </div>
          <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ProgressStepper steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 0 && <PersonalInfoStep />}
          {currentStep === 1 && <EducationStep />}
          {currentStep === 2 && <InterestsStep />}
          {currentStep === 3 && <GoalsStep />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={currentStep === 0} className="h-12 px-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button onClick={next} className="h-12 px-8">
            {currentStep === steps.length - 1 ? "Find My Courses" : "Next"}
            {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
