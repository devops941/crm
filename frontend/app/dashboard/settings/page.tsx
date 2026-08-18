"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
        <Badge variant="secondary">CONFIG</Badge>
      </div>

      {/* General */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>App Name</Label><Input defaultValue="Interactive Course Counselling App" /></div>
            <div className="space-y-2"><Label>Organization</Label><Input placeholder="Your organization" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Default Branch</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent><SelectItem value="b1">Branch 1</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Logo</Label>
              <div className="border border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground cursor-pointer hover:bg-muted/30 transition-colors">Click to upload logo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Authentication</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Session Timeout</Label>
            <Select defaultValue="24"><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="24">24 hours</SelectItem><SelectItem value="12">12 hours</SelectItem><SelectItem value="8">8 hours</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Minimum Password: 8 characters</Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label>Allow &quot;Remember Me&quot;</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>Welcome email on registration</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>Notify on new lead</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between"><Label>Follow-up reminders</Label><Switch defaultChecked /></div>
          <div className="flex items-center justify-between">
            <Label>Reminder before follow-up</Label>
            <Select defaultValue="1h"><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="30m">30 min</SelectItem><SelectItem value="1h">1 hour</SelectItem><SelectItem value="2h">2 hours</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-semibold">Data Management</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">Export Courses (CSV)</Button>
            <Button variant="outline" size="sm">Export Students (CSV)</Button>
            <Button variant="outline" size="sm">Export Leads (CSV)</Button>
            <Button variant="destructive" size="sm">Recalculate All Recs</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="px-8">Save Settings</Button>
      </div>

    </div>
  );
}
