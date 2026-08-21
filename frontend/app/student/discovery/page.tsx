"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressStepper } from "@/components/student/discovery/progress-stepper";
import { PersonalInfoStep } from "@/components/student/discovery/personal-info";
import { EducationStep } from "@/components/student/discovery/education-step";
import { InterestsStep } from "@/components/student/discovery/interests-step";
import { GoalsStep } from "@/components/student/discovery/goals-step";

export interface DiscoveryFormData {
  // Step 1 — Personal Info
  fullName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  location: string;
  employmentStatus: string;
  experience: string;
  branchId: string;
  emergencyName: string;
  emergencyPhone: string;
  consent: boolean;
  // Step 2 — Education
  qualification: string;
  institution: string;
  specialization: string;
  graduationYear: string;
  grade: string;
  currentlyStudying: boolean;
  // Step 3 — Interests
  interests: string[];
  // Step 4 — Goals
  careerGoal: string;
  targetRole: string;
  hoursPerWeek: string;
  preferredDuration: string;
  budget: string;
  startDate: string;
  expectedSalary: string;
  courseSearch: string;
}

const INITIAL_DATA: DiscoveryFormData = {
  fullName: "", dob: "", gender: "", mobile: "", email: "", location: "",
  employmentStatus: "", experience: "", branchId: "", emergencyName: "", emergencyPhone: "",
  consent: false,
  qualification: "", institution: "", specialization: "", graduationYear: "", grade: "",
  currentlyStudying: false,
  interests: [],
  careerGoal: "", targetRole: "", hoursPerWeek: "", preferredDuration: "",
  budget: "", startDate: "", expectedSalary: "", courseSearch: "",
};

const steps = ["Personal Info", "Education", "Interests", "Goals"];

export default function DiscoveryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DiscoveryFormData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (partial: Partial<DiscoveryFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return !!(formData.fullName && formData.mobile && formData.email && formData.consent);
      case 1: return !!formData.qualification;
      case 2: return formData.interests.length > 0;
      case 3: return !!(formData.careerGoal && formData.hoursPerWeek && formData.preferredDuration);
      default: return true;
    }
  };

  const next = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submit
    setSubmitting(true);
    setError("");
    try {
      // In production: POST /api/students → POST /api/recommendations/generate
      // For now: simulate API call and navigate with a generated ID
      await new Promise((r) => setTimeout(r, 800));
      const studentId = `stu_${Date.now()}`;
      console.log("Discovery form submitted:", formData);
      router.push(`/student/map/${studentId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
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

        {/* Step Content — data flows down via props */}
        <div className="mb-8">
          {currentStep === 0 && <PersonalInfoStep data={formData} onChange={update} />}
          {currentStep === 1 && <EducationStep data={formData} onChange={update} />}
          {currentStep === 2 && <InterestsStep data={formData} onChange={update} />}
          {currentStep === 3 && <GoalsStep data={formData} onChange={update} />}
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3 text-center mb-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={currentStep === 0 || submitting} className="h-12 px-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button onClick={next} disabled={!canProceed() || submitting} className="h-12 px-8">
            {submitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
            ) : currentStep === steps.length - 1 ? (
              "Find My Courses"
            ) : (
              <>Next <ArrowRight className="h-4 w-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
