"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CategoryCardProps {
  icon: string;
  name: string;
  description: string;
  courseCount: string;
  order: number;
  active: boolean;
}

export function CategoryCard({ icon, name, description, courseCount, order, active }: CategoryCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-muted-foreground mt-1">{description}</div>
          </div>
          <Badge variant={active ? "default" : "secondary"}>{active ? "Active" : "Inactive"}</Badge>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{courseCount} courses &bull; Order #{order}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs"><Pencil className="h-3 w-3 mr-1" />Edit</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive"><Trash2 className="h-3 w-3" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
