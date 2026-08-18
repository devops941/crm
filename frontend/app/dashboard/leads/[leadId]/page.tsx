"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Phone, Calendar, MapPin, Mail, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LeadTimeline } from "@/components/dashboard/crm/lead-timeline";

const pipelineStages = ["New", "Counselled", "Course Selected", "Follow-up", "Seat Attended", "Registration", "Enrolled"];
const currentStage = 2;

const timelineEvents = [
  { id: "e1", type: "note" as const, title: "Lead Created", description: "New enquiry received via website form", by: "System", date: "—", time: "—" },
  { id: "e2", type: "call" as const, title: "Initial Call", description: "Discussed course options, student interested in Full Stack", by: "Counsellor", date: "—", time: "—" },
  { id: "e3", type: "status_change" as const, title: "Status: Counselled", description: "Moved from New to Counselled after initial discussion", by: "Counsellor", date: "—", time: "—" },
  { id: "e4", type: "email" as const, title: "Course Brochure Sent", description: "Sent course details and fee structure via email", by: "Counsellor", date: "—", time: "—" },
  { id: "e5", type: "followup" as const, title: "Follow-up Scheduled", description: "Follow-up call scheduled for decision", by: "Counsellor", date: "—", time: "—" },
  { id: "e6", type: "call" as const, title: "Follow-up Call", description: "Student confirmed interest, wants to visit center", by: "Counsellor", date: "—", time: "—" },
  { id: "e7", type: "status_change" as const, title: "Status: Course Selected", description: "Student selected course after center visit", by: "Counsellor", date: "—", time: "—" },
];

export default function LeadDetailPage() {
  const params = useParams();
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/dashboard/leads"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></a>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Lead Detail</h1>
              <Badge variant="outline" className="font-mono text-[10px]">{params.leadId}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Complete lead history and communication log</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAddNoteOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add Note</Button>
          <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}><Calendar className="h-4 w-4 mr-1" /> Schedule Follow-up</Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Convert to Enrollment</Button>
        </div>
      </div>

      {/* Pipeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-0.5 overflow-x-auto">
            {pipelineStages.map((stage, i) => (
              <div key={stage} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                i === 0 ? "rounded-l-lg" : ""} ${i === pipelineStages.length - 1 ? "rounded-r-lg" : ""} ${
                i < currentStage ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                i === currentStage ? "bg-primary/10 text-primary border-2 border-primary/30" :
                "bg-muted text-muted-foreground border border-border"
              }`}>{stage}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left — Lead Info + Communication */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Student Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground text-xs block">Name</span><span className="font-medium">—</span></div>
                <div><span className="text-muted-foreground text-xs block">Mobile</span><span>—</span></div>
                <div><span className="text-muted-foreground text-xs block">Email</span><span>—</span></div>
                <div><span className="text-muted-foreground text-xs block">Location</span><span>—</span></div>
                <div><span className="text-muted-foreground text-xs block">Qualification</span><span>—</span></div>
                <div><span className="text-muted-foreground text-xs block">Source</span><Badge variant="outline" className="text-[10px] text-blue-500">Website</Badge></div>
              </div>
            </CardContent>
          </Card>

          {/* Course Interest */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Course Interest</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground text-xs block">Course</span><span className="font-medium">—</span></div>
                <div><span className="text-muted-foreground text-xs block">Level</span><span>—</span></div>
                <div><span className="text-muted-foreground text-xs block">Preferred Batch</span><span>—</span></div>
                <div><span className="text-muted-foreground text-xs block">Fee</span><span>₹—</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Communication History</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{timelineEvents.length} events</Badge>
            </CardHeader>
            <CardContent>
              <LeadTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </div>

        {/* Right — Actions + Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm">Lead Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Lead ID</span><span className="font-mono text-xs">{params.leadId}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-500">Course Selected</Badge></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><Badge variant="outline" className="text-[10px] text-red-500 border-red-500/20">High</Badge></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Counsellor</span><span>—</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Branch</span><span>—</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span className="text-xs">—</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Last Activity</span><span className="text-xs">—</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-xs h-9"><Phone className="h-3.5 w-3.5 mr-2" /> Log a Call</Button>
              <Button variant="outline" className="w-full justify-start text-xs h-9"><Mail className="h-3.5 w-3.5 mr-2" /> Send Email</Button>
              <Button variant="outline" className="w-full justify-start text-xs h-9"><MapPin className="h-3.5 w-3.5 mr-2" /> Log a Visit</Button>
              <Button variant="outline" className="w-full justify-start text-xs h-9"><Calendar className="h-3.5 w-3.5 mr-2" /> Schedule Follow-up</Button>
              <Separator />
              <Button variant="outline" className="w-full justify-start text-xs h-9 text-orange-500">Reserve Seat (24hr)</Button>
              <Button className="w-full justify-start text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white">Convert to Enrollment</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Next Follow-up</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground text-center py-4">
              No follow-up scheduled
              <div className="mt-2"><Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>Schedule Now</Button></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent><SelectItem value="call">Call</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="visit">Visit</SelectItem><SelectItem value="note">Note</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Notes *</Label><Textarea placeholder="What happened? Key discussion points..." className="min-h-[100px]" /></div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setAddNoteOpen(false)}>Cancel</Button><Button onClick={() => setAddNoteOpen(false)}>Add Note</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule Follow-up</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date *</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Time *</Label><Input type="time" /></div>
            </div>
            <div className="space-y-2"><Label>Mode *</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select mode..." /></SelectTrigger>
                <SelectContent><SelectItem value="call">Call</SelectItem><SelectItem value="visit">Visit</SelectItem><SelectItem value="email">Email</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="What to discuss in this follow-up..." /></div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setScheduleOpen(false)}>Cancel</Button><Button onClick={() => setScheduleOpen(false)}>Schedule</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
