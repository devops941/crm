"use client";

import { useState } from "react";
import { Search, Plus, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CrudActions } from "@/components/dashboard/crud-actions";
import { leads } from "@/lib/dummy-data";

const pipelineStages = ["New", "Counselled", "Course Selected", "Follow-up", "Seat Attended", "Registration", "Enrolled"];

const statusColors: Record<string, string> = {
  New: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Counselled: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  "Course Selected": "bg-violet-500/10 text-violet-500 border-violet-500/20",
  "Follow-up": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "Seat Attended": "bg-pink-500/10 text-pink-500 border-pink-500/20",
  Registration: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Enrolled: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

const sourceColors: Record<string, string> = {
  Website: "text-blue-500", Referral: "text-emerald-500", "Walk-in": "text-violet-500",
  "Social Media": "text-pink-500", Ads: "text-orange-500",
};

const priorityColors: Record<string, string> = {
  High: "text-red-500 border-red-500/20 bg-red-500/10",
  Medium: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
  Low: "text-muted-foreground",
};

export default function LeadsPage() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Leads & Pipeline</h1>
          <Badge variant="secondary">{leads.length} leads</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-1" /> New Enquiry</Button>
        </div>
      </div>

      <Card><CardContent className="pt-6"><div className="flex gap-1 flex-wrap">{pipelineStages.map((s) => (<Badge key={s} variant="outline" className={`text-xs px-3 py-1.5 cursor-pointer hover:opacity-80 ${statusColors[s]}`}>{s}</Badge>))}</div></CardContent></Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{pipelineStages.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select>
            <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="All Sources" /></SelectTrigger><SelectContent><SelectItem value="all">All Sources</SelectItem><SelectItem value="website">Website</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="walkin">Walk-in</SelectItem><SelectItem value="social">Social Media</SelectItem><SelectItem value="ads">Ads</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select>
            <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search leads..." className="pl-9" /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Student</TableHead><TableHead>Course</TableHead>
                <TableHead>Counsellor</TableHead><TableHead>Source</TableHead><TableHead>Priority</TableHead>
                <TableHead>Status</TableHead><TableHead>Follow-up</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-mono text-xs">{l.id}</TableCell>
                  <TableCell className="font-semibold">{l.student}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{l.course}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{l.counsellor}</TableCell>
                  <TableCell className="text-xs"><span className={sourceColors[l.source]}>{l.source}</span></TableCell>
                  <TableCell><Badge variant="outline" className={`text-[9px] ${priorityColors[l.priority]}`}>{l.priority}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${statusColors[l.status]}`}>{l.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{l.followup}</TableCell>
                  <TableCell><CrudActions data={l} label="lead" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Enquiry</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Student Name *</Label><Input placeholder="Full name" /></div>
              <div className="space-y-2"><Label>Mobile *</Label><Input type="tel" placeholder="+91 ..." /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="Email" /></div>
              <div className="space-y-2"><Label>Course</Label><Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="c1">Course 1</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Source *</Label><Select><SelectTrigger><SelectValue placeholder="How did they find us?" /></SelectTrigger><SelectContent><SelectItem value="website">Website</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="walkin">Walk-in</SelectItem><SelectItem value="social">Social Media</SelectItem><SelectItem value="ads">Ads</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Priority</Label><Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Initial notes..." /></div>
          </div>
          <DialogFooter><Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={() => setAddOpen(false)}>Create Lead</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
