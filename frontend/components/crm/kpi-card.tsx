import * as React from "react";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Delta {
  value: string;
  positive: boolean;
}

interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  delta?: Delta;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  subtitle,
  onClick,
  className,
}: KpiCardProps) {
  const isClickable = Boolean(onClick);

  return (
    <Card
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick?.();
            }
          : undefined
      }
      className={cn(
        "transition-shadow",
        isClickable && "cursor-pointer hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50 outline-none",
        className
      )}
    >
      <CardContent className="flex flex-col gap-2">
        {/* Icon + label row */}
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {Icon && (
            <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="size-3.5 text-primary" />
            </div>
          )}
        </div>

        {/* Value */}
        <p className="text-2xl font-bold leading-none tracking-tight">{value}</p>

        {/* Delta */}
        {delta && (
          <div
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              delta.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {delta.positive ? (
              <TrendingUpIcon className="size-3" />
            ) : (
              <TrendingDownIcon className="size-3" />
            )}
            {delta.value}
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
