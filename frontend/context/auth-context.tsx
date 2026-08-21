"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type AuthUser, type PermissionAction, type PermissionResource, getUser, login as authLogin, logout as authLogout, hasPermission as checkPermission, canViewFinancials as checkFinancials, getVisibleNavItems, type NavItem } from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  hasPermission: (resource: PermissionResource, action: PermissionAction) => boolean;
  canViewFinancials: boolean;
  navItems: NavItem[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback((u: AuthUser) => {
    authLogin(u);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const hasPerm = useCallback(
    (resource: PermissionResource, action: PermissionAction) => checkPermission(user, resource, action),
    [user]
  );

  const financials = checkFinancials(user);
  const navItems = getVisibleNavItems(user);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission: hasPerm, canViewFinancials: financials, navItems }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
