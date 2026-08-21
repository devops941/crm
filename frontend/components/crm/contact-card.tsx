import * as React from "react";
import Link from "next/link";
import { PhoneIcon, MailIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  personId: string;
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

export function ContactCard({
  name,
  role,
  phone,
  email,
  personId,
  className,
}: ContactCardProps) {
  return (
    <Link
      href={`/people/${personId}`}
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50 outline-none",
        className
      )}
    >
      {/* Avatar */}
      <Avatar size="default" className="mt-0.5 shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{role}</p>

        <div className="flex flex-col gap-0.5 mt-1.5">
          {phone && (
            <span
              onClick={(e) => e.preventDefault()}
              className="inline-flex"
            >
              <a
                href={`tel:${phone}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <PhoneIcon className="size-3 shrink-0" />
                {phone}
              </a>
            </span>
          )}
          {email && (
            <span
              onClick={(e) => e.preventDefault()}
              className="inline-flex"
            >
              <a
                href={`mailto:${email}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MailIcon className="size-3 shrink-0" />
                <span className="truncate">{email}</span>
              </a>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
