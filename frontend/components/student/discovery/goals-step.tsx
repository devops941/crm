"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DiscoveryFormData } from "@/app/student/discovery/page";

const careerGoals = [
  "Get a Job", "Switch Career", "Upskill", "Freelance", "Start a Business", "Academic Growth",
];

interface Props {
  data: DiscoveryFormData;
  onChange: (partial: Partial<DiscoveryFormData>) => void;
}

export function GoalsStep({ data, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals &amp; Preferences</CardTitle>
        <p className="text-sm text-muted-foreground">Tell us about your career intentions and availability</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-3 block">Career Intention *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {careerGoals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => onChange({ careerGoal: goal })}
                className={`h-14 rounded-lg border-2 text-sm font-medium transition-all ${
                  data.careerGoal === goal
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 text-foreground"
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetRole">Target Job Role (optional)</Label>
          <Input id="targetRole" placeholder="e.g. Full Stack Developer, Data Analyst..." className="h-12 text-base" value={data.targetRole} onChange={(e) => onChange({ targetRole: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Learning Hours / Week *</Label>
            <Select value={data.hoursPerWeek || undefined} onValueChange={(v) => v && onChange({ hoursPerWeek: v })}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select hours..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Up to 5 hours</SelectItem>
                <SelectItem value="10">5-10 hours</SelectItem>
                <SelectItem value="20">10-20 hours</SelectItem>
                <SelectItem value="40">20+ hours (Full-time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preferred Duration *</Label>
            <Select value={data.preferredDuration || undefined} onValueChange={(v) => v && onChange({ preferredDuration: v })}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select duration..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1-2 months</SelectItem>
                <SelectItem value="3">3-4 months</SelectItem>
                <SelectItem value="6">5-6 months</SelectItem>
                <SelectItem value="9">7-9 months</SelectItem>
                <SelectItem value="12">10-12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Budget / Affordability</Label>
            <Select value={data.budget || undefined} onValueChange={(v) => v && onChange({ budget: v })}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select budget range..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10k">Up to ₹10,000</SelectItem>
                <SelectItem value="25k">₹10,000 - ₹25,000</SelectItem>
                <SelectItem value="50k">₹25,000 - ₹50,000</SelectItem>
                <SelectItem value="50k+">₹50,000+</SelectItem>
                <SelectItem value="any">No budget constraint</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Preferred Start Date</Label>
            <Input id="startDate" type="date" className="h-12 text-base" value={data.startDate} onChange={(e) => onChange({ startDate: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Expected Salary After Course (LPA)</Label>
            <Select value={data.expectedSalary || undefined} onValueChange={(v) => v && onChange({ expectedSalary: v })}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select range..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">₹2-4 LPA</SelectItem>
                <SelectItem value="5">₹4-6 LPA</SelectItem>
                <SelectItem value="8">₹6-10 LPA</SelectItem>
                <SelectItem value="10">₹10+ LPA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseSearch">Looking for a specific course? (optional)</Label>
            <Input id="courseSearch" placeholder="e.g. Full Stack Developer, Data Science..." className="h-12 text-base" value={data.courseSearch} onChange={(e) => onChange({ courseSearch: e.target.value })} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
