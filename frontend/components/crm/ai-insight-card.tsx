import * as React from "react";
import { LightbulbIcon, PlusIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiInsightCardProps {
  title: string;
  reasons: string[];
  recommendedAction: string;
  onCreateActivity?: () => void;
  className?: string;
}

export function AiInsightCard({
  title,
  reasons,
  recommendedAction,
  onCreateActivity,
  className,
}: AiInsightCardProps) {
  return (
    <Card
      className={cn(
        "border-amber-400/60 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20",
        className
      )}
    >
      <CardContent className="flex flex-col gap-3">
        {/* Label */}
        <div className="flex items-center gap-2">
          <LightbulbIcon className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Rule-Based Insight
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold leading-snug text-foreground">{title}</p>

        {/* Reasons */}
        {reasons.length > 0 && (
          <ul className="flex flex-col gap-1 pl-3.5">
            {reasons.map((reason, i) => (
              <li
                key={i}
                className="text-xs text-muted-foreground list-disc list-outside"
              >
                {reason}
              </li>
            ))}
          </ul>
        )}

        {/* Recommended action */}
        <div className="rounded-lg bg-amber-100/80 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/40 px-3 py-2">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
            Recommended action
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            {recommendedAction}
          </p>
        </div>

        {/* CTA */}
        {onCreateActivity && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateActivity}
            className="self-start gap-1.5 border-amber-400 text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:border-amber-600 dark:hover:bg-amber-900/30"
          >
            <PlusIcon className="size-3.5" />
            Create Activity from this
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
