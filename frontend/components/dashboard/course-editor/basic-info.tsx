"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function BasicInfoSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">1 — Basic Information</CardTitle>
        <Badge variant="secondary" className="text-[10px]">REQUIRED</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Course Name *</Label><Input placeholder="Enter course name" /></div>
          <div className="space-y-2"><Label>Category *</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
              <SelectContent><SelectItem value="coding">Coding</SelectItem><SelectItem value="ai">AI & Data</SelectItem><SelectItem value="business">Business</SelectItem><SelectItem value="design">Design</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2"><Label>Description *</Label><Textarea placeholder="Course overview, what students will learn..." /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Prerequisites</Label><Input placeholder="e.g. Basic programming knowledge" /></div>
          <div className="space-y-2"><Label>Target Audience</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select audience..." /></SelectTrigger>
              <SelectContent><SelectItem value="beginners">Beginners / Freshers</SelectItem><SelectItem value="professionals">Working Professionals</SelectItem><SelectItem value="switchers">Career Switchers</SelectItem><SelectItem value="all">All Levels</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Industry Tags</Label><Input placeholder="e.g. AI, DevOps, Cloud (comma separated)" /></div>
          <div className="space-y-2"><Label>Course Thumbnail</Label>
            <div className="border border-dashed rounded-lg p-4 text-center text-xs text-muted-foreground cursor-pointer hover:bg-muted/30">Click to upload image</div>
          </div>
        </div>
        <div className="space-y-2"><Label>Status *</Label>
          <RadioGroup defaultValue="draft" className="flex gap-4 pt-1">
            <div className="flex items-center gap-2"><RadioGroupItem value="draft" id="sd" /><Label htmlFor="sd" className="text-sm font-normal">Draft</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="published" id="sp" /><Label htmlFor="sp" className="text-sm font-normal">Published</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="archived" id="sa" /><Label htmlFor="sa" className="text-sm font-normal">Archived</Label></div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
