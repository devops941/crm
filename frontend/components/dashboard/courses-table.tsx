"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CrudActions } from "@/components/dashboard/crud-actions";
import { courses } from "@/lib/dummy-data";

const levelColors: Record<string, string> = {
  Beginner: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Learner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Expert: "bg-violet-500/10 text-violet-500 border-violet-500/20",
};

export function CoursesTable() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead><TableHead>Category</TableHead><TableHead>Levels</TableHead>
              <TableHead>Duration</TableHead><TableHead>Fee</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-semibold">{c.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{c.category}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {c.levels.map((l) => (<Badge key={l} variant="outline" className={`text-[10px] ${levelColors[l]}`}>{l}</Badge>))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{c.duration}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{c.fee}</TableCell>
                <TableCell><Badge variant={c.status === "Published" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                <TableCell><CrudActions data={c} label="course" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Showing 1-{courses.length} of {courses.length}</span>
          <Pagination><PaginationContent>
            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" /></PaginationItem>
          </PaginationContent></Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
