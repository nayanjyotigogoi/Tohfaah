"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Mail, Lock, User, ArrowRight } from "lucide-react";
import { FloatingElements } from "@/components/floating-elements";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms & Privacy Policy.");
      return;
    }

    // Password rules:
    // - Minimum 8 characters
    // - At least 1 uppercase
    // - At least 1 lowercase
    // - At least 1 number
    // - At least 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be 8+ characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: confirmPassword,
            terms_accepted: true,
          }),
        }
      );

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        // If backend returns non-JSON (prevents CORS-like crash)
        throw new Error("Server error. Please try again.");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Signup failed.");
      }

      window.location.href = data.redirect || "/login";
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
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
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Heart className="h-10 w-10 text-primary fill-primary" />
          <span className="text-3xl font-semibold">Tohfaah</span>
        </Link>

        <div className="bg-card/80 backdrop-blur-sm border rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-light mb-2">
              Join <span className="italic text-primary">Tohfaah</span>
            </h1>
            <p className="text-muted-foreground">
              Start creating unforgettable memories
            </p>
          </div>


          <div className="mb-6">
            <Button
              variant="outline"
              className="w-full py-6 text-lg border-2 hover:bg-rose-50 hover:text-primary transition-colors hover:border-primary/20"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputBlock
              label="Your Name"
              icon={<User />}
              value={name}
              onChange={setName}
              type="text"
            />
            <InputBlock
              label="Email"
              icon={<Mail />}
              value={email}
              onChange={setEmail}
              type="email"
            />
            <InputBlock
              label="Password"
              icon={<Lock />}
              value={password}
              onChange={setPassword}
              type="password"
            />
            <InputBlock
              label="Confirm Password"
              icon={<Lock />}
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
            />

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the{" "}
                <Link href="/legal/terms-of-service" className="text-primary underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy-policy" className="text-primary underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-lg bg-primary text-primary-foreground"
            >
              {isLoading ? "Creating account…" : "Create Account"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}

/* Helper */
function InputBlock({ label, icon, value, onChange, type }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 py-6 text-lg"
          required
        />
      </div>
    </div>
  );
}
