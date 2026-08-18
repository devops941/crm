"use client";

import { Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Reservation {
  id: string;
  student: string;
  course: string;
  level: string;
  batch: string;
  reservedAt: string;
  expiresAt: string;
  hoursLeft: number;
  status: "Active" | "Expired" | "Converted";
}

const reservations: Reservation[] = [
  { id: "r1", student: "—", course: "—", level: "Learner", batch: "Morning", reservedAt: "—", expiresAt: "—", hoursLeft: 18, status: "Active" },
  { id: "r2", student: "—", course: "—", level: "Beginner", batch: "Evening", reservedAt: "—", expiresAt: "—", hoursLeft: 5, status: "Active" },
  { id: "r3", student: "—", course: "—", level: "Expert", batch: "Morning", reservedAt: "—", expiresAt: "—", hoursLeft: 0, status: "Expired" },
  { id: "r4", student: "—", course: "—", level: "Learner", batch: "Weekend", reservedAt: "—", expiresAt: "—", hoursLeft: 0, status: "Converted" },
];

export function SeatReservations() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Seat Reservations</CardTitle>
        <Badge variant="secondary" className="text-[10px]">24HR HOLD</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {reservations.map((r) => (
          <div key={r.id} className={`p-3 rounded-lg border ${r.status === "Expired" ? "bg-red-500/5 border-red-500/10" : r.status === "Converted" ? "bg-emerald-500/5 border-emerald-500/10" : "bg-muted/30"}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium">{r.student}</span>
                <span className="text-xs text-muted-foreground ml-2">{r.course} — {r.level} — {r.batch}</span>
              </div>
              <Badge variant="outline" className={`text-[9px] ${
                r.status === "Active" ? "text-yellow-500 border-yellow-500/20" :
                r.status === "Expired" ? "text-red-500 border-red-500/20" :
                "text-emerald-500 border-emerald-500/20"
              }`}>
                {r.status === "Active" && <Clock className="h-3 w-3 mr-0.5" />}
                {r.status === "Expired" && <XCircle className="h-3 w-3 mr-0.5" />}
                {r.status === "Converted" && <CheckCircle2 className="h-3 w-3 mr-0.5" />}
                {r.status}
              </Badge>
            </div>
            {r.status === "Active" && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={(r.hoursLeft / 24) * 100} className="h-1.5 flex-1" />
                  <span className={`text-xs font-medium ${r.hoursLeft <= 6 ? "text-red-500" : "text-yellow-500"}`}>
                    {r.hoursLeft <= 6 && <AlertTriangle className="h-3 w-3 inline mr-0.5" />}
                    {r.hoursLeft}h left
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700">Convert to Enrollment</Button>
                  <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive">Release Seat</Button>
                </div>
              </>
            )}
            <div className="text-[10px] text-muted-foreground mt-1">Reserved: {r.reservedAt} → Expires: {r.expiresAt}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
