"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Heart } from "lucide-react";
import { FloatingElements } from "@/components/floating-elements";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            setMessage(data.message);
            // Optional: Delay redirect to let user read message
            setTimeout(() => {
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 1500);

        } catch (err: any) {
            setError(err.message || "Failed to send reset code.");
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
                        <h1 className="text-2xl font-light text-foreground mb-2">
                            Forgot Password
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your email to receive a 6-digit reset code.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email Address
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
                                    Send Code
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-6 text-muted-foreground text-sm">
                    <Link href="/login" className="hover:text-foreground transition-colors">
                        ← Back to Login
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
