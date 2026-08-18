"use client";

import { GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function SyllabusSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">3 — Syllabus / Modules</CardTitle>
        <Badge variant="secondary" className="text-[10px]">CMS</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Module → Topic → Project. Drag to reorder.</p>
        <Accordion defaultValue={[0]} className="space-y-2">
          <AccordionItem value="mod-1" className="border rounded-lg">
            <AccordionTrigger className="px-4 text-sm">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                Module 1 — <span className="text-muted-foreground">[Name]</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <Table>
                <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Subtopics</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow><TableCell>—</TableCell><TableCell className="text-muted-foreground">—</TableCell><TableCell className="text-xs"><a href="#" className="text-primary hover:underline">Edit</a> &middot; <button className="text-destructive hover:underline">Del</button></TableCell></TableRow>
                  <TableRow><TableCell>—</TableCell><TableCell className="text-muted-foreground">—</TableCell><TableCell className="text-xs"><a href="#" className="text-primary hover:underline">Edit</a> &middot; <button className="text-destructive hover:underline">Del</button></TableCell></TableRow>
                </TableBody>
              </Table>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">+ Topic</Button>
                <Button variant="ghost" size="sm">+ Project</Button>
              </div>
              <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-1">Project</div>
                <div className="flex justify-between items-center">
                  <div><span className="font-medium text-sm">Name: </span><span className="text-muted-foreground text-sm">—</span><br /><span className="text-xs text-muted-foreground">Description: —</span></div>
                  <div className="flex gap-2"><Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button><Button variant="ghost" size="sm" className="h-7 text-xs">Del</Button></div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mod-2" className="border rounded-lg">
            <AccordionTrigger className="px-4 text-sm">
              <div className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-muted-foreground" />Module 2 — <span className="text-muted-foreground">[Name]</span></div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4"><p className="text-sm text-muted-foreground">No topics added yet.</p></AccordionContent>
          </AccordionItem>
          <AccordionItem value="mod-3" className="border rounded-lg">
            <AccordionTrigger className="px-4 text-sm">
              <div className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-muted-foreground" />Module 3 — <span className="text-muted-foreground">[Name]</span></div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4"><p className="text-sm text-muted-foreground">No topics added yet.</p></AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button variant="outline" size="sm" className="mt-3">+ Add Module</Button>
      </CardContent>
    </Card>
  );
}
