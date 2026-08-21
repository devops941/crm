"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { DiscoveryFormData } from "@/app/student/discovery/page";

const qualifications = [
  "10th Pass", "12th Pass", "Diploma", "B.Sc", "B.Com", "B.A",
  "B.Tech / B.E", "BCA", "BBA", "M.Sc", "M.Tech", "MBA",
  "MCA", "PhD", "Other",
];

interface Props {
  data: DiscoveryFormData;
  onChange: (partial: Partial<DiscoveryFormData>) => void;
}

export function EducationStep({ data, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education Background</CardTitle>
        <p className="text-sm text-muted-foreground">Select your highest qualification and provide details</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label className="mb-2 block">Highest Qualification *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {qualifications.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onChange({ qualification: q })}
                className={`h-14 rounded-lg border-2 text-sm font-medium transition-all ${
                  data.qualification === q
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40 text-foreground"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution / College Name</Label>
            <Input id="institution" placeholder="e.g. Anna University" className="h-12 text-base" value={data.institution} onChange={(e) => onChange({ institution: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Field / Specialization</Label>
            <Input id="specialization" placeholder="e.g. Computer Science" className="h-12 text-base" value={data.specialization} onChange={(e) => onChange({ specialization: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Graduation Year</Label>
            <Select value={data.graduationYear || undefined} onValueChange={(v) => v && onChange({ graduationYear: v })}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => 2026 - i).map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Percentage / CGPA (optional)</Label>
            <Input id="grade" placeholder="e.g. 85% or 8.5 CGPA" className="h-12 text-base" value={data.grade} onChange={(e) => onChange({ grade: e.target.value })} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="studying" checked={data.currentlyStudying} onCheckedChange={(v) => onChange({ currentlyStudying: v === true })} />
          <Label htmlFor="studying" className="text-sm font-normal cursor-pointer">I am currently studying / pursuing this qualification</Label>
        </div>
      </CardContent>
    </Card>
  );
}
