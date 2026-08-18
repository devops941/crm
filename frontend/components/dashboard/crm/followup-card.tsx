"use client";

import { Phone, MapPin, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FollowupCardProps {
  student: string;
  course: string;
  date: string;
  time: string;
  mode: "Call" | "Visit" | "Email";
  status: "Pending" | "Completed" | "Overdue" | "Cancelled";
  counsellor: string;
  notes: string;
}

const statusColors: Record<string, string> = {
  Pending: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10",
  Completed: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
  Overdue: "text-red-500 border-red-500/20 bg-red-500/10",
  Cancelled: "text-muted-foreground",
};

const modeIcons = { Call: Phone, Visit: MapPin, Email: Phone };

export function FollowupCard({ student, course, date, time, mode, status, counsellor, notes }: FollowupCardProps) {
  const ModeIcon = modeIcons[mode];
  const isOverdue = status === "Overdue";

  return (
    <Card className={isOverdue ? "border-l-4 border-l-red-500" : ""}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{student}</span>
              <Badge variant="outline" className={`text-[9px] ${statusColors[status]}`}>
                {status === "Overdue" && <AlertTriangle className="h-3 w-3 mr-0.5" />}
                {status === "Completed" && <CheckCircle2 className="h-3 w-3 mr-0.5" />}
                {status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Course: {course}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ModeIcon className="h-3.5 w-3.5" />
            <span>{mode}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
          <span><Clock className="h-3 w-3 inline mr-0.5" /> {date} at {time}</span>
          <span>Counsellor: {counsellor}</span>
        </div>

        {notes && <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mb-3">{notes}</p>}

        {status === "Pending" && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs h-7">Mark Done</Button>
            <Button size="sm" variant="outline" className="text-xs h-7">Reschedule</Button>
            <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive">Cancel</Button>
          </div>
        )}
        {status === "Overdue" && (
          <div className="flex gap-2">
            <Button size="sm" className="text-xs h-7">Reschedule Now</Button>
            <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive">Cancel</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
