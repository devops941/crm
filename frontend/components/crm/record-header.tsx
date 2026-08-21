"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BadgeDef {
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
}

interface ActionDef {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost";
  icon?: React.ElementType;
}

interface RecordHeaderProps {
  title: string;
  subtitle?: string;
  badges?: BadgeDef[];
  actions?: ActionDef[];
  backHref?: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function RecordHeader({
  title,
  subtitle,
  badges = [],
  actions = [],
  backHref,
  className,
}: RecordHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 pb-4 border-b border-border", className)}>
      {/* Back link */}
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </Link>
      )}

      {/* Main row: avatar + title/subtitle + actions */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar size="lg" className="mt-0.5 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {getInitials(title)}
          </AvatarFallback>
        </Avatar>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold leading-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {badges.map((b, i) => (
                <Badge key={i} variant={b.variant ?? "outline"}>
                  {b.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {actions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <Button
                  key={i}
                  variant={a.variant ?? "outline"}
                  size="sm"
                  onClick={a.onClick}
                >
                  {Icon && <Icon className="size-3.5" />}
                  {a.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
