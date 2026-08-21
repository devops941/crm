"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Shield, Users, GraduationCap, Phone, BookOpen, Briefcase, BarChart3, Megaphone, DollarSign, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEV_USERS, getUser, type AuthUser } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import type { RoleName } from "@/lib/types";

const ROLE_QUICK_PICKS: { role: RoleName; email: string; icon: React.ElementType; label: string }[] = [
  { role: "founder", email: "founder@kaizen.com", icon: Shield, label: "Founder" },
  { role: "admin", email: "admin@kaizen.com", icon: Users, label: "Admin" },
  { role: "sales", email: "sales@kaizen.com", icon: BarChart3, label: "Sales" },
  { role: "education_counsellor", email: "counsellor@kaizen.com", icon: GraduationCap, label: "Counsellor" },
  { role: "trainer", email: "trainer@kaizen.com", icon: BookOpen, label: "Trainer" },
  { role: "finance", email: "finance@kaizen.com", icon: DollarSign, label: "Finance" },
  { role: "telecaller", email: "telecaller@kaizen.com", icon: Phone, label: "Telecaller" },
];

export default function LoginPage() {
  const router = useRouter();
  const { user: currentUser, login: contextLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = DEV_USERS[email];
      if (!user || user.password !== password) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      const authUser: AuthUser = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        role_label: user.role_label,
        branch_id: user.branch_id,
        branch_name: user.branch_name,
      };
      contextLogin(authUser);
      router.push("/dashboard");
    }, 400);
  };

  const fillCredentials = (email: string) => {
    const user = DEV_USERS[email];
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
      setSelectedEmail(email);
      setError("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="pt-8 pb-8 px-6 sm:px-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
                KI
              </div>
              <h1 className="text-xl font-bold">Kaizen CRM</h1>
              <p className="text-sm text-muted-foreground mt-1">Unified CRM — Sign in to continue</p>
            </div>

            {/* Role Quick-Picks */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {ROLE_QUICK_PICKS.map(({ role, email: e, icon: Icon, label }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillCredentials(e)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                    selectedEmail === e
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${selectedEmail === e ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-[10px] font-semibold leading-tight">{label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => fillCredentials("student@kaizen.com")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                  selectedEmail === "student@kaizen.com"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <UserCheck className={`h-5 w-5 ${selectedEmail === "student@kaizen.com" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-[10px] font-semibold leading-tight">Student</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-2.5 text-center">{error}</p>
              )}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Click a role above to auto-fill credentials. Dev mode only.
        </p>
      </div>
    </div>
  );
}
