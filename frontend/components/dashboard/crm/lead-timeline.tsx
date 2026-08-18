"use client";

import { Phone, MapPin, Mail, MessageSquare, UserCheck, Clock, CheckCircle2, Calendar, StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: string;
  type: "call" | "visit" | "email" | "note" | "status_change" | "followup" | "enrollment";
  title: string;
  description: string;
  by: string;
  date: string;
  time: string;
}

const iconMap = {
  call: Phone, visit: MapPin, email: Mail, note: StickyNote,
  status_change: CheckCircle2, followup: Calendar, enrollment: UserCheck,
};

const colorMap: Record<string, string> = {
  call: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  visit: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  email: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  note: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  status_change: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  followup: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  enrollment: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

interface LeadTimelineProps {
  events: TimelineEvent[];
}

export function LeadTimeline({ events }: LeadTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-4">
        {events.map((event) => {
          const Icon = iconMap[event.type];
          return (
            <div key={event.id} className="flex gap-4 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border ${colorMap[event.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{event.title}</span>
                    <Badge variant="outline" className={`text-[9px] ${colorMap[event.type]}`}>{event.type.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />{event.date} {event.time}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">By: {event.by}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
