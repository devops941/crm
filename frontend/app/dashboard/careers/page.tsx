"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { CareerPathItem } from "@/components/dashboard/career-path-item";
import { AddRoleDialog } from "@/components/dashboard/add-role-dialog";

const paths = [
  { id: "p1", name: "Career Path Name", description: "Description", courses: ["—", "—"], roles: [
    { title: "—", salary: "₹— LPA", demand: "Very High" },
    { title: "—", salary: "₹— LPA", demand: "High" },
    { title: "—", salary: "₹— LPA", demand: "Medium" },
  ]},
  { id: "p2", name: "Career Path Name", description: "Description", courses: ["—"], roles: [
    { title: "—", salary: "₹— LPA", demand: "High" },
  ]},
  { id: "p3", name: "Career Path Name", description: "Description", courses: ["—"], roles: [] },
];

export default function CareersPage() {
  const [roleOpen, setRoleOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Career Paths</h1>
          <Badge variant="secondary">CAREERS</Badge>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Career Path</Button>
      </div>

      <Accordion defaultValue={[0]} className="space-y-2">
        {paths.map((p) => (
          <CareerPathItem key={p.id} {...p} onAddRole={() => setRoleOpen(true)} />
        ))}
      </Accordion>

      <AddRoleDialog open={roleOpen} onOpenChange={setRoleOpen} />

      
    </div>
  );
}
