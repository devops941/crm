"use client";

import * as React from "react";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/crm/status-badge";
import { RelationshipForm } from "@/components/crm/relationship-form";
import type { RelationshipFormData } from "@/components/crm/relationship-form";
import type { Relationship, RelationshipStrength } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RelatedEntity {
  type: string;
  id: string;
  name: string;
}

interface RelationshipPanelProps {
  relationships: Relationship[];
  fromEntity?: RelatedEntity;
  onAdd?: () => void;
  onAddRelationship?: (data: RelationshipFormData) => void;
  className?: string;
}

const STRENGTH_DOTS: Record<RelationshipStrength, number> = {
  weak: 1,
  moderate: 3,
  strong: 5,
};

function StrengthIndicator({ strength }: { strength?: RelationshipStrength | null }) {
  const filled = strength ? STRENGTH_DOTS[strength] : 0;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Strength: ${strength ?? "unknown"}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full",
            i < filled ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </span>
  );
}

function formatRelType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RelationshipPanel({
  relationships,
  fromEntity,
  onAdd,
  onAddRelationship,
  className,
}: RelationshipPanelProps) {
  const [formOpen, setFormOpen] = useState(false);

  function handleAddClick() {
    if (onAdd) {
      onAdd();
    } else {
      setFormOpen(true);
    }
  }

  function handleSave(data: RelationshipFormData) {
    onAddRelationship?.(data);
  }

  return (
    <>
      <Card className={cn("", className)}>
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-sm font-semibold">Relationships</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {relationships.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No relationships recorded.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {relationships.map((rel) => (
                <li key={rel._id} className="px-4 py-3 flex flex-col gap-1.5">
                  {/* from → to */}
                  <div className="flex items-center gap-1.5 flex-wrap text-sm">
                    <span className="font-medium">{rel.from_name ?? rel.from_id}</span>
                    <span className="text-muted-foreground text-xs">→</span>
                    <span className="font-medium">{rel.to_name ?? rel.to_id}</span>
                  </div>

                  {/* Metadata row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                      {formatRelType(rel.relationship_type)}
                    </Badge>
                    {rel.role && (
                      <span className="text-xs text-muted-foreground">{rel.role}</span>
                    )}
                    <StrengthIndicator strength={rel.strength} />
                    <StatusBadge status={rel.status} size="sm" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>

        <CardFooter className="pt-3">
          <Button variant="outline" size="sm" onClick={handleAddClick} className="w-full gap-1.5">
            <PlusIcon className="size-3.5" />
            Add Relationship
          </Button>
        </CardFooter>
      </Card>

      <RelationshipForm
        open={formOpen}
        onOpenChange={setFormOpen}
        fromEntity={fromEntity}
        onSave={handleSave}
      />
    </>
  );
}
