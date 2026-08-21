"use client";

import { useState } from "react";
import { MapPin, CheckCircle2, XCircle, Loader2, Clock, Building2, AlertTriangle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Status = "idle" | "loading" | "success" | "error" | "out_of_range" | "already";

export default function CheckInPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [distance, setDistance] = useState<number | null>(null);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // In production: fetch from API based on logged-in student's enrollment
  const branch = { name: "Madurai HQ", lat: 9.9252, lng: 78.1198, radius: 100, open: "09:00 AM", close: "06:00 PM" };
  const enrollment = { course: "Full Stack Web Development", level: "Learner", batch: "Morning", day: 81, total: 180 };

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleCheckIn = () => {
    setStatus("loading");
    if (!navigator.geolocation) { setStatus("error"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = haversine(pos.coords.latitude, pos.coords.longitude, branch.lat, branch.lng);
        setDistance(Math.round(dist));
        if (dist <= branch.radius) {
          setStatus("success");
          setCheckInTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
        } else { setStatus("out_of_range"); }
      },
      () => setStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="font-mono text-xs">Day {enrollment.day}/{enrollment.total}</Badge>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">Active</Badge>
        </div>
        <h2 className="text-base font-bold">{enrollment.course}</h2>
        <p className="text-xs text-muted-foreground mt-1">{enrollment.level} &bull; {enrollment.batch} Batch</p>
      </div>

      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{branch.name}</p>
          <p className="text-[11px] text-muted-foreground">{branch.open} – {branch.close} &bull; {branch.radius}m radius</p>
        </div>
        <Wifi className="h-4 w-4 text-emerald-500" />
      </div>

      <div className="rounded-2xl border bg-card p-6 text-center space-y-4">
        {status === "idle" && (<>
          <div className="w-28 h-28 rounded-full bg-primary/5 border-2 border-dashed border-primary/20 mx-auto flex items-center justify-center"><MapPin className="h-12 w-12 text-primary/40" /></div>
          <div><p className="text-sm font-medium">Ready to check in</p><p className="text-xs text-muted-foreground mt-1">Verify your location to mark attendance</p></div>
          <Button className="w-full h-14 text-base rounded-xl" onClick={handleCheckIn}><MapPin className="h-5 w-5 mr-2" /> Check In</Button>
        </>)}
        {status === "loading" && (<>
          <div className="w-28 h-28 rounded-full bg-blue-500/5 mx-auto flex items-center justify-center"><Loader2 className="h-12 w-12 text-blue-500 animate-spin" /></div>
          <p className="text-sm text-muted-foreground">Verifying location...</p>
        </>)}
        {status === "success" && (<>
          <div className="w-28 h-28 rounded-full bg-emerald-500/10 mx-auto flex items-center justify-center"><CheckCircle2 className="h-14 w-14 text-emerald-500" /></div>
          <div><h3 className="text-lg font-bold text-emerald-600">Checked In!</h3>
            <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{checkInTime}</span><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{distance}m</span></div>
          </div>
          <a href="/student/today"><Button className="w-full h-12 rounded-xl mt-2">View Syllabus &rarr;</Button></a>
        </>)}
        {status === "out_of_range" && (<>
          <div className="w-28 h-28 rounded-full bg-red-500/10 mx-auto flex items-center justify-center"><XCircle className="h-14 w-14 text-red-500" /></div>
          <h3 className="text-lg font-bold text-red-600">Out of Range</h3>
          <p className="text-sm text-muted-foreground"><strong>{distance}m</strong> away (need {branch.radius}m)</p>
          <Button variant="outline" className="w-full h-12 rounded-xl" onClick={handleCheckIn}>Try Again</Button>
        </>)}
        {status === "already" && (<>
          <div className="w-28 h-28 rounded-full bg-yellow-500/10 mx-auto flex items-center justify-center"><AlertTriangle className="h-14 w-14 text-yellow-500" /></div>
          <h3 className="text-lg font-bold text-yellow-600">Already Checked In</h3>
          <a href="/student/today"><Button className="w-full h-12 rounded-xl">Go to Syllabus</Button></a>
        </>)}
        {status === "error" && (<>
          <div className="w-28 h-28 rounded-full bg-orange-500/10 mx-auto flex items-center justify-center"><XCircle className="h-14 w-14 text-orange-500" /></div>
          <h3 className="text-lg font-bold text-orange-600">Location Error</h3>
          <p className="text-xs text-muted-foreground">Enable GPS and try again</p>
          <Button variant="outline" className="w-full h-12 rounded-xl" onClick={handleCheckIn}>Try Again</Button>
        </>)}
      </div>
    </div>
  );
}
