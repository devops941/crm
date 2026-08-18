"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AddCategoryDialog } from "@/components/dashboard/add-category-dialog";
import { categories } from "@/lib/dummy-data";

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Course Categories</h1>
          <Badge variant="secondary">{categories.length} categories</Badge>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
      </div>

      <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search categories..." className="pl-9" /></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{cat.description}</div>
              </div>
              <Badge variant={cat.active ? "default" : "secondary"}>{cat.active ? "Active" : "Inactive"}</Badge>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{cat.courseCount} courses &bull; Order #{cat.order}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
        <Card className="border-dashed flex items-center justify-center min-h-[180px] cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setOpen(true)}>
          <div className="text-center text-muted-foreground"><Plus className="h-8 w-8 mx-auto mb-2 opacity-40" /><span className="text-sm">Add Category</span></div>
        </Card>
      </div>

      <AddCategoryDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
