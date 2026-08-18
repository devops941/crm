"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StaffTable } from "@/components/dashboard/counsellors-table";
import { AddStaffDialog } from "@/components/dashboard/add-counsellor-dialog";

export default function StaffPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Staff / Employees</h1>
          <Badge variant="secondary">TEAM</Badge>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Staff
        </Button>
      </div>

      <div className="flex gap-3">
        <Select>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Branches" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Branches</SelectItem></SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="counsellor">Counsellor</SelectItem>
            <SelectItem value="branch_admin">Branch Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <StaffTable />
      <AddStaffDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
