// ═══════════════════════════════════════════════════════════════
// KAIZEN CRM — AUTH + RBAC SYSTEM
// Matches Engineering Handoff §8 RBAC + §15 Security
// ═══════════════════════════════════════════════════════════════

import type { RoleName, Permission, PermissionAction, PermissionResource, Role } from "./types";
export type { PermissionAction, PermissionResource };

// ── Permission Matrix (§8 — every cell from the handoff) ──
// V=view, C=create, E=edit, D=delete, A=assign, X=export, F=financial
const PERMISSION_MATRIX: Record<RoleName, Partial<Record<PermissionResource, PermissionAction[]>>> = {
  founder: {
    people: ["view", "create", "edit", "delete", "assign", "export"],
    organizations: ["view", "create", "edit", "delete", "assign", "export"],
    institutions: ["view", "create", "edit", "delete", "assign", "export"],
    mous: ["view", "create", "edit", "delete", "assign", "export"],
    leads: ["view", "create", "edit", "delete", "assign", "export"],
    opportunities: ["view", "create", "edit", "delete", "assign", "financial"],
    education: ["view", "create", "edit", "delete", "assign", "export"],
    projects: ["view", "create", "edit", "delete", "assign", "export"],
    payments: ["view", "create", "edit", "delete", "assign", "financial"],
    reports: ["view", "export", "financial"],
    documents: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit", "delete"],
  },
  admin: {
    people: ["view", "create", "edit", "delete", "assign", "export"],
    organizations: ["view", "create", "edit", "delete", "assign", "export"],
    institutions: ["view", "create", "edit", "delete", "assign", "export"],
    mous: ["view", "create", "edit", "delete", "assign", "export"],
    leads: ["view", "create", "edit", "delete", "assign", "export"],
    opportunities: ["view", "create", "edit", "delete", "assign", "export"],
    education: ["view", "create", "edit", "delete", "assign", "export"],
    projects: ["view", "create", "edit", "delete", "assign", "export"],
    payments: ["view", "create", "edit", "delete", "assign", "financial"],
    reports: ["view", "export"],
    documents: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit", "delete"],
  },
  sales: {
    people: ["view", "create", "edit", "assign"],
    organizations: ["view", "create", "edit", "assign"],
    institutions: ["view", "create", "edit", "assign"],
    mous: ["view", "create", "edit", "assign"],
    leads: ["view", "create", "edit", "assign"],
    opportunities: ["view", "create", "edit", "assign"],
    education: ["view"],
    projects: ["view"],
    reports: ["view"],
    documents: ["view", "create", "edit"],
  },
  telecaller: {
    people: ["view", "create", "edit", "assign"], // own-owned only
    organizations: ["view"],
    institutions: ["view"],
    leads: ["view", "create", "edit", "assign"], // own-owned only
    opportunities: ["view"],
    education: ["view"],
    reports: ["view"],
    documents: ["view"],
  },
  education_counsellor: {
    people: ["view", "create", "edit", "assign"], // own-owned only
    organizations: ["view"],
    institutions: ["view", "create", "edit", "assign"], // own/unowned in branch
    mous: ["view", "create", "edit", "assign"],
    leads: ["view", "create", "edit", "assign"],
    education: ["view", "create", "edit", "assign"],
    reports: ["view"],
    documents: ["view", "create", "edit"],
  },
  trainer: {
    people: ["view"],
    institutions: ["view"],
    education: ["view", "create", "edit"], // own batch only
    reports: ["view"],
    documents: ["view"],
  },
  project_manager: {
    people: ["view"],
    organizations: ["view"],
    institutions: ["view"],
    mous: ["view"],
    opportunities: ["view"],
    projects: ["view", "create", "edit", "assign"],
    payments: ["view"],
    reports: ["view"],
    documents: ["view", "create", "edit"],
  },
  workforce_placement: {
    people: ["view", "create", "edit", "assign"],
    organizations: ["view", "create", "edit", "assign"],
    institutions: ["view", "create", "edit", "assign"],
    mous: ["view", "create", "edit", "assign"],
    leads: ["view", "create", "edit", "assign"],
    opportunities: ["view", "create", "edit", "assign"],
    education: ["view", "create", "edit", "assign"],
    projects: ["view"],
    payments: ["view"],
    reports: ["view"],
    documents: ["view", "create", "edit"],
  },
  finance: {
    people: ["view"],
    organizations: ["view"],
    institutions: ["view"],
    mous: ["view"],
    leads: [],
    opportunities: ["view", "financial"],
    education: ["view"],
    projects: ["view", "financial"],
    payments: ["view", "create", "edit", "delete", "assign", "financial"],
    reports: ["view", "export", "financial"],
    documents: ["view"],
  },
  marketing: {
    people: ["view"],
    organizations: ["view", "create"],
    institutions: ["view"],
    mous: ["view"],
    leads: ["view", "create"],
    opportunities: ["view"],
    education: ["view"],
    reports: ["view"],
    documents: ["view"],
  },
};

// ── Build Role objects ──
const ROLE_LABELS: Record<RoleName, string> = {
  founder: "Founder / Executive",
  admin: "Admin",
  sales: "Sales / BD",
  telecaller: "Telecaller",
  education_counsellor: "Education Counsellor",
  trainer: "Trainer",
  project_manager: "Project Manager",
  workforce_placement: "Workforce / Placement",
  finance: "Finance",
  marketing: "Marketing",
};

export function buildRole(name: RoleName): Role {
  const perms: Permission[] = [];
  const matrix = PERMISSION_MATRIX[name] || {};
  for (const [resource, actions] of Object.entries(matrix)) {
    for (const action of actions || []) {
      perms.push({ resource: resource as PermissionResource, action: action as PermissionAction });
    }
  }
  return {
    _id: `role_${name}`,
    name,
    label: ROLE_LABELS[name],
    permissions: perms,
    created_at: "2024-01-01T00:00:00Z",
    created_by: "system",
    updated_at: "2024-01-01T00:00:00Z",
    updated_by: "system",
  };
}

export function getAllRoles(): Role[] {
  return (Object.keys(ROLE_LABELS) as RoleName[]).map(buildRole);
}

// ── Permission check helpers ──
export function hasPermission(user: AuthUser | null, resource: PermissionResource, action: PermissionAction): boolean {
  if (!user) return false;
  const matrix = PERMISSION_MATRIX[user.role];
  if (!matrix) return false;
  const actions = matrix[resource];
  if (!actions) return false;
  return actions.includes(action);
}

export function canViewFinancials(user: AuthUser | null): boolean {
  return hasPermission(user, "reports", "financial") || hasPermission(user, "payments", "financial");
}

export function getVisibleNavItems(user: AuthUser | null): NavItem[] {
  if (!user) return [];
  return NAV_ITEMS.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(user, item.permission.resource, item.permission.action);
  });
}

// ── Auth User (extended with role info) ──
export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: RoleName;
  role_label: string;
  avatar_url?: string | null;
  branch_id?: string | null;
  branch_name?: string | null;
}

// ── Dev Users for prototype (will be replaced with real auth) ──
export const DEV_USERS: Record<string, AuthUser & { password: string }> = {
  "founder@kaizen.com": {
    _id: "u1", email: "founder@kaizen.com", name: "Ramesh Iyer", role: "founder",
    role_label: "Founder / Executive", password: "founder123", branch_name: "All",
  },
  "admin@kaizen.com": {
    _id: "u2", email: "admin@kaizen.com", name: "Priya Ramesh", role: "admin",
    role_label: "Admin", password: "admin123", branch_id: "br1", branch_name: "Madurai HQ",
  },
  "sales@kaizen.com": {
    _id: "u3", email: "sales@kaizen.com", name: "Arjun Kumar", role: "sales",
    role_label: "Sales / BD", password: "sales123", branch_id: "br1", branch_name: "Madurai HQ",
  },
  "counsellor@kaizen.com": {
    _id: "u4", email: "counsellor@kaizen.com", name: "Kavya Suresh", role: "education_counsellor",
    role_label: "Education Counsellor", password: "edu123", branch_id: "br1", branch_name: "Madurai HQ",
  },
  "trainer@kaizen.com": {
    _id: "u5", email: "trainer@kaizen.com", name: "Meera Venkat", role: "trainer",
    role_label: "Trainer", password: "trainer123", branch_id: "br1", branch_name: "Madurai HQ",
  },
  "finance@kaizen.com": {
    _id: "u6", email: "finance@kaizen.com", name: "Suresh Rajan", role: "finance",
    role_label: "Finance", password: "finance123", branch_id: "br1", branch_name: "Madurai HQ",
  },
  "telecaller@kaizen.com": {
    _id: "u7", email: "telecaller@kaizen.com", name: "Divya S", role: "telecaller",
    role_label: "Telecaller", password: "tele123", branch_id: "br1", branch_name: "Madurai HQ",
  },
  "student@kaizen.com": {
    _id: "u8", email: "student@kaizen.com", name: "Deepa Krishnan", role: "education_counsellor",
    role_label: "Student (self-service)", password: "student123",
  },
  "marketing@kaizen.com": {
    _id: "u9", email: "marketing@kaizen.com", name: "Anita Sharma", role: "marketing",
    role_label: "Marketing", password: "marketing123", branch_id: "br1", branch_name: "Madurai HQ",
  },
  "placement@kaizen.com": {
    _id: "u10", email: "placement@kaizen.com", name: "Ravi Placement", role: "workforce_placement",
    role_label: "Workforce / Placement", password: "placement123", branch_id: "br1", branch_name: "Madurai HQ",
  },
  "pm@kaizen.com": {
    _id: "u11", email: "pm@kaizen.com", name: "Karthik PM", role: "project_manager",
    role_label: "Project Manager", password: "pm123", branch_id: "br1", branch_name: "Madurai HQ",
  },
};

// ── Session management ──
const AUTH_KEY = "kaizen_auth_user";
const SESSION_EXPIRY_KEY = "kaizen_session_expiry";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours sliding

export function login(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
}

export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  // Check session expiry
  const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (expiryStr) {
    const expiry = Number(expiryStr);
    if (Date.now() > expiry) {
      logout();
      return null;
    }
    // Slide the session
    localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
  }
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}

// ── Navigation structure (§6 routes, §2 sidebar) ──
export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  permission?: { resource: PermissionResource; action: PermissionAction };
  children?: NavItem[];
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", permission: { resource: "reports", action: "view" } },
  { label: "People", href: "/people", icon: "Users", permission: { resource: "people", action: "view" } },
  { label: "Organizations", href: "/organizations", icon: "Building2", permission: { resource: "organizations", action: "view" } },
  { label: "Institutions", href: "/institutions", icon: "GraduationCap", permission: { resource: "institutions", action: "view" } },
  { label: "Leads", href: "/leads", icon: "UserPlus", permission: { resource: "leads", action: "view" } },
  { label: "Opportunities", href: "/opportunities", icon: "TrendingUp", permission: { resource: "opportunities", action: "view" } },
  { label: "MoUs", href: "/mous", icon: "FileSignature", permission: { resource: "mous", action: "view" } },
  { label: "Activities", href: "/activities", icon: "Activity", permission: { resource: "people", action: "view" } },
  {
    label: "Education",
    href: "/education",
    icon: "BookOpen",
    permission: { resource: "education", action: "view" },
    children: [
      { label: "Students", href: "/education/students", icon: "GraduationCap" },
      { label: "Admissions", href: "/education/admissions", icon: "ClipboardList" },
      { label: "Courses", href: "/education/courses", icon: "BookOpen" },
      { label: "Career Paths", href: "/education/careers", icon: "Route" },
      { label: "Enrollments", href: "/education/enrollments", icon: "UserCheck" },
      { label: "Attendance", href: "/education/attendance", icon: "CalendarCheck" },
      { label: "Learning Progress", href: "/education/progress", icon: "BarChart3" },
      { label: "Certifications", href: "/education/certifications", icon: "Award", badge: "Ph.2" },
      { label: "Placements", href: "/education/placements", icon: "Briefcase", badge: "Ph.2" },
      { label: "Alumni", href: "/education/alumni", icon: "Heart", badge: "Ph.2" },
    ],
  },
  { label: "Audit Log", href: "/audit-log", icon: "FileText", permission: { resource: "users", action: "view" } },
  { label: "Reports", href: "/reports", icon: "BarChart3", permission: { resource: "reports", action: "view" }, badge: "Ph.3" },
  { label: "Settings", href: "/settings", icon: "Settings", badge: "Ph.2" },
];
