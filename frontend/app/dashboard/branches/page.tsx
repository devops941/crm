"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BranchesTable } from "@/components/dashboard/branches-table";
import { AddBranchDialog } from "@/components/dashboard/add-branch-dialog";

export default function BranchesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Branches</h1>
          <Badge variant="secondary">ORGANIZATION</Badge>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Branch
        </Button>
      </div>

      <BranchesTable />
      <AddBranchDialog open={open} onOpenChange={setOpen} />

      
    </div>
  );
}
