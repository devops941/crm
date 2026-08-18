"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const demandColors: Record<string, string> = {
  "Very High": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  High: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Low: "bg-muted text-muted-foreground",
};

interface Role { title: string; salary: string; demand: string; }
interface CareerPathItemProps {
  id: string;
  name: string;
  description: string;
  courses: string[];
  roles: Role[];
  onAddRole?: () => void;
}

export function CareerPathItem({ id, name, description, courses, roles, onAddRole }: CareerPathItemProps) {
  return (
    <AccordionItem value={id} className="border rounded-lg">
      <AccordionTrigger className="px-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{name}</span>
          <span className="text-muted-foreground text-xs">— {description}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-3">
        <div className="text-xs text-muted-foreground">
          Linked Courses: {courses.map((c, i) => (<Badge key={i} variant="outline" className="text-[10px] ml-1">{c}</Badge>))}
        </div>
        <Table>
          <TableHeader><TableRow><TableHead>Role Title</TableHead><TableHead>Salary Range</TableHead><TableHead>Demand</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {roles.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell className="text-muted-foreground">{r.salary}</TableCell>
                <TableCell><Badge variant="outline" className={`text-[10px] ${demandColors[r.demand]}`}>{r.demand}</Badge></TableCell>
                <TableCell className="text-xs"><a href="#" className="text-primary hover:underline">Edit</a> &middot; <button className="text-destructive hover:underline">Del</button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outline" size="sm" onClick={onAddRole}>+ Add Role</Button>
      </AccordionContent>
    </AccordionItem>
  );
}
