"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Phone, MapPin, CheckCircle2, FileText, UserCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const stages = ["New", "Counselled", "Course Selected", "Follow-up", "Seat Attended", "Registration", "Enrolled"];

export default function EnrolmentPage() {
  const [activeStage, setActiveStage] = useState(0);

  const moveNext = () => { if (activeStage < stages.length - 1) setActiveStage(activeStage + 1); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/students"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Enrolment / Conversion</h1>
          <p className="text-xs text-muted-foreground">Manage lead pipeline step by step</p>
        </div>
        <Badge variant="secondary">CONVERSION</Badge>
      </div>

      {/* Pipeline Stepper */}
      <div className="flex gap-0.5 overflow-x-auto pb-1">
        {stages.map((stage, i) => (
          <button
            key={stage}
            onClick={() => setActiveStage(i)}
            className={`px-3 sm:px-4 py-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-all ${
              i === 0 ? "rounded-l-lg" : ""
            } ${i === stages.length - 1 ? "rounded-r-lg" : ""} ${
              i < activeStage
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                : i === activeStage
                ? "bg-primary text-primary-foreground border-2 border-primary"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {i < activeStage && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
            {stage}
          </button>
        ))}
      </div>

      {/* Student + Course Info (always visible) */}
      <Card>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] uppercase text-muted-foreground font-bold mb-2">Student</p>
              <div className="space-y-1.5 text-sm">
                <p><span className="text-muted-foreground w-24 inline-block">Name:</span> <strong>—</strong></p>
                <p><span className="text-muted-foreground w-24 inline-block">Mobile:</span> —</p>
                <p><span className="text-muted-foreground w-24 inline-block">Email:</span> —</p>
                <p><span className="text-muted-foreground w-24 inline-block">Qualification:</span> —</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground font-bold mb-2">Course</p>
              <div className="space-y-1.5 text-sm">
                <p><span className="text-muted-foreground w-24 inline-block">Course:</span> <strong>—</strong></p>
                <p><span className="text-muted-foreground w-24 inline-block">Level:</span> —</p>
                <p><span className="text-muted-foreground w-24 inline-block">Batch:</span> —</p>
                <p><span className="text-muted-foreground w-24 inline-block">Fee:</span> ₹—</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══ STAGE CONTENT ═══ */}

      {/* Stage 0: New */}
      {activeStage === 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> New Enquiry</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">New lead created. Review student details and assign a counsellor.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Lead Source</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select source..." /></SelectTrigger><SelectContent><SelectItem value="website">Website</SelectItem><SelectItem value="walkin">Walk-in</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="social">Social Media</SelectItem><SelectItem value="ads">Ads</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Assign Counsellor</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select counsellor..." /></SelectTrigger><SelectContent><SelectItem value="c1">Counsellor 1</SelectItem><SelectItem value="c2">Counsellor 2</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Initial Notes</Label><Textarea placeholder="First interaction notes..." /></div>
            <Button onClick={moveNext} className="w-full sm:w-auto">Mark as Counselled &rarr;</Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 1: Counselled */}
      {activeStage === 1 && (
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><UserCheck className="h-4 w-4" /> Counselling Session</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Record counselling session details. What courses were discussed?</p>
            <div className="space-y-2"><Label>Session Notes</Label><Textarea placeholder="Courses discussed, student preferences, objections..." className="min-h-[100px]" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Recommended Course</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select course..." /></SelectTrigger><SelectContent><SelectItem value="c1">Course 1</SelectItem><SelectItem value="c2">Course 2</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Recommended Level</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select level..." /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="learner">Learner</SelectItem><SelectItem value="expert">Expert</SelectItem></SelectContent></Select>
              </div>
            </div>
            <Button onClick={moveNext} className="w-full sm:w-auto">Course Selected &rarr;</Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 2: Course Selected */}
      {activeStage === 2 && (
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Course Confirmed</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Student has selected a course. Schedule a follow-up or proceed to seat reservation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Preferred Batch</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select batch..." /></SelectTrigger><SelectContent><SelectItem value="morning">Morning</SelectItem><SelectItem value="evening">Evening</SelectItem><SelectItem value="weekend">Weekend</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Preferred Start Date</Label><Input type="date" /></div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Any special requests or conditions..." /></div>
            <Button onClick={moveNext} className="w-full sm:w-auto">Schedule Follow-up &rarr;</Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 3: Follow-up */}
      {activeStage === 3 && (
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> Follow-up</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Schedule and track follow-up with the student.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Follow-up Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
              <div className="space-y-2"><Label>Mode</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="call"><span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> Call</span></SelectItem><SelectItem value="visit"><span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Visit</span></SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Follow-up Notes</Label><Textarea placeholder="What to discuss, student concerns..." /></div>
            <Button onClick={moveNext} className="w-full sm:w-auto">Student Attended &rarr;</Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 4: Seat Attended */}
      {activeStage === 4 && (
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4" /> Seat Attended / Demo</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Student visited the center or attended a demo class. Record the outcome.</p>
            <div className="space-y-2"><Label>Visit/Demo Notes</Label><Textarea placeholder="How was the visit? Student feedback, impressions..." className="min-h-[100px]" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Student Decision</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="interested">Interested — Proceed</SelectItem><SelectItem value="thinking">Still Thinking</SelectItem><SelectItem value="not_interested">Not Interested</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label>Reserve Seat?</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="yes">Yes — 24hr Hold</SelectItem><SelectItem value="no">No — Continue</SelectItem></SelectContent></Select>
              </div>
            </div>
            <Button onClick={moveNext} className="w-full sm:w-auto">Proceed to Registration &rarr;</Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 5: Registration */}
      {activeStage === 5 && (
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CreditCard className="h-4 w-4" /> Registration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Collect documents, confirm fee, and complete registration.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Fee Amount (₹)</Label><Input type="number" placeholder="35000" /></div>
              <div className="space-y-2"><Label>Payment Mode</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="upi">UPI</SelectItem><SelectItem value="emi">EMI</SelectItem><SelectItem value="later">Pay Later</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Branch</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select branch..." /></SelectTrigger><SelectContent><SelectItem value="b1">Branch 1</SelectItem><SelectItem value="b2">Branch 2</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Documents Submitted</Label><Textarea placeholder="ID proof, photo, qualification certificate..." /></div>
            <Button onClick={moveNext} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">Complete Enrolment &rarr;</Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 6: Enrolled */}
      {activeStage === 6 && (
        <Card>
          <CardContent className="pt-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-emerald-600">Enrolled Successfully!</h2>
            <p className="text-sm text-muted-foreground">Student has been enrolled. Welcome notification sent.</p>
            <div className="bg-muted/50 rounded-xl p-4 text-sm text-left max-w-md mx-auto space-y-2">
              <p><span className="text-muted-foreground">Course:</span> <strong>—</strong></p>
              <p><span className="text-muted-foreground">Level:</span> —</p>
              <p><span className="text-muted-foreground">Start Date:</span> —</p>
              <p><span className="text-muted-foreground">Branch:</span> —</p>
              <p><span className="text-muted-foreground">Fee Status:</span> <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Paid</Badge></p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Link href="/dashboard/students"><Button variant="outline">View Students</Button></Link>
              <Link href="/dashboard/enrollments"><Button>View Enrollments</Button></Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
