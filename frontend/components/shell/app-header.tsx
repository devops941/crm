"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Plus, Menu } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalSearch } from "@/components/crm/global-search";
import { NotificationCenter } from "@/components/crm/notification-center";
import { NAV_ITEMS } from "@/lib/auth";
import { QuickCreate } from "@/components/crm/quick-create";
import type { QuickCreateEntityType } from "@/components/crm/quick-create";
import { PersonForm } from "@/components/crm/person-form";
import { OrganizationForm } from "@/components/crm/organization-form";
import { LeadForm } from "@/components/crm/lead-form";
import { OpportunityForm } from "@/components/crm/opportunity-form";
import { ActivityComposer } from "@/components/crm/activity-composer";
import { TaskForm } from "@/components/crm/task-form";
import { MoUForm } from "@/components/crm/mou-form";

interface AppHeaderProps {
  onMenuToggle?: () => void;
}

function resolveBreadcrumb(pathname: string): string {
  // Check top-level nav items
  for (const item of NAV_ITEMS) {
    if (item.href === pathname) return item.label;
    if (item.children) {
      for (const child of item.children) {
        if (pathname.startsWith(child.href)) return `${item.label} / ${child.label}`;
      }
    }
    if (item.href !== "/" && pathname.startsWith(item.href)) return item.label;
  }
  return "Dashboard";
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const breadcrumb = resolveBreadcrumb(pathname);

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  // Quick Create sheet
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  // Entity form dialogs — one open state per form
  const [personOpen, setPersonOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [opportunityOpen, setOpportunityOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [mouOpen, setMouOpen] = useState(false);

  function handleCreateEntity(type: QuickCreateEntityType) {
    switch (type) {
      case "person":
        setPersonOpen(true);
        break;
      case "organization":
      case "institution":
        setOrgOpen(true);
        break;
      case "lead":
        setLeadOpen(true);
        break;
      case "opportunity":
        setOpportunityOpen(true);
        break;
      case "activity":
        setActivityOpen(true);
        break;
      case "task":
        setTaskOpen(true);
        break;
      case "mou":
        setMouOpen(true);
        break;
      // student and enrollment have their own dedicated pages; navigate there
      case "student":
      case "enrollment":
        // TODO: router.push when student/enrollment create pages exist
        break;
    }
  }

  return (
    <>
      <header className="h-14 border-b border-border bg-card px-4 flex items-center gap-3 shrink-0">
        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={onMenuToggle}>
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumb / Page Name */}
        <div className="text-sm font-medium text-muted-foreground font-mono hidden sm:block">
          {breadcrumb}
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md ml-auto mr-2">
          <GlobalSearch />
        </div>

        {/* Quick Create */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-semibold hidden sm:flex"
          onClick={() => setQuickCreateOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Quick Create
        </Button>

        {/* Notification Center */}
        <NotificationCenter />

        {/* User Avatar */}
        <Avatar className="h-8 w-8 hidden sm:flex">
          <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </header>

      {/* ── Quick Create Sheet ─────────────────────────────────── */}
      <QuickCreate
        open={quickCreateOpen}
        onOpenChange={setQuickCreateOpen}
        onCreateEntity={handleCreateEntity}
      />

      {/* ── Entity Form Dialogs ────────────────────────────────── */}
      <PersonForm
        open={personOpen}
        onOpenChange={setPersonOpen}
        onSave={(data) => {
          console.log("Create person:", data);
          // TODO: call POST /persons API
        }}
      />

      <OrganizationForm
        open={orgOpen}
        onOpenChange={setOrgOpen}
        onSave={(data) => {
          console.log("Create organization:", data);
          // TODO: call POST /organizations API
        }}
      />

      <LeadForm
        mode="create"
        open={leadOpen}
        onOpenChange={setLeadOpen}
        onSave={(data) => {
          console.log("Create lead:", data);
          // TODO: call POST /leads API
        }}
      />

      <OpportunityForm
        open={opportunityOpen}
        onOpenChange={setOpportunityOpen}
        onSave={(data) => {
          console.log("Create opportunity:", data);
          // TODO: call POST /opportunities API
        }}
      />

      <ActivityComposer
        open={activityOpen}
        onOpenChange={setActivityOpen}
        onSave={(data) => {
          console.log("Log activity:", data);
          // TODO: call POST /activities API
        }}
      />

      <TaskForm
        open={taskOpen}
        onOpenChange={setTaskOpen}
        onSave={(data) => {
          console.log("Create task:", data);
          // TODO: call POST /tasks API
        }}
      />

      <MoUForm
        open={mouOpen}
        onOpenChange={setMouOpen}
        onSave={(data) => {
          console.log("Create MoU:", data);
          // TODO: call POST /mous API
        }}
      />
    </>
  );
}
