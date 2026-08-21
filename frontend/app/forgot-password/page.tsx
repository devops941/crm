"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailIcon, CheckCircleIcon, ArrowLeftIcon } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate async call
    setTimeout(() => {
      console.log("API CALL: requestPasswordReset", { email });
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="pt-8 pb-8 px-6 sm:px-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
                KI
              </div>
              <h1 className="text-xl font-bold">Reset your password</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <CheckCircleIcon className="size-12 text-green-500" />
                <p className="text-sm text-foreground font-medium">
                  If an account exists with this email, a reset link has been sent.
                </p>
                <p className="text-xs text-muted-foreground">
                  Check your inbox and spam folder. The link expires in 1 hour.
                </p>
                <Link
                  href="/login"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ArrowLeftIcon className="size-3.5" />
                  Back to Sign In
                </Link>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@kaizen.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? "Sending…" : "Send Reset Link"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeftIcon className="size-3.5" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
