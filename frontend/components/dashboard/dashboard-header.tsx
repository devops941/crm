"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { navGroups } from "@/components/dashboard/sidebar";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const pathname = usePathname();

  const currentPage = navGroups
    .flatMap((g) => g.items)
    .find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
    ?.name || "Dashboard";

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="text-sm text-muted-foreground">{currentPage}</div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Super Admin</span>
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">SA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
