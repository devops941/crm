"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DEV_USERS, login, getUser } from "@/lib/auth";
import type { UserRole } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");

  // If already logged in, redirect
  useEffect(() => {
    const user = getUser();
    if (user) {
      router.replace(user.role === "admin" ? "/dashboard" : "/student/checkin");
    }
  }, [router]);

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
      if (user.role !== selectedRole) {
        setError(`This account is not a ${selectedRole} account`);
        setLoading(false);
        return;
      }

      login({ email: user.email, name: user.name, role: user.role });

      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/student/checkin");
      }
    }, 600);
  };

  const fillCredentials = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "admin") {
      setEmail("admin@company.com");
      setPassword("admin123");
    } else {
      setEmail("student@company.com");
      setPassword("student123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="pt-8 pb-8 px-6 sm:px-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
                CC
              </div>
              <h1 className="text-xl font-bold">Course Counselling</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to continue</p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => fillCredentials("admin")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedRole === "admin"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <Shield className={`h-6 w-6 ${selectedRole === "admin" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-semibold">Admin</span>
                <span className="text-[10px] text-muted-foreground">Dashboard access</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("student")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedRole === "student"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <GraduationCap className={`h-6 w-6 ${selectedRole === "student" ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-sm font-semibold">Student</span>
                <span className="text-[10px] text-muted-foreground">Check-in & syllabus</span>
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? "Signing in..." : `Sign In as ${selectedRole === "admin" ? "Admin" : "Student"}`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Dev Credentials */}
        <div className="mt-4 rounded-xl border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Dev Credentials (click to fill):</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button onClick={() => fillCredentials("admin")} className="text-left p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <p className="font-medium">Admin</p>
              <p className="text-muted-foreground">admin@company.com</p>
              <p className="text-muted-foreground">admin123</p>
            </button>
            <button onClick={() => fillCredentials("student")} className="text-left p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <p className="font-medium">Student</p>
              <p className="text-muted-foreground">student@company.com</p>
              <p className="text-muted-foreground">student123</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
