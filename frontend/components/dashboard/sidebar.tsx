"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X,
  LayoutDashboard, FolderTree, BookOpen, TrendingUp, Building2, Users,
  Settings, LogOut, GraduationCap, UserPlus, MessageCircle, Shield,
  ClipboardList, MapPin, BarChart3, Gauge, Phone,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navGroups = [
  { label: "Main", items: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ]},
  { label: "Course Management", items: [
    { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
    { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Career Paths", href: "/dashboard/careers", icon: TrendingUp },
  ]},
  { label: "Organization", items: [
    { name: "Branches", href: "/dashboard/branches", icon: Building2 },
    { name: "Staff / Employees", href: "/dashboard/counsellors", icon: Users },
    { name: "Students", href: "/dashboard/students", icon: GraduationCap },
  ]},
  { label: "CRM", items: [
    { name: "CRM Dashboard", href: "/dashboard/crm", icon: Gauge },
    { name: "Leads & Pipeline", href: "/dashboard/leads", icon: UserPlus },
    { name: "Follow-ups", href: "/dashboard/followups", icon: Phone },
    { name: "Sessions", href: "/dashboard/sessions", icon: MessageCircle },
  ]},
  { label: "Tracking", items: [
    { name: "Enrollments", href: "/dashboard/enrollments", icon: ClipboardList },
    { name: "Attendance", href: "/dashboard/attendance", icon: MapPin },
    { name: "Progress Reports", href: "/dashboard/progress", icon: BarChart3 },
  ]},
  { label: "System", items: [
    { name: "Users & RBAC", href: "/dashboard/users", icon: Shield },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]},
];

export { navGroups };

interface DashboardSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
}

export function DashboardSidebar({ open, onOpenChange, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={() => onOpenChange(false)}>
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">CC</div>
          <div>
            <div className="text-sm font-bold text-sidebar-foreground leading-tight">Course Counselling</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin Panel</div>
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {navGroups.map((group) => (
            <div key={group.label} className="px-3 py-1.5">
              <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted-foreground px-3 mb-1">
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">SA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-sidebar-foreground truncate">Admin User</div>
            <Badge variant="outline" className="text-[9px] px-1.5 py-0">Super Admin</Badge>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" title="Logout" onClick={onLogout}>
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-border bg-sidebar flex-col h-screen">
        {navContent}
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-border flex flex-col z-50 animate-in slide-in-from-left duration-200">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
