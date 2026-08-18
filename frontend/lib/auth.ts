export type UserRole = "admin" | "student";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

// Static dev credentials
export const DEV_USERS: Record<string, AuthUser & { password: string }> = {
  "admin@company.com": { email: "admin@company.com", name: "Admin User", role: "admin", password: "admin123" },
  "student@company.com": { email: "student@company.com", name: "Student User", role: "student", password: "student123" },
};

export function login(user: AuthUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_user", JSON.stringify(user));
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_user");
  }
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("auth_user");
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
