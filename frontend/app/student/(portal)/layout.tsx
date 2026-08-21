"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, BookOpen, LogOut as LogOutIcon, BarChart3, CalendarDays, ClipboardCheck } from "lucide-react";
import { LogoutDialog } from "@/components/logout-dialog";
import { getUser } from "@/lib/auth";

const navItems = [
  { name: "Check-In", href: "/student/checkin", icon: MapPin },
  { name: "Today", href: "/student/today", icon: BookOpen },
  { name: "Check Out", href: "/student/checkout", icon: ClipboardCheck },
  { name: "Progress", href: "/student/progress", icon: BarChart3 },
  { name: "Attendance", href: "/student/attendance", icon: CalendarDays },
  { name: "Logout", href: "#logout", icon: LogOutIcon },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) { router.replace("/login"); return; }
    // Student self-service is accessible to any authenticated user for now
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-background max-w-lg mx-auto relative">
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around px-1 py-1.5">
          {navItems.map((item) => {
            const isLogout = item.href === "#logout";
            const isActive = !isLogout && pathname === item.href;

            if (isLogout) {
              return (
                <button
                  key="logout"
                  onClick={() => setLogoutOpen(true)}
                  className="flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all min-w-0 flex-1 text-muted-foreground"
                >
                  <div className="p-1.5 rounded-full">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] leading-tight font-medium">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all min-w-0 flex-1 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all ${isActive ? "bg-primary/10" : ""}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                </div>
                <span className={`text-[10px] leading-tight ${isActive ? "font-semibold" : "font-medium"}`}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
}
