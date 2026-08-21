"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, GraduationCap, UserPlus, TrendingUp,
  FileSignature, Activity, BookOpen, ClipboardList, Route, UserCheck,
  CalendarCheck, BarChart3, Award, Briefcase, Heart, Settings,
  ChevronDown, ChevronRight, LogOut, Search, FileText
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { NavItem } from "@/lib/auth";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Users, Building2, GraduationCap, UserPlus, TrendingUp,
  FileSignature, Activity, BookOpen, ClipboardList, Route, UserCheck,
  CalendarCheck, BarChart3, Award, Briefcase, Heart, Settings, Search, FileText,
};

function NavLink({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(() => {
    if (!item.children) return false;
    return item.children.some((c) => pathname.startsWith(c.href));
  });

  const Icon = ICON_MAP[item.icon] || Activity;
  const isActive = item.children
    ? item.children.some((c) => pathname.startsWith(c.href))
    : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  if (item.children) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-mono">
              {item.badge}
            </Badge>
          )}
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        {expanded && (
          <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2">
            {item.children.map((child) => (
              <NavLink key={child.href} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-mono opacity-60">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}

interface AppSidebarProps {
  onLogout: () => void;
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const { user, navItems } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-[220px] shrink-0 border-r border-border bg-card flex flex-col h-screen" role="navigation" aria-label="Main navigation">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            KI
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">Kaizen CRM</div>
            <div className="text-[10px] text-muted-foreground font-mono">UNIFIED CRM</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2.5 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-[10px] text-muted-foreground truncate">{user.role_label}</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground h-8 text-xs" onClick={onLogout}>
          <LogOut className="h-3.5 w-3.5 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
