"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowRight, Heart, KeyRound } from "lucide-react";
import { FloatingElements } from "@/components/floating-elements";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        try {
            if (password !== passwordConfirmation) {
                throw new Error("Passwords do not match.");
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        code,
                        password,
                        password_confirmation: passwordConfirmation,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to reset password.");
            }

            setMessage(data.message);

            // Redirect to login after success
            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-light text-foreground mb-2">
                    Reset Password
                </h1>
                <p className="text-muted-foreground">
                    Enter the code sent to your email and your new password.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Identification (Read Only or Editable if needed) */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                    </label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-4 py-6 text-lg bg-muted/50"
                        required
                    />
                </div>

                {/* OTP Code */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        6-Digit Code
                    </label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="123456"
                            className="pl-10 py-6 text-lg tracking-widest"
                            maxLength={6}
                            required
                        />
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                            className="pl-10 py-6 text-lg"
                            required
                            minLength={8}
                        />
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="Confirm new password"
                            className="pl-10 py-6 text-lg"
                            required
                            minLength={8}
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                {message && (
                    <p className="text-sm text-green-600 text-center">{message}</p>
                )}

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
                            Reset Password
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
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

                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>

                <p className="text-center mt-6 text-muted-foreground text-sm">
                    <Link href="/login" className="hover:text-foreground transition-colors">
                        ← Back to Login
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
