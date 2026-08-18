"use client";

import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function PersonalInfoStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Selfie */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            <Camera className="h-8 w-8 text-muted-foreground mb-1" />
            <span className="text-[10px] text-muted-foreground">Take Selfie</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" placeholder="Enter your full name" className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input id="dob" type="date" className="h-12 text-base" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input id="mobile" type="tel" placeholder="+91 98765 43210" className="h-12 text-base" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" placeholder="student@email.com" className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">City / Location *</Label>
            <Input id="location" placeholder="Chennai, Tamil Nadu" className="h-12 text-base" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Employment Status</Label>
            <Select>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="freelance">Freelancer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Work Experience (years)</Label>
            <Select>
              <SelectTrigger className="h-12"><SelectValue placeholder="Select experience" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Fresher (0 years)</SelectItem>
                <SelectItem value="1">1-2 years</SelectItem>
                <SelectItem value="3">3-5 years</SelectItem>
                <SelectItem value="6">5+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preferred Branch *</Label>
          <Select>
            <SelectTrigger className="h-12"><SelectValue placeholder="Select branch to attend" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="b1">Branch 1</SelectItem>
              <SelectItem value="b2">Branch 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Emergency Contact Name</Label>
            <Input id="emergencyName" placeholder="Parent / Guardian name" className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
            <Input id="emergencyPhone" type="tel" placeholder="+91 ..." className="h-12 text-base" />
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2">
          <Checkbox id="consent" className="mt-0.5" />
          <Label htmlFor="consent" className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer">
            I agree to the privacy policy and consent to the collection and processing of my personal data for course counselling purposes.
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
