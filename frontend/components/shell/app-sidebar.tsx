"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, GraduationCap, UserPlus, TrendingUp,
  FileSignature, Activity, BookOpen, ClipboardList, Route, UserCheck,
  CalendarCheck, BarChart3, Award, Briefcase, Heart, Settings,
  ChevronRight, LogOut, Search, FileText
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NavItem } from "@/lib/auth";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Users, Building2, GraduationCap, UserPlus, TrendingUp,
  FileSignature, Activity, BookOpen, ClipboardList, Route, UserCheck,
  CalendarCheck, BarChart3, Award, Briefcase, Heart, Settings, Search, FileText,
};

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [flyoutPos, setFlyoutPos] = useState({ top: 0, left: 0 });

  // Close on click outside
  useEffect(() => {
    if (!flyoutOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        flyoutRef.current && !flyoutRef.current.contains(target)
      ) {
        setFlyoutOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [flyoutOpen]);

  const Icon = ICON_MAP[item.icon] || Activity;
  const isActive = item.children
    ? item.children.some((c) => pathname.startsWith(c.href))
    : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  function handleToggle() {
    if (!flyoutOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setFlyoutPos({ top: rect.top, left: rect.right + 4 });
    }
    setFlyoutOpen(!flyoutOpen);
  }

  // Parent with children → flyout to the right (fixed position, escapes overflow)
  if (item.children) {
    return (
      <div>
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive || flyoutOpen
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {/* Flyout — fixed position so it escapes sidebar overflow-hidden */}
        {flyoutOpen && (
          <div
            ref={flyoutRef}
            className="fixed z-[100] w-52 bg-card border border-border rounded-lg shadow-xl py-2 px-1.5 space-y-0.5"
            style={{ top: flyoutPos.top, left: flyoutPos.left }}
          >
            <div className="px-2 pb-1.5 mb-1 border-b border-border">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
            {item.children.map((child) => {
              const ChildIcon = ICON_MAP[child.icon] || Activity;
              const childActive = pathname === child.href || pathname.startsWith(child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setFlyoutOpen(false)}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                    childActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                  }`}
                >
                  <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1">{child.label}</span>
                  {child.badge && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-mono opacity-60">
                      {child.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Regular nav link
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

      {/* Navigation — scrollable, user section stays pinned below */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="space-y-1 px-3 py-3">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </ScrollArea>
      </div>

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
