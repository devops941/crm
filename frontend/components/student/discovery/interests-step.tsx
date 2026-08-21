"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DiscoveryFormData } from "@/app/student/discovery/page";

const interestOptions = [
  { icon: "💻", label: "Coding & Programming" },
  { icon: "🤖", label: "AI & Machine Learning" },
  { icon: "📊", label: "Data Science & Analytics" },
  { icon: "🎨", label: "Design & Creative" },
  { icon: "📱", label: "Mobile App Development" },
  { icon: "☁️", label: "Cloud & DevOps" },
  { icon: "🔒", label: "Cybersecurity" },
  { icon: "📈", label: "Digital Marketing" },
  { icon: "💼", label: "Business & Management" },
  { icon: "🗄️", label: "Database & Backend" },
  { icon: "🌐", label: "Web Development" },
  { icon: "🎮", label: "Game Development" },
];

interface Props {
  data: DiscoveryFormData;
  onChange: (partial: Partial<DiscoveryFormData>) => void;
}

export function InterestsStep({ data, onChange }: Props) {
  const [customInterest, setCustomInterest] = useState("");

  const toggle = (label: string) => {
    const updated = data.interests.includes(label)
      ? data.interests.filter((s) => s !== label)
      : [...data.interests, label];
    onChange({ interests: updated });
  };

  const addCustom = () => {
    if (customInterest.trim() && !data.interests.includes(customInterest.trim())) {
      onChange({ interests: [...data.interests, customInterest.trim()] });
      setCustomInterest("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Interests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Select one or more areas you are interested in *</p>
          </div>
          <Badge variant="secondary">{data.interests.length} selected</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interestOptions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => toggle(item.label)}
              className={`h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                data.interests.includes(item.label)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40 text-foreground"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium text-center px-2">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Other interest (optional)</Label>
          <div className="flex gap-2">
            <Input
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="e.g. Blockchain, IoT..."
              className="h-12 text-base flex-1"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
            />
            <button type="button" onClick={addCustom} className="px-4 h-12 rounded-lg border-2 border-border hover:border-primary/40 text-sm font-medium">
              + Add
            </button>
          </div>
        </div>

        {data.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.interests.map((s) => (
              <Badge key={s} variant="outline" className="text-xs cursor-pointer hover:bg-destructive/10" onClick={() => toggle(s)}>
                {s} ×
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
