"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { FloatingElements } from "@/components/floating-elements";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  try {
    // 1️⃣ GET CSRF COOKIE (MANDATORY FOR SANCTUM SPA)
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`,
      {
        method: "GET",
        credentials: "include", // 🔥 REQUIRED
      }
    );

    // 2️⃣ LOGIN (SESSION-BASED)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        credentials: "include", // 🔥 REQUIRED
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const message =
        data?.errors
          ? Object.values(data.errors).flat().join(" ")
          : data?.message || "Invalid email or password.";
      throw new Error(message);
    }

    // ✅ OPTIONAL: keep token if you want hybrid auth
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    }

    // ✅ SESSION IS NOW ESTABLISHED
    router.replace("/dashboard");

  } catch (err: any) {
    setError(err.message || "Something went wrong.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingElements density="low" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 12 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Heart className="h-10 w-10 text-primary fill-primary" />
          </motion.div>
          <span className="text-3xl font-semibold tracking-wide text-foreground">
            Tohfaah
          </span>
        </Link>

        {/* Card */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-light text-foreground mb-2">
              Welcome <span className="italic text-primary">back</span>
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue creating memories
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10 py-6 text-lg"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="pl-10 pr-12 py-6 text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
            
              </span>
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Heart className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-muted-foreground text-sm">
          <Link href="/" className="hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
