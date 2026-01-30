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

    if (!termsAccepted) {
      setError("You must accept the Terms & Privacy Policy.");
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("auth_token", data.token);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputBlock label="Your Name" icon={<User />} value={name} onChange={setName} type="text" />
            <InputBlock label="Email" icon={<Mail />} value={email} onChange={setEmail} type="email" />
            <InputBlock label="Password" icon={<Lock />} value={password} onChange={setPassword} type="password" />
            <InputBlock label="Confirm Password" icon={<Lock />} value={confirmPassword} onChange={setConfirmPassword} type="password" />

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
                <Link href="/terms" className="text-primary underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

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
